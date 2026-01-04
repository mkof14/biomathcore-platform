
import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
// @ts-ignore
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

function renderTemplate(template: string, data: Record<string, any>): string {
  if (!template) {
    return '';
  }
  let rendered = template;
  for (const key in data) {
    const regex = new RegExp(`{{\s*${key}\s*}}`, 'g');
    rendered = rendered.replace(regex, data[key]);
  }
  return rendered;
}

export const POST: APIRoute = async ({ request }) => {
  const { to, templateSlug, templateData, language = 'en' } = await request.json();

  if (!to || !templateSlug || !templateData) {
    return new Response(JSON.stringify({ error: 'Missing required fields: to, templateSlug, templateData' }), { status: 400 });
  }

  try {
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('slug', templateSlug)
      .single();

    if (templateError || !template) {
      console.error('Template not found:', templateError);
      return new Response(JSON.stringify({ error: `Email template "${templateSlug}" not found.` }), { status: 404 });
    }

    const subjectTemplate = language === 'ru' ? template.subject_ru : template.subject_en;
    const bodyTemplate = language === 'ru' ? template.body_ru : template.body_en;

    const subject = renderTemplate(subjectTemplate, templateData);
    const html = renderTemplate(bodyTemplate, templateData);
    const fromAddress = import.meta.env.EMAIL_FROM || 'BioMath Core <noreply@biomathcore.com>';

    await resend.emails.send({
      from: fromAddress,
      to: [to],
      subject: subject,
      html: html,
    });

    return new Response(JSON.stringify({ message: 'Email sent successfully' }), { status: 200 });

  } catch (error: any) {
    console.error(`Error sending ${templateSlug} email:`, error);
    return new Response(JSON.stringify({ error: `Failed to send email: ${error.message}` }), { status: 500 });
  }
};
