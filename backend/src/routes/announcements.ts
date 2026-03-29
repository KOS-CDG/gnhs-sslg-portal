import { Router } from 'express';
import { z } from 'zod';
import { db, now } from '../services/firestore';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';
import { createError } from '../middleware/errorHandler';

const router = Router();

const announcementSchema = z.object({
  title:         z.string().min(1),
  content:       z.string().min(1),
  category:      z.enum(['Events', 'Deadlines', 'Notices', 'Resolutions', 'Memorandums', 'Activities']),
  isPinned:      z.boolean().default(false),
  attachmentUrl: z.string().url().optional(),
});

// GET /api/announcements
router.get('/', async (_req, res, next) => {
  try {
    const snap = await db()
      .collection('announcements')
      .orderBy('createdAt', 'desc')
      .get();

    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// POST /api/announcements — officer+
router.post('/', authMiddleware, requireRole('officer'), async (req, res, next) => {
  try {
    const parsed = announcementSchema.safeParse(req.body);
    if (!parsed.success) throw createError(parsed.error.message);

    const docRef = await db().collection('announcements').add({
      ...parsed.data,
      authorId:   req.user!.uid,
      authorName: req.user!.displayName,
      createdAt:  now(),
      updatedAt:  now(),
    });

    res.status(201).json({ id: docRef.id });
  } catch (err) {
    next(err);
  }
});

// PUT /api/announcements/:id — officer+
router.put('/:id', authMiddleware, requireRole('officer'), async (req, res, next) => {
  try {
    const parsed = announcementSchema.partial().safeParse(req.body);
    if (!parsed.success) throw createError(parsed.error.message);

    await db()
      .collection('announcements')
      .doc(req.params.id)
      .update({ ...parsed.data, updatedAt: now() });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/announcements/:id — super_admin only
router.delete('/:id', authMiddleware, requireRole('super_admin'), async (req, res, next) => {
  try {
    await db().collection('announcements').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
