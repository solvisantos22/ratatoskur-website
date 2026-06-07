'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SectionHeading } from '../SectionHeading';

const CONTACT_EMAIL = 'hello@ratatoskur.is';

export function Contact() {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('bad status');
      setStatus('ok');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  const field: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--surface-2)', background: 'var(--surface)', color: 'var(--ink)', fontSize: 15 };
  const label: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 6 };

  return (
    <section id="contact" style={{ background: 'var(--surface)', borderTop: '1px solid var(--surface-2)', scrollMarginTop: 80 }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '64px 22px' }}>
        <SectionHeading title={t('title')} lead={t('lead')} />
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 16 }} noValidate>
          {/* honeypot, visually hidden */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 16 }}>
            <div><label style={label} htmlFor="name">{t('name')}</label><input style={field} id="name" name="name" required /></div>
            <div><label style={label} htmlFor="email">{t('email')}</label><input style={field} id="email" name="email" type="email" required /></div>
          </div>
          <div><label style={label} htmlFor="organization">{t('organization')}</label><input style={field} id="organization" name="organization" required /></div>
          <div><label style={label} htmlFor="message">{t('message')}</label><textarea style={{ ...field, minHeight: 120, resize: 'vertical' }} id="message" name="message" required /></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <button type="submit" className="press" disabled={status === 'sending'} style={{ background: 'var(--cta)', color: 'var(--on-accent)', fontWeight: 600, fontSize: 15, padding: '11px 20px', borderRadius: 'var(--r-md)', border: 'none', cursor: 'pointer', opacity: status === 'sending' ? 0.7 : 1 }}>
              {status === 'sending' ? t('sending') : t('send')}
            </button>
            <span style={{ fontSize: 14, color: 'var(--muted)' }}>{t('mailto')} <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--accent-2)', fontWeight: 600 }}>{CONTACT_EMAIL}</a></span>
          </div>
          <p role="status" aria-live="polite" style={{ minHeight: 22, margin: 0, color: status === 'error' ? 'var(--accent-2)' : 'var(--ink)' }}>
            {status === 'ok' ? t('success') : status === 'error' ? t('error') : ''}
          </p>
        </form>
      </div>
    </section>
  );
}
