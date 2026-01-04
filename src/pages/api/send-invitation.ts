
import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { renderTemplate } from '../../lib/emailProvider';
// @ts-ignore
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  const { invitation } = await request.json();

  if (!invitation) {
    return new Response(JSON.stringify({ error: 'Invitation data is required' }), { status: 400 });
  }

  try {
    // 1. Получить шаблон из БД
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('slug', 'invitation_welcome')
      .single();

    if (templateError || !template) {
      console.error('Template not found:', templateError);
      return new Response(JSON.stringify({ error: 'Email template "invitation_welcome" not found.' }), { status: 404 });
    }

    // 2. Подготовить данные для шаблона
    const templateData = {
      recipient_name: invitation.first_name || invitation.email,
      invitation_code: invitation.code,
      plan_name: invitation.plan_type,
      duration: `${invitation.duration_months} months`,
      expiry_date: new Date(invitation.expires_at).toLocaleDateString(),
      redemption_link: `https://biomathcore.com/#/redeem-invitation?code=${invitation.code}`
    };

    // 3. Отрендерить HTML и тему письма
    const subject = renderTemplate(template.subject_en, templateData);
    const html = renderTemplate(template.body_en, templateData);
    const fromAddress = import.meta.env.EMAIL_FROM || 'BioMath Core <noreply@biomathcore.com>';

    // 4. Отправить письмо
    await resend.emails.send({
      from: fromAddress,
      to: [invitation.email],
      subject: subject,
      html: html,
    });

    return new Response(JSON.stringify({ message: 'Invitation sent successfully' }), { status: 200 });

  } catch (error) {
    console.error('Error sending invitation:', error);
    return new Response(JSON.stringify({ error: 'Failed to send invitation' }), { status: 500 });
  }
};
