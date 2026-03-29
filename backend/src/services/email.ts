import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  await transporter.sendMail({
    from: `"GNHS SSLG" <${process.env.EMAIL_USER}>`,
    ...payload,
  });
}

// ── Email templates ───────────────────────────────────────────────────────────

export function eventRegistrationEmail(params: {
  name: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
}): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #E91E8C; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">GNHS SSLG</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0;">Event Registration Confirmed</p>
      </div>
      <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px;">
        <p style="color: #333;">Hi <strong>${params.name}</strong>,</p>
        <p style="color: #555;">You have successfully registered for:</p>
        <div style="background: white; border-left: 4px solid #E91E8C; padding: 16px; margin: 16px 0; border-radius: 4px;">
          <p style="margin: 0; font-weight: bold; color: #333;">${params.eventTitle}</p>
          <p style="margin: 4px 0 0; color: #777; font-size: 14px;">📅 ${params.eventDate}</p>
          <p style="margin: 4px 0 0; color: #777; font-size: 14px;">📍 ${params.eventLocation}</p>
        </div>
        <p style="color: #555; font-size: 14px;">
          Please arrive on time. For questions, contact us at ${process.env.EMAIL_USER}.
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">
          — GNHS Supreme Secondary Learner Government
        </p>
      </div>
    </div>
  `;
}

export function requestReceivedEmail(params: {
  name: string;
  requestType: string;
}): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #E91E8C; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">GNHS SSLG</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0;">Request Received</p>
      </div>
      <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px;">
        <p style="color: #333;">Hi <strong>${params.name}</strong>,</p>
        <p style="color: #555;">
          Your <strong>${params.requestType}</strong> request has been received and is now under review.
          We will get back to you as soon as possible.
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">
          — GNHS Supreme Secondary Learner Government
        </p>
      </div>
    </div>
  `;
}
