import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import nodemailer from 'nodemailer';
import { format } from 'date-fns';

const EMAIL_USER     = functions.config().email?.user     ?? process.env.EMAIL_USER     ?? '';
const EMAIL_PASSWORD = functions.config().email?.password ?? process.env.EMAIL_PASSWORD ?? '';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: EMAIL_USER, pass: EMAIL_PASSWORD },
});

/**
 * Triggered whenever a new document is created in the `registrations` collection.
 * Sends a confirmation email to the registrant (if their contact is an email address).
 */
export const onEventRegistration = functions.firestore
  .document('registrations/{registrationId}')
  .onCreate(async (snap) => {
    const registration = snap.data();
    const contact: string = registration.contact ?? '';

    // Only send email if contact looks like an email address
    if (!contact.includes('@')) return null;

    // Fetch the related event
    const eventSnap = await admin
      .firestore()
      .collection('events')
      .doc(registration.eventId as string)
      .get();

    if (!eventSnap.exists) return null;

    const event = eventSnap.data()!;
    const dateTime: Date =
      event.dateTime?.toDate?.() ?? new Date(event.dateTime as string);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #E91E8C; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 22px;">GNHS SSLG</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0;">
            Event Registration Confirmed
          </p>
        </div>
        <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px;">
          <p style="color: #333;">
            Hi <strong>${registration.name as string}</strong>,
          </p>
          <p style="color: #555;">
            You have successfully registered for the following event:
          </p>
          <div style="background: white; border-left: 4px solid #E91E8C; padding: 16px;
                      margin: 16px 0; border-radius: 0 8px 8px 0;">
            <p style="margin: 0; font-weight: bold; color: #111; font-size: 16px;">
              ${event.title as string}
            </p>
            <p style="margin: 6px 0 0; color: #666; font-size: 14px;">
              📅 ${format(dateTime, 'MMMM d, yyyy · h:mm a')}
            </p>
            <p style="margin: 4px 0 0; color: #666; font-size: 14px;">
              📍 ${event.location as string}
            </p>
          </div>
          <p style="color: #555; font-size: 14px; line-height: 1.6;">
            Please arrive on time. If you have questions, reach us on Facebook
            or reply to this email.
          </p>
          <p style="color: #aaa; font-size: 12px; margin-top: 24px;">
            — GNHS Supreme Secondary Learner Government<br/>
            <em>"Happy, Ready, and Willing to Serve"</em>
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from:    `"GNHS SSLG" <${EMAIL_USER}>`,
      to:      contact,
      subject: `Registration Confirmed — ${event.title as string}`,
      html,
    });

    functions.logger.info(
      `Registration email sent to ${contact} for event ${registration.eventId as string}`
    );

    return null;
  });
