// documents.ts
import { Router } from 'express';
import { db, now } from '../services/firestore';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const snap = await db().collection('documents').orderBy('createdAt', 'desc').get();
    res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (err) { next(err); }
});

router.post('/upload', authMiddleware, requireRole('officer'), async (req, res, next) => {
  try {
    const docRef = await db().collection('documents').add({
      ...req.body,
      uploadedBy: req.user!.uid,
      createdAt:  now(),
    });
    res.status(201).json({ id: docRef.id });
  } catch (err) { next(err); }
});

export default router;
