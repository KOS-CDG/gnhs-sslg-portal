import { Router } from 'express';
import { z } from 'zod';
import { db, now } from '../services/firestore';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';
import { createError } from '../middleware/errorHandler';

const router = Router();

const SCS_COMMITTEES = [
  'Academic Affairs', 'Student Welfare', 'Cultural and Arts',
  'Sports and Health', 'Environment', 'Finance', 'Communications',
] as const;

const applySchema = z.object({
  fullName:     z.string().min(2),
  gradeSection: z.string().min(2),
  committee:    z.enum(SCS_COMMITTEES),
  skills:       z.array(z.string()).min(1),
  interests:    z.array(z.string()).min(1),
});

// GET /api/scs/members — officer+
router.get('/members', authMiddleware, requireRole('officer'), async (_req, res, next) => {
  try {
    const snap = await db()
      .collection('scs_members')
      .orderBy('joinedAt', 'desc')
      .get();

    res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (err) {
    next(err);
  }
});

// POST /api/scs/apply — authenticated
router.post('/apply', authMiddleware, async (req, res, next) => {
  try {
    const parsed = applySchema.safeParse(req.body);
    if (!parsed.success) throw createError(parsed.error.message);

    // Check for duplicate application
    const existing = await db()
      .collection('scs_members')
      .where('uid', '==', req.user!.uid)
      .where('status', 'in', ['active', 'probationary'])
      .get();

    if (!existing.empty) {
      throw createError('You already have an active SCS membership.', 409);
    }

    const docRef = await db().collection('scs_members').add({
      ...parsed.data,
      uid:        req.user!.uid,
      attendance: [],
      tasks:      [],
      status:     'probationary',
      joinedAt:   now(),
    });

    res.status(201).json({ id: docRef.id });
  } catch (err) {
    next(err);
  }
});

export default router;
