import { Router } from 'express';
import { z } from 'zod';
import { db, now } from '../services/firestore';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';
import { createError } from '../middleware/errorHandler';
import { sendEmail, eventRegistrationEmail } from '../services/email';
import { format } from 'date-fns';

const router = Router();

const registrationSchema = z.object({
  name:         z.string().min(2),
  gradeSection: z.string().min(2),
  contact:      z.string().min(7),
  organization: z.string().optional(),
});

// GET /api/events
router.get('/', async (_req, res, next) => {
  try {
    const snap = await db()
      .collection('events')
      .orderBy('dateTime', 'asc')
      .get();

    res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (err) {
    next(err);
  }
});

// POST /api/events — officer+
router.post('/', authMiddleware, requireRole('officer'), async (req, res, next) => {
  try {
    const docRef = await db().collection('events').add({
      ...req.body,
      currentParticipants: 0,
      status: 'upcoming',
      createdAt: now(),
    });
    res.status(201).json({ id: docRef.id });
  } catch (err) {
    next(err);
  }
});

// POST /api/events/:id/register
router.post('/:id/register', async (req, res, next) => {
  try {
    const parsed = registrationSchema.safeParse(req.body);
    if (!parsed.success) throw createError(parsed.error.message);

    const eventRef  = db().collection('events').doc(req.params.id);
    const eventSnap = await eventRef.get();

    if (!eventSnap.exists) throw createError('Event not found.', 404);

    const event = eventSnap.data()!;

    if (!event.registrationOpen) throw createError('Registration is closed.', 409);

    if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
      throw createError('This event is fully booked.', 409);
    }

    // Save registration
    await db().collection('registrations').add({
      ...parsed.data,
      eventId:      req.params.id,
      registeredAt: now(),
    });

    // Increment participant count
    await eventRef.update({
      currentParticipants: event.currentParticipants + 1,
    });

    // Send confirmation email (best-effort)
    if (parsed.data.contact.includes('@')) {
      const dateTime = event.dateTime?.toDate?.() ?? new Date(event.dateTime);
      await sendEmail({
        to:      parsed.data.contact,
        subject: `Registration Confirmed — ${event.title}`,
        html: eventRegistrationEmail({
          name:          parsed.data.name,
          eventTitle:    event.title,
          eventDate:     format(dateTime, 'MMMM d, yyyy · h:mm a'),
          eventLocation: event.location,
        }),
      }).catch(console.error);
    }

    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
