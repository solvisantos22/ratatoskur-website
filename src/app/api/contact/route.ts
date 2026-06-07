import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Resend } from 'resend';
import { contactSchema } from '@/lib/contact-schema';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Honeypot check: if website field is non-empty, silently accept without sending.
  if (
    body !== null &&
    typeof body === 'object' &&
    'website' in (body as object) &&
    typeof (body as Record<string, unknown>).website === 'string' &&
    (body as Record<string, unknown>).website !== ''
  ) {
    return NextResponse.json({ ok: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Email not configured' }, { status: 503 });
  }

  const to = process.env.CONTACT_TO_EMAIL ?? 'hello@ratatoskur.is';
  const from = process.env.CONTACT_FROM_EMAIL ?? 'Ratatoskur <onboarding@resend.dev>';
  const { name, email, organization, message } = parsed.data;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Ratatoskur contact: ${organization}`,
      text: `From: ${name} <${email}>\nOrganization / role: ${organization}\n\n${message}`,
    });
    if (error) return NextResponse.json({ error: 'Failed to send' }, { status: 502 });
  } catch {
    return NextResponse.json({ error: 'Failed to send' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
