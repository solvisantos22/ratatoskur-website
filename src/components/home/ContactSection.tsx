'use client';

import { type ChangeEvent, type FormEvent, useId, useState } from 'react';
import type { Locale } from '@/i18n/routing';
import styles from './Home.module.css';
import {
  type ContactErrorCode,
  type ContactField,
  type ContactFieldErrors,
  type ContactFormValues,
  emptyContactForm,
  normalizeServerIssues,
  validateContactDraft,
} from './contact-form-model';

type SubmitState = 'idle' | 'sending' | 'success' | 'validation' | 'error';

type FieldCopy = {
  label: string;
  placeholder: string;
};

const copy: Record<
  Locale,
  {
    kicker: string;
    title: string;
    lead: string;
    noteTitle: string;
    notes: string[];
    mailto: string;
    fields: Record<Exclude<ContactField, 'website'>, FieldCopy>;
    honeypot: string;
    submit: string;
    sending: string;
    status: Record<SubmitState, string>;
    errors: Record<ContactErrorCode, string>;
  }
> = {
  en: {
    kicker: 'School pilots',
    title: 'Bring Ratatoskur into a real classroom conversation.',
    lead:
      'Tell us what you teach, where students get stuck, and what kind of pilot would be useful. We will reply from hello@ratatoskur.is.',
    noteTitle: 'Good fit for',
    notes: [
      'Teachers who want students to keep showing written work.',
      'Schools exploring AI feedback without replacing the teacher.',
      'Pilot conversations around Icelandic math classrooms.',
    ],
    mailto: 'Prefer email? Write to hello@ratatoskur.is',
    fields: {
      name: { label: 'Your name', placeholder: 'Anna Jónsdóttir' },
      email: { label: 'Email', placeholder: 'anna@school.is' },
      organization: { label: 'School or role', placeholder: 'Menntaskóli, teacher, parent...' },
      message: {
        label: 'What should we know?',
        placeholder: 'Tell us about the students, topic, or pilot you want to discuss.',
      },
    },
    honeypot: 'Website',
    submit: 'Send inquiry',
    sending: 'Sending...',
    status: {
      idle: 'Fill out the form and we will get back to you.',
      sending: 'Sending your inquiry...',
      success: 'Thanks. Your message was sent and the form is ready for a new note.',
      validation: 'Please check the highlighted fields and try again.',
      error: 'We could not send the message. You can still email hello@ratatoskur.is.',
    },
    errors: {
      email: 'Enter a valid email address.',
      honeypot: 'Leave this field empty.',
      messageLength: 'Write at least 10 characters.',
      required: 'This field is required.',
      server: 'Please review this field.',
    },
  },
  is: {
    kicker: 'Tilraunir í skólum',
    title: 'Komdu Ratatoskur inn í alvöru samtal í kennslustofunni.',
    lead:
      'Segðu okkur hvað þú kennir, hvar nemendur festast og hvaða tilraun væri gagnleg. Við svörum frá hello@ratatoskur.is.',
    noteTitle: 'Hentar vel fyrir',
    notes: [
      'Kennara sem vilja að nemendur haldi áfram að sýna skriflega vinnu.',
      'Skóla sem skoða AI-endurgjöf án þess að skipta kennaranum út.',
      'Samtöl um tilraunir í íslenskum stærðfræðikennslustofum.',
    ],
    mailto: 'Viltu frekar senda póst? Skrifaðu á hello@ratatoskur.is',
    fields: {
      name: { label: 'Nafn', placeholder: 'Anna Jónsdóttir' },
      email: { label: 'Netfang', placeholder: 'anna@skoli.is' },
      organization: { label: 'Skóli eða hlutverk', placeholder: 'Menntaskóli, kennari, foreldri...' },
      message: {
        label: 'Hvað eigum við að vita?',
        placeholder: 'Segðu okkur frá bekknum, efninu eða tilrauninni sem þú vilt ræða.',
      },
    },
    honeypot: 'Vefsíða',
    submit: 'Senda fyrirspurn',
    sending: 'Sendi...',
    status: {
      idle: 'Fylltu út eyðublaðið og við höfum samband.',
      sending: 'Sendi fyrirspurnina...',
      success: 'Takk. Skilaboðin voru send og eyðublaðið er tilbúið fyrir nýja nótu.',
      validation: 'Athugaðu merktu reitina og reyndu aftur.',
      error: 'Ekki tókst að senda skilaboðin. Þú getur samt sent póst á hello@ratatoskur.is.',
    },
    errors: {
      email: 'Sláðu inn gilt netfang.',
      honeypot: 'Hafðu þennan reit tóman.',
      messageLength: 'Skrifaðu að minnsta kosti 10 stafi.',
      required: 'Þessi reitur er nauðsynlegur.',
      server: 'Athugaðu þennan reit.',
    },
  },
};

