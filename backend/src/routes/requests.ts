import { Router } from 'express';
import { z } from 'zod';
import { db, now } from '../services/firestore';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';
import { createError } from '../middleware/errorHandler';
import { sendEmail, requestReceivedEmail } from '../services/email';
import { snakeToTitle } from './utils';

const router = Router();

const requestSchema = z.object({
  type:         z.enum(['financial_assistance', 'event_support', 'document_request', 'office_usage', 'feedback', 'concern']),
  message:      z.string().min(10),
  name:         z.string().optional(),
  gradeSection: z.string().optional(),
  isAnonymous:  z.boolean().default(false),
});

const statusSchema = z.object({
  status: z.enum(['pending', 'in_review', 'approved', 'rejected', 'resolved']),
  notes:  z.string().optional(),
});

// POST /api/requests — public
router.post('/', async (req, res, next) => {
  try {
    const parsed = requestSchema.safeParse(req.body);
    if (!parsed.success) throw createError(parsed.error.message);

    const docRef = await db().collection('requests').add({
      ...parsed.data,
      submittedBy: parsed.data.isAnonymous ? 'anonymous' : (parsed.data.name ?? 'unknown'),
      status:      'pending',
      createdAt:   now(),
      updatedAt:   now(),
    });

    // Email confirmation (non-anonymous with contact info only)
    if (!parsed.data.isAnonymous && parsed.data.name) {
      await sendEmail({
        to:      process.env.EMAIL_USER!,
        subject: `New Request: ${snakeToTitle(parsed.data.type)}`,
        html: requestReceivedEmail({
          name:        parsed.data.name,
          requestType: snakeToTitle(parsed.data.type),
        }),
      }).catch(console.error);
    }

    res.status(201).json({ id: docRef.id });
  } catch (err) {
    next(err);
  }
});

// GET /api/requests — officer+
router.get('/', authMiddleware, requireRole('officer'), async (_req, res, next) => {
  try {
    const snap = await db()
      .collection('requests')
      .orderBy('createdAt', 'desc')
      .get();

    res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (err) {
    next(err);
  }
});

// PUT /api/requests/:id/status — officer+
router.put('/:id/status', authMiddleware, requireRole('officer'), async (req, res, next) => {
  try {
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) throw createError(parsed.error.message);

    await db().collection('requests').doc(req.params.id).update({
      status:    parsed.data.status,
      notes:     parsed.data.notes ?? null,
      handledBy: req.user!.uid,
      updatedAt: now(),
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
