import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASSWORD,
  SUBSCRIPTION_FROM_EMAIL,
  SUBSCRIPTION_SITE_NAME
} = import.meta.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT ? Number.parseInt(SMTP_PORT, 10) : 587,
  secure: SMTP_SECURE === 'true' || SMTP_SECURE === '1',
  auth:
    SMTP_USER && SMTP_PASSWORD
      ? {
          user: SMTP_USER,
          pass: SMTP_PASSWORD
        }
      : undefined
});

async function sendConfirmationEmail(email: string) {
  if (!SMTP_HOST) {
    throw new Error('SMTP_HOST is not configured. Check your environment variables.');
  }

  const siteName = SUBSCRIPTION_SITE_NAME ?? 'our mailing list';
  const fromAddress = SUBSCRIPTION_FROM_EMAIL ?? SMTP_USER;

  if (!fromAddress) {
    throw new Error(
      'SUBSCRIPTION_FROM_EMAIL (or SMTP_USER) must be defined so we can send the confirmation email.'
    );
  }

  await transporter.sendMail({
    to: email,
    from: fromAddress,
    subject: `Потвърждение за абонамент за ${siteName}`,
    text: [
      `Здравей!`,
      '',
      `Този имейл потвърждава, че адресът ${email} беше успешно добавен към списъка за новини на ${siteName}.`,
      '',
      'Ако това не си бил ти, просто игнорирай този имейл.'
    ].join('\n'),
    html: `
      <p>Здравей!</p>
      <p>Този имейл потвърждава, че адресът <strong>${email}</strong> беше успешно добавен към списъка за новини на ${siteName}.</p>
      <p>Ако това не си бил ти, просто игнорирай този имейл.</p>
    `
  });
}

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const email = formData.get('email');

    if (typeof email !== 'string' || email.trim().length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Моля, въведи валиден имейл адрес.'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await sendConfirmationEmail(email.trim());

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Възникна проблем при изпращането на имейла. Опитай отново по-късно.'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
