import { useState } from 'react';
import { AlertCircle, CheckCircle2, Facebook, Loader2, Mail, Phone, Send } from 'lucide-react';
import SectionTitle from '../components/SectionTitle.jsx';
import { sendContact } from '../services/api.js';
import { profile } from '../data/profile.js';

// Keep these limits the same as backend/src/utils/validate.js
const LIMITS = { nameMin: 2, nameMax: 80, emailMax: 254, messageMin: 10, messageMax: 2000 };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate({ name, email, message }) {
  const errors = {};
  const n = name.trim();
  const e = email.trim();
  const m = message.trim();

  if (!n) errors.name = 'Name is required.';
  else if (n.length < LIMITS.nameMin) errors.name = `Name must be at least ${LIMITS.nameMin} characters.`;
  else if (n.length > LIMITS.nameMax) errors.name = `Name must be at most ${LIMITS.nameMax} characters.`;

  if (!e) errors.email = 'Email is required.';
  else if (e.length > LIMITS.emailMax || !EMAIL_PATTERN.test(e)) errors.email = 'Please enter a valid email address.';

  if (!m) errors.message = 'Message is required.';
  else if (m.length < LIMITS.messageMin) errors.message = `Message must be at least ${LIMITS.messageMin} characters.`;
  else if (m.length > LIMITS.messageMax) errors.message = `Message must be at most ${LIMITS.messageMax} characters.`;

  return errors;
}

const EMPTY = { name: '', email: '', message: '' };

export default function Contact() {
  const { email, phone, phoneNote, facebookName, facebookUrl } = profile.contact;
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [feedback, setFeedback] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus('idle');
      setFeedback('');
      return;
    }

    setStatus('loading');
    setFeedback('');
    try {
      const message = await sendContact(form);
      setStatus('success');
      setFeedback(message || 'Thank you! Your message has been sent.');
      setForm(EMPTY);
    } catch (err) {
      setStatus('error');
      setFeedback(err.message);
      if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) setErrors(err.fieldErrors);
    }
  };

  const fieldProps = (name) => ({
    id: `contact-${name}`,
    name,
    value: form[name],
    onChange,
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `contact-${name}-error` : undefined,
    disabled: status === 'loading',
  });

  const renderError = (name) =>
    errors[name] ? (
      <p className="field__error" id={`contact-${name}-error`}>{errors[name]}</p>
    ) : null;

  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="container">
        <SectionTitle id="contact-title" title="Contacts" subtitle="Send me a message or reach me directly." />

        <div className="contact">
          <ul className="contact__list">
            <li>
              <span className="contact__label">G-mail:</span>
              <a className="contact__value" href={`mailto:${email}`}>
                <Mail size={22} aria-hidden="true" /> <span>{email}</span>
              </a>
            </li>
            <li>
              <span className="contact__label">Facebook:</span>
              {facebookUrl ? (
                <a className="contact__value" href={facebookUrl} target="_blank" rel="noopener noreferrer">
                  <Facebook size={22} aria-hidden="true" /> <span>{facebookName}</span>
                </a>
              ) : (
                <span className="contact__value">
                  <Facebook size={22} aria-hidden="true" /> <span>{facebookName}</span>
                </span>
              )}
            </li>
            <li>
              <span className="contact__label">Phone Number:</span>
              <a className="contact__value" href={`tel:${phone.replace(/\s/g, '')}`}>
                <Phone size={22} aria-hidden="true" /> <span>{phone}{phoneNote ? ` (${phoneNote})` : ''}</span>
              </a>
            </li>
          </ul>

          <form className="card contact__form" onSubmit={onSubmit} noValidate>
            <h3>Send a message</h3>

            <div className="field">
              <label htmlFor="contact-name">Name</label>
              <input type="text" autoComplete="name" maxLength={LIMITS.nameMax} required {...fieldProps('name')} />
              {renderError('name')}
            </div>

            <div className="field">
              <label htmlFor="contact-email">Email</label>
              <input type="email" autoComplete="email" maxLength={LIMITS.emailMax} required {...fieldProps('email')} />
              {renderError('email')}
            </div>

            <div className="field">
              <label htmlFor="contact-message">Message</label>
              <textarea rows="5" maxLength={LIMITS.messageMax} required {...fieldProps('message')} />
              <p className="field__hint">{form.message.length}/{LIMITS.messageMax}</p>
              {renderError('message')}
            </div>

            <button className="btn btn--dark" type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? (
                <>
                  <Loader2 className="spin" size={18} aria-hidden="true" /> Sending…
                </>
              ) : (
                <>
                  <Send size={18} aria-hidden="true" /> Send message
                </>
              )}
            </button>

            <div className="form-feedback" role="status" aria-live="polite">
              {status === 'success' && (
                <p className="form-feedback__success">
                  <CheckCircle2 size={18} aria-hidden="true" /> {feedback}
                </p>
              )}
              {status === 'error' && (
                <p className="form-feedback__error">
                  <AlertCircle size={18} aria-hidden="true" /> {feedback}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
