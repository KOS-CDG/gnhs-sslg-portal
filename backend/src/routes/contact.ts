import { Router } from 'express';
import { z } from 'zod';
import { sendEmail } from '../services/email';
import { createError } from '../middleware/errorHandler';

const router = Router();

const contactSchema = z.object({
  name:         z.string().min(2),
  gradeSection: z.string().min(2),
  concernType:  z.string().min(1),
  message:      z.string().min(10),
});

router.post('/', async (req, res, next) => {
  try {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) throw createError(parsed.error.message);

    await sendEmail({
      to:      process.env.EMAIL_USER!,
      subject: `[SSLG Contact] ${parsed.data.concernType} — ${parsed.data.name}`,
      html: `
        <p><strong>From:</strong> ${parsed.data.name} (${parsed.data.gradeSection})</p>
        <p><strong>Concern Type:</strong> ${parsed.data.concernType}</p>
        <hr/>
        <p>${parsed.data.message.replace(/\n/g, '<br/>')}</p>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
