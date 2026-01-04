
import type { APIRoute } from 'astro';
// @ts-ignore
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);
const fromAddress = import.meta.env.EMAIL_FROM || 'BioMath Core <noreply@biomathcore.com>';

export const POST: APIRoute = async ({ request }) => {
  const { to, subject, html } = await request.json();

  if (!to || !subject || !html) {
    return new Response(JSON.stringify({ error: 'Missing required fields: to, subject, html' }), { status: 400 });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('Resend error:', error);
      return new Response(JSON.stringify({ error: 'Failed to send email', details: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'Email sent successfully', messageId: data?.id }), { status: 200 });

  } catch (error: any) {
    console.error(`Error sending test email:`, error);
    return new Response(JSON.stringify({ error: `Failed to send email: ${error.message}` }), { status: 500 });
  }
};
