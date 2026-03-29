import { Router } from 'express';
import { z } from 'zod';
import { db, now } from '../services/firestore';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';
import { createError } from '../middleware/errorHandler';

const router = Router();

const evaluationSchema = z.object({
  type:          z.enum(['event', 'organization']),
  targetId:      z.string().min(1),
  targetName:    z.string().min(1),
  ratings:       z.record(z.string(), z.number().min(1).max(5)),
  comments:      z.string().min(10),
  attachmentUrl: z.string().url().optional(),
});

// POST /api/evaluations
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const parsed = evaluationSchema.safeParse(req.body);
    if (!parsed.success) throw createError(parsed.error.message);

    const docRef = await db().collection('evaluations').add({
      ...parsed.data,
      submittedBy:  req.user!.uid,
      submittedAt:  now(),
    });

    res.status(201).json({ id: docRef.id });
  } catch (err) {
    next(err);
  }
});

// GET /api/evaluations/insights — officer+
router.get('/insights', authMiddleware, requireRole('officer'), async (_req, res, next) => {
  try {
    const snap = await db().collection('evaluations').get();
    const evals = snap.docs.map((d) => d.data());

    if (evals.length === 0) {
      res.json({ averages: [], byType: [] });
      return;
    }

    // Aggregate average ratings across all keys
    const ratingTotals: Record<string, { sum: number; count: number }> = {};
    for (const ev of evals) {
      const ratings = ev.ratings as Record<string, number>;
      for (const [key, val] of Object.entries(ratings)) {
        if (!ratingTotals[key]) ratingTotals[key] = { sum: 0, count: 0 };
        ratingTotals[key].sum += val;
        ratingTotals[key].count += 1;
      }
    }

    const averages = Object.entries(ratingTotals).map(([name, { sum, count }]) => ({
      name,
      value: Math.round((sum / count) * 10) / 10,
    }));

    // Count by type
    const typeCounts: Record<string, number> = {};
    for (const ev of evals) {
      typeCounts[ev.type as string] = (typeCounts[ev.type as string] ?? 0) + 1;
    }

    const byType = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));

    res.json({ averages, byType, total: evals.length });
  } catch (err) {
    next(err);
  }
});

export default router;
