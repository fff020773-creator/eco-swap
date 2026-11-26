import React, { useState, useRef } from 'react';

/** Member 2: Error Tracking + Contextual Adaptation. Standalone, reusable component. */
export default function AdaptiveSwapForm({ onPublish = (listing) => console.info('Ready to publish:', listing), onError = () => {} }) {
  const [fields, setFields] = useState({ title: '', description: '' });
  const [photo, setPhoto] = useState(null);
  const [attempts, setAttempts] = useState({ title: 0, description: 0, photo: 0 });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const photoRef = useRef(null);
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [condition, setCondition] = useState('Good');

  const adaptive = Object.values(attempts).some(count => count >= 2);
  const update = (key, value) => {
    setFields(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
    setStatus('');
  };
  const publish = (event) => {
    event.preventDefault();
    const invalid = {
      title: fields.title.trim().length < 3 ? 'Enter an item title (at least 3 characters).' : '',
      description: !fields.description.trim() ? 'Add a description before publishing.' : '',
      photo: !photo ? 'Choose a photo before publishing.' : ''
    };
    setErrors(invalid);
    const failed = Object.keys(invalid).filter(key => invalid[key]);
    if (failed.length) {
      const next = { ...attempts };
      failed.forEach(key => {
        next[key] += 1;
        onError({ field: key, count: next[key], time: new Date().toISOString(), reason: invalid[key] });
      });
      setAttempts(next);
      setStatus('Please correct the highlighted fields. Your details are saved on this screen.');
      const first = failed[0];
      ({ title: titleRef, description: descriptionRef, photo: photoRef })[first]?.current?.focus();
      return;
    }
    setStatus('Listing validated successfully!');
    onPublish({ ...fields, photo, condition });
  };
  return <main className="phone">
    <header><div className="brand">eco-swap</div><div className="tagline">Small steps, big impact</div></header>
    <h1>Swap an item</h1>
    <p className="intro">Give your item a new home 🌿</p>
    {adaptive && <section className="assist" aria-live="polite"><strong>🌿 Let's make this easier</strong><p>We noticed a few repeated attempts. Focus on the highlighted required fields first. Optional details are hidden to reduce distractions.</p><button type="button" className="link" onClick={() => setShowAdvanced(v => !v)}>{showAdvanced ? 'Hide optional details' : 'Show optional details'}</button></section>}
    <form noValidate onSubmit={publish}>
      <label htmlFor="item-title">Item title <span aria-hidden="true">*</span></label>
      <input ref={titleRef} id="item-title" value={fields.title} onChange={e => update('title', e.target.value)} aria-invalid={!!errors.title} aria-describedby={errors.title ? 'title-error' : undefined} className={errors.title ? 'invalid' : ''} placeholder="e.g. A book in good condition" />
      {errors.title && <p className="error" id="title-error" role="alert">{errors.title}</p>}
      {adaptive && attempts.title >= 2 && <p className="tip">Tip: Include the item name and a short identifying detail.</p>}
      <label htmlFor="item-description">Description <span aria-hidden="true">*</span></label>
      <textarea ref={descriptionRef} id="item-description" rows="4" value={fields.description} onChange={e => update('description', e.target.value)} aria-invalid={!!errors.description} aria-describedby={errors.description ? 'description-error' : undefined} className={errors.description ? 'invalid' : ''} placeholder="Describe your item and its condition" />
      {errors.description && <p className="error" id="description-error" role="alert">{errors.description}</p>}
      {adaptive && attempts.description >= 2 && <p className="tip">Tip: Mention the item's condition and what you're offering.</p>}
      <label htmlFor="item-photo">Item photo <span aria-hidden="true">*</span></label>
      <input ref={photoRef} id="item-photo" type="file" accept="image/*" aria-invalid={!!errors.photo} aria-describedby={errors.photo ? 'photo-error' : undefined} className={errors.photo ? 'invalid' : ''} onChange={e => { setPhoto(e.target.files?.[0] || null); setErrors(p => ({ ...p, photo: '' })); }} />
      {photo && <p className="tip">Selected: {photo.name}</p>}
      {errors.photo && <p className="error" id="photo-error" role="alert">{errors.photo}</p>}
      {adaptive && attempts.photo >= 2 && <p className="tip">Tip: Tap “Choose File” and select a photo from your device.</p>}
      {(!adaptive || showAdvanced) && <section className="optional"><label htmlFor="condition">Condition (optional)</label><select id="condition" value={condition} onChange={e => setCondition(e.target.value)}><option>Good</option><option>Like new</option><option>Fair</option></select></section>}
      <button className="primary" type="submit">Review listing</button>
      <p className="status" role="status" aria-live="polite">{status}</p>
    </form>
    <footer>Adaptive UX demonstration · Member 2</footer>
  </main>;
}
