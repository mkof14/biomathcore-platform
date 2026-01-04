import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { Resend } from 'resend';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

serve(async (req) => {
  const { to, subject, html } = await req.json();

  try {
    const { data, error } = await resend.emails.send({
      from: 'BioMath <noreply@biomath.ai>',
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