const fieldOrder: Array<Exclude<ContactField, 'website'>> = ['name', 'email', 'organization', 'message'];

type ContactResponse = {
  issues?: unknown;
};

export function ContactSection({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const idPrefix = useId();
  const [values, setValues] = useState<ContactFormValues>(emptyContactForm);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  const isSending = submitState === 'sending';

  function updateValue(field: ContactField) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const nextValue = event.target.value;
      setValues((current) => ({ ...current, [field]: nextValue }));
      setErrors((current) => {
        if (!(field in current)) return current;
        const nextErrors = { ...current };
        delete nextErrors[field];
        return nextErrors;
      });
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateContactDraft(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitState('validation');
      return;
    }

    setSubmitState('sending');
    setErrors({});

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const body = (await response.json().catch(() => null)) as ContactResponse | null;

      if (response.ok) {
        setValues(emptyContactForm);
        setSubmitState('success');
        return;
      }

      if (response.status === 400) {
        const serverErrors = normalizeServerIssues(body?.issues);
        setErrors(serverErrors);
        setSubmitState('validation');
        return;
      }

      setSubmitState('error');
    } catch {
      setSubmitState('error');
    }
  }

  function errorId(field: ContactField) {
    return `${idPrefix}-${field}-error`;
  }

  return (
    <section className={styles.contactSection} id="contact" aria-labelledby={`${idPrefix}-title`}>
      <div className={styles.contactCopy}>
        <p className={styles.kicker}>{text.kicker}</p>
        <h2 id={`${idPrefix}-title`}>{text.title}</h2>
        <p>{text.lead}</p>
        <div className={styles.contactNote}>
          <h3>{text.noteTitle}</h3>
          <ul>
            {text.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </div>

      <form className={styles.contactForm} onSubmit={handleSubmit} noValidate>
        {fieldOrder.map((field) => {
          const fieldId = `${idPrefix}-${field}`;
          const errorCode = errors[field];
          const hasError = errorCode !== undefined;
          const isMessage = field === 'message';
          const sharedProps = {
            id: fieldId,
            name: field,
            value: values[field],
            onChange: updateValue(field),
            disabled: isSending,
            'aria-invalid': hasError,
            'aria-describedby': hasError ? errorId(field) : undefined,
          };

          return (
            <div className={styles.formField} key={field}>
              <label htmlFor={fieldId}>{text.fields[field].label}</label>
              {isMessage ? (
                <textarea {...sharedProps} placeholder={text.fields[field].placeholder} rows={6} />
              ) : (
                <input
                  {...sharedProps}
                  autoComplete={field === 'email' ? 'email' : field === 'name' ? 'name' : 'organization'}
                  placeholder={text.fields[field].placeholder}
                  type={field === 'email' ? 'email' : 'text'}
                />
              )}
              {hasError ? (
                <p className={styles.fieldError} id={errorId(field)}>
                  {text.errors[errorCode]}
                </p>
              ) : null}
            </div>
          );
        })}

        <div className={styles.honeypotField} aria-hidden="true">
          <label htmlFor={`${idPrefix}-website`}>{text.honeypot}</label>
          <input
            id={`${idPrefix}-website`}
            name="website"
            value={values.website}
            onChange={updateValue('website')}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
        </div>

        <div className={styles.formFooter}>
          <p className={styles.formStatus} aria-live="polite">
            {text.status[submitState]}
          </p>
          <button className={styles.contactSubmit} type="submit" disabled={isSending}>
            {isSending ? text.sending : text.submit}
          </button>
        </div>

        <a className={styles.contactMailto} href="mailto:hello@ratatoskur.is">
          {text.mailto}
        </a>
      </form>
    </section>
  );
}
