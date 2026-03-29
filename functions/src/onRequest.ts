import * as functions from 'firebase-functions';
import nodemailer from 'nodemailer';

const EMAIL_USER     = functions.config().email?.user     ?? process.env.EMAIL_USER     ?? '';
const EMAIL_PASSWORD = functions.config().email?.password ?? process.env.EMAIL_PASSWORD ?? '';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: EMAIL_USER, pass: EMAIL_PASSWORD },
});

function snakeToTitle(str: string): string {
  return str
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Triggered when a new document lands in the `requests` collection.
 * Notifies the SSLG inbox and (optionally) sends an acknowledgement
 * to the submitter if they provided an email-style contact.
 */
export const onRequestSubmitted = functions.firestore
  .document('requests/{requestId}')
  .onCreate(async (snap, context) => {
    const request = snap.data();
    const requestId: string = context.params.requestId;
    const type = snakeToTitle(request.type as string);
    const isAnonymous: boolean = request.isAnonymous ?? false;
    const submitterName: string = isAnonymous
      ? 'Anonymous'
      : (request.name as string | undefined) ?? 'Unknown';

    // ── Notify SSLG inbox ────────────────────────────────────────────────
    const officerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #C0392B; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="color: white; margin: 0;">New ${type} Request</h2>
          <p style="color: rgba(255,255,255,0.8); font-size: 13px; margin: 4px 0 0;">
            Request ID: ${requestId}
          </p>
        </div>
        <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #555; width: 140px;">Submitted by</td>
              <td style="padding: 6px 0; color: #111; font-weight: 600;">${submitterName}</td>
            </tr>
            ${!isAnonymous && request.gradeSection ? `
            <tr>
              <td style="padding: 6px 0; color: #555;">Grade / Section</td>
              <td style="padding: 6px 0; color: #111;">${request.gradeSection as string}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 6px 0; color: #555;">Type</td>
              <td style="padding: 6px 0; color: #111;">${type}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #555; vertical-align: top;">Message</td>
              <td style="padding: 6px 0; color: #333; line-height: 1.6;">
                ${(request.message as string).replace(/\n/g, '<br/>')}
              </td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 12px; background: #fff3cd;
                      border-radius: 6px; font-size: 13px; color: #856404;">
            Log in to the SSLG Dashboard to review and update the request status.
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from:    `"GNHS SSLG Portal" <${EMAIL_USER}>`,
      to:      EMAIL_USER,
      subject: `[New Request] ${type} — ${submitterName}`,
      html:    officerHtml,
    });

    functions.logger.info(`Request notification sent for requestId=${requestId}, type=${type}`);

    return null;
  });
