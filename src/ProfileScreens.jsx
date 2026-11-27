import { useState } from 'react'
import { useLang, changeLang } from './i18n'

function useT() {
  const lang = useLang()
  return { lang, t: (en, ar) => (lang === 'ar' ? ar : en) }
}

const card = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 16,
  padding: 16,
  boxShadow: 'var(--shadow)',
}

const primaryBtn = {
  width: '100%',
  minHeight: 48,
  borderRadius: 14,
  border: 'none',
  background: 'var(--green)',
  color: '#fff',
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer',
}

const linkBtn = {
  width: '100%',
  minHeight: 48,
  background: 'none',
  border: 'none',
  color: 'var(--green)',
  fontSize: 15,
  cursor: 'pointer',
}

function SubHeader({ title, onBack, onHome }) {
  const { t } = useT()
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <button
        onClick={onBack}
        aria-label={t('Back', 'رجوع')}
        style={{ minHeight: 44, minWidth: 44, background: 'none', border: 'none', color: 'var(--green)', fontSize: 16, cursor: 'pointer' }}
      >
        {t('‹ Back', 'رجوع ›')}
      </button>
      <h1 style={{ margin: 0, fontSize: 20, color: 'var(--text-h)' }}>{title}</h1>
      <button
        onClick={onHome}
        aria-label={t('Home', 'الرئيسية')}
        style={{ minHeight: 44, minWidth: 44, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}
      >
        ⌂
      </button>
    </div>
  )
}

function Row({ icon, title, subtitle, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...card,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        textAlign: 'start',
        minHeight: 64,
        cursor: 'pointer',
        marginBottom: 10,
        color: 'var(--text)',
      }}
    >
      <span style={{ fontSize: 22 }}>{icon}</span>
      <span style={{ flex: 1 }}>
        <span style={{ display: 'block', fontWeight: 600, color: 'var(--text-h)' }}>{title}</span>
        {subtitle && <span style={{ display: 'block', fontSize: 13, color: 'var(--muted)' }}>{subtitle}</span>}
      </span>
      <span aria-hidden="true" style={{ color: 'var(--muted)' }}>›</span>
    </button>
  )
}

function Avatar({ profile, size = 64 }) {
  const leaf = profile.avatar === 'leaf'
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.25)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.45,
        fontWeight: 700,
      }}
    >
      {leaf ? '🌿' : (profile.name || 'E').charAt(0).toUpperCase()}
    </div>
  )
}

/* ---------------- Profile home ---------------- */
export function ProfileHome({ profile, score, points, onNavigate, onSignOut }) {
  const { t } = useT()
  return (
    <div style={{ padding: 16 }}>
      <div style={{ background: 'var(--green)', color: '#fff', borderRadius: 20, padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar profile={profile} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{profile.name}</div>
            <div style={{ fontSize: 13, opacity: 0.9 }} dir="ltr">{profile.email}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.18)', borderRadius: 12, padding: 10, textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{score}</div>
            <div style={{ fontSize: 12 }}>{t('Eco score', 'نقاط الأثر')}</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.18)', borderRadius: 12, padding: 10, textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{points}</div>
            <div style={{ fontSize: 12 }}>{t('Points', 'النقاط')}</div>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 12, letterSpacing: 1, color: 'var(--muted)', margin: '8px 4px' }}>{t('ACCOUNT', 'الحساب')}</div>
      <Row icon="✏️" title={t('Edit profile', 'تعديل الملف الشخصي')} subtitle={t('Name, email, location', 'الاسم، البريد، الموقع')} onClick={() => onNavigate('edit-profile')} />
      <Row icon="🏆" title={t('Achievements', 'الإنجازات')} subtitle={t('Your badges', 'شاراتك')} onClick={() => onNavigate('achievements')} />
      <Row icon="👥" title={t('Friends challenge', 'تحدي الأصدقاء')} subtitle={t('Compete with friends', 'نافس أصدقاءك')} onClick={() => onNavigate('friends')} />
      <Row icon="⚙️" title={t('Settings', 'الإعدادات')} subtitle={t('Notifications, appearance', 'الإشعارات والمظهر')} onClick={() => onNavigate('settings')} />
      <button onClick={onSignOut} style={{ ...linkBtn, color: '#b3261e', marginTop: 8 }}>{t('Sign out', 'تسجيل الخروج')}</button>
    </div>
  )
}

/* ---------------- Edit profile ---------------- */
export function EditProfile({ profile, onSave, onHome }) {
  const { t } = useT()
  const [view, setView] = useState('form')
  const [draft, setDraft] = useState({ ...profile })
  const [saved, setSaved] = useState(false)
  const [warn, setWarn] = useState(false)

  const set = (key, value) => {
    setSaved(false)
    setDraft((d) => ({ ...d, [key]: value }))
  }

  const setEmail = (value) => {
    if (/[^\x20-\x7E]/.test(value)) {
      setWarn(true)
      value = value.replace(/[^\x20-\x7E]/g, '')
    } else {
      setWarn(false)
    }
    set('email', value)
  }

  const save = () => {
    if (onSave) onSave(draft)
    setSaved(true)
  }

  if (view === 'photo') {
    return (
      <div style={{ padding: 16 }}>
        <h1 style={{ fontSize: 24, color: 'var(--text-h)', marginTop: 24 }}>{t('Choose profile image', 'اختر صورة الملف الشخصي')}</h1>
        <p style={{ color: 'var(--muted)' }}>
          {t('Try a sample profile to preview the editing flow.', 'جرّب ملفًا تجريبيًا لمعاينة تعديل الصورة.')}
        </p>
        <button
          style={primaryBtn}
          onClick={() => {
            set('avatar', 'leaf')
            setView('form')
          }}
        >
          {t('Use leaf avatar', 'استخدام صورة ورقة')}
        </button>
        <button style={{ ...linkBtn, marginTop: 12 }} onClick={() => setView('form')}>
          {t('Cancel', 'إلغاء')}
        </button>
      </div>
    )
  }

  const input = {
    width: '100%',
    minHeight: 48,
    borderRadius: 12,
    border: '1px solid var(--border)',
    padding: '0 12px',
    fontSize: 16,
    background: 'var(--card)',
    color: 'var(--text)',
    boxSizing: 'border-box',
  }
  const label = { display: 'block', fontSize: 13, color: 'var(--muted)', marginBottom: 4 }

  return (
    <div style={{ padding: 16 }}>
      <SubHeader title={t('Edit profile', 'تعديل الملف الشخصي')} onBack={onHome} onHome={onHome} />

      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div style={{ display: 'inline-block', background: 'var(--green)', borderRadius: '50%' }}>
          <Avatar profile={draft} size={84} />
        </div>
        <div>
          <button onClick={() => setView('photo')} style={{ ...linkBtn, width: 'auto', padding: '0 12px' }}>
            {t('Change photo', 'تغيير الصورة')}
          </button>
        </div>
      </div>

      <label style={label}>{t('Name', 'الاسم')}</label>
      <input style={{ ...input, marginBottom: 12 }} value={draft.name || ''} onChange={(e) => set('name', e.target.value)} />

      <label style={label}>{t('Email', 'البريد الإلكتروني')}</label>
      <input style={{ ...input, marginBottom: 4 }} type="email" dir="ltr" value={draft.email || ''} onChange={(e) => setEmail(e.target.value)} />
      {warn && (
        <div role="alert" style={{ color: '#b3261e', fontSize: 13, marginBottom: 8 }}>
          {t('English characters only', 'أحرف إنجليزية فقط')}
        </div>
      )}

      <label style={{ ...label, marginTop: 8 }}>{t('Location', 'الموقع')}</label>
      <input style={{ ...input, marginBottom: 12 }} value={draft.location || ''} onChange={(e) => set('location', e.target.value)} />

      <label style={label}>{t('About', 'نبذة عني')}</label>
      <textarea
        style={{ ...input, minHeight: 90, padding: 12, marginBottom: 16, fontFamily: 'inherit' }}
        value={draft.about || ''}
        onChange={(e) => set('about', e.target.value)}
      />

      <button style={primaryBtn} onClick={save}>{t('Save changes', 'حفظ التغييرات')}</button>
      {saved && (
        <div role="status" style={{ textAlign: 'center', color: 'var(--green)', marginTop: 12, fontWeight: 600 }}>
          {t('Changes saved ✓', 'تم حفظ التغييرات ✓')}
        </div>
      )}
      <button style={{ ...linkBtn, marginTop: 8 }} onClick={onHome}>{t('Back to profile', 'العودة إلى الملف الشخصي')}</button>
    </div>
  )
}

/* ---------------- Achievements ---------------- */
const BADGES = [
  { id: 'starter', icon: '🌱', en: 'Green Starter', ar: 'مبتدئ أخضر', unlocked: true },
  { id: 'plastic', icon: '♻️', en: 'Plastic Hero', ar: 'بطل البلاستيك', unlocked: true },
  { id: 'water', icon: '💧', en: 'Water Saver', ar: 'موفّر المياه', unlocked: true },
  { id: 'streak', icon: '🔥', en: '7-Day Streak', ar: 'سلسلة ٧ أيام', unlocked: true },
  { id: 'planet', icon: '🌍', en: 'Planet Protector', ar: 'حامي الكوكب', unlocked: false },
  { id: 'commuter', icon: '🚌', en: 'Clean Commuter', ar: 'منتقل نظيف', unlocked: false },
]

function goToChallenges() {
  // press the "Challenges" tab in the bottom bar
  const buttons = document.querySelectorAll('nav button')
  if (buttons[2]) buttons[2].click()
}

export function Achievements({ onBack, onHome, onExplore }) {
  const { lang, t } = useT()
  const [open, setOpen] = useState(null)
  const badge = BADGES.find((b) => b.id === open)

  if (badge) {
    return (
      <div style={{ padding: 16 }}>
        <div style={{ textAlign: 'center', fontSize: 56, marginTop: 24 }} aria-hidden="true">{badge.icon}</div>
        <h1 style={{ fontSize: 24, color: 'var(--text-h)', textAlign: 'center' }}>{badge[lang]}</h1>
        <p style={{ color: 'var(--muted)', textAlign: 'center' }}>
          {t('Keep completing green activities to reach your next milestone.', 'واصل إكمال الأنشطة الخضراء لتصل إلى إنجازك التالي.')}
        </p>
        <button style={primaryBtn} onClick={onExplore || goToChallenges}>{t('Explore challenges', 'استكشاف التحديات')}</button>
        <button style={{ ...linkBtn, marginTop: 12 }} onClick={() => setOpen(null)}>{t('Back to achievements', 'العودة إلى الإنجازات')}</button>
      </div>
    )
  }

  return (
    <div style={{ padding: 16 }}>
      <SubHeader title={t('Achievements', 'الإنجازات')} onBack={onBack} onHome={onHome} />
      <div style={{ ...card, textAlign: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--green)' }}>8 / 20</div>
        <div style={{ color: 'var(--muted)', fontSize: 13 }}>{t('badges unlocked', 'شارة مفتوحة')}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        {BADGES.map((b) => (
          <button
            key={b.id}
            onClick={() => setOpen(b.id)}
            aria-label={`${b[lang]}, ${b.unlocked ? t('unlocked', 'مفتوحة') : t('locked', 'مقفلة')}`}
            style={{
              ...card,
              minHeight: 110,
              cursor: 'pointer',
              opacity: b.unlocked ? 1 : 0.55,
              color: 'var(--text)',
            }}
          >
            <div style={{ fontSize: 30 }} aria-hidden="true">{b.icon}</div>
            <div style={{ fontWeight: 600, fontSize: 14, marginTop: 6 }}>{b[lang]}</div>
          </button>
        ))}
      </div>
      <button style={primaryBtn} onClick={onBack}>{t('Back to profile', 'العودة إلى الملف الشخصي')}</button>
    </div>
  )
}

/* ---------------- Settings ---------------- */
function InfoPage({ title, text, onBack, backLabel, children }) {
  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 24, color: 'var(--text-h)', marginTop: 24 }}>{title}</h1>
      <p style={{ color: 'var(--muted)', lineHeight: 1.5 }}>{text}</p>
      {children}
      <button style={{ ...linkBtn, marginTop: 12 }} onClick={onBack}>{backLabel}</button>
    </div>
  )
}

const AUDIT = [
  {
    title: { en: '1. Touch targets', ar: '١. مساحات اللمس' },
    text: {
      en: 'Before: Start and Redeem had 38 px-high tap areas. After: their active tap areas are at least 44 px high.',
      ar: 'قبل: كانت مساحة لمس زرّي البدء والاستبدال 38 بكسل. بعد: أصبحت مساحة اللمس الفعّالة 44 بكسل على الأقل.',
    },
  },
  {
    title: { en: '2. Button contrast', ar: '٢. تباين الأزرار' },
    text: {
      en: 'Before: the new swap and recommendation actions had no defined color pair. After: white labels on dark green use approximately 8.5:1 contrast.',
      ar: 'قبل: لم يكن لإجراءات التبديل والتوصية الجديدة زوج ألوان محدد. بعد: النص الأبيض على الأخضر الداكن بتباين يقارب 8.5:1.',
    },
  },
  {
    title: { en: '3. Error identification', ar: '٣. تحديد الأخطاء' },
    text: {
      en: 'Before: the swap flow had no error feedback. After: each error shows a warning symbol, a specific explanation and a recovery button.',
      ar: 'قبل: لم يكن في مسار التبديل أي تنبيه للأخطاء. بعد: يظهر مع كل خطأ رمز تحذير وشرح محدد وزر للتصحيح.',
    },
  },
]

export function Settings({ onBack, onHome, highContrast, onToggleContrast }) {
  const { lang, t } = useT()
  const [page, setPage] = useState(null)
  const [reminders, setReminders] = useState(true)
  const back = () => setPage(null)
  const backLabel = t('Back to settings', 'العودة إلى الإعدادات')

  if (page === 'notifications') {
    return (
      <InfoPage
        title={t('Notifications', 'الإشعارات')}
        text={reminders ? t('Reminders are on.', 'التذكيرات مفعّلة.') : t('Reminders are off.', 'التذكيرات متوقفة.')}
        onBack={back}
        backLabel={backLabel}
      >
        <button style={primaryBtn} onClick={() => setReminders((r) => !r)}>
          {reminders ? t('Turn off reminders', 'إيقاف التذكيرات') : t('Turn on reminders', 'تفعيل التذكيرات')}
        </button>
      </InfoPage>
    )
  }
  if (page === 'appearance') {
    return (
      <InfoPage
        title={t('Appearance', 'المظهر')}
        text={
          highContrast
            ? t('High contrast mode is on.', 'وضع التباين العالي مفعّل.')
            : t('Eco-Swap uses a light, nature-inspired theme.', 'يستخدم Eco-Swap مظهرًا فاتحًا مستوحى من الطبيعة.')
        }
        onBack={back}
        backLabel={backLabel}
      >
        <button style={primaryBtn} aria-pressed={highContrast} onClick={onToggleContrast}>
          {highContrast ? t('Turn off high contrast', 'إيقاف التباين العالي') : t('Turn on high contrast', 'تفعيل التباين العالي')}
        </button>
      </InfoPage>
    )
  }
  if (page === 'language') {
    return (
      <InfoPage title={t('Language', 'اللغة')} text={t('Choose the app language.', 'اختر لغة التطبيق.')} onBack={back} backLabel={backLabel}>
        {[
          { code: 'en', label: 'English' },
          { code: 'ar', label: 'العربية' },
        ].map((l) => (
          <button
            key={l.code}
            aria-pressed={lang === l.code}
            onClick={() => changeLang(l.code)}
            style={{
              ...card,
              width: '100%',
              minHeight: 56,
              marginBottom: 10,
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--text-h)',
              border: lang === l.code ? '2px solid var(--green)' : '1px solid var(--border)',
            }}
          >
            {l.label} {lang === l.code ? '✓' : ''}
          </button>
        ))}
      </InfoPage>
    )
  }
  if (page === 'privacy') {
    return (
      <InfoPage
        title={t('Privacy', 'الخصوصية')}
        text={t(
          'You control your profile information. This prototype does not access your location or share your data.',
          'أنت تتحكم في معلومات ملفك الشخصي. هذا النموذج لا يصل إلى موقعك ولا يشارك بياناتك.'
        )}
        onBack={back}
        backLabel={backLabel}
      />
    )
  }
  if (page === 'help') {
    return (
      <InfoPage
        title={t('How Eco-Swap works', 'كيف يعمل Eco-Swap')}
        text={t(
          'Start a challenge, complete the activity, then view your impact. Use reward points after confirming a redemption.',
          'ابدأ تحديًا، وأكمل النشاط، ثم اطّلع على أثرك. استخدم نقاط المكافآت بعد تأكيد الاستبدال.'
        )}
        onBack={back}
        backLabel={backLabel}
      />
    )
  }
  if (page === 'about') {
    return (
      <InfoPage
        title={t('About Eco-Swap', 'عن Eco-Swap')}
        text={t('Small steps, big impact. Eco-Swap · Version 2.0', 'خطوات صغيرة، أثر كبير. Eco-Swap · الإصدار 2.0')}
        onBack={back}
        backLabel={backLabel}
      />
    )
  }
  if (page === 'audit') {
    return (
      <div style={{ padding: 16 }}>
        <h1 style={{ fontSize: 28, color: 'var(--green)', marginTop: 16 }}>{t('Accessibility audit', 'تدقيق إمكانية الوصول')}</h1>
        {AUDIT.map((item) => (
          <section key={item.title.en} style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, color: 'var(--green)', marginBottom: 8 }}>{item.title[lang]}</h2>
            <p style={{ color: 'var(--green)', lineHeight: 1.5, margin: 0 }}>{item.text[lang]}</p>
          </section>
        ))}
        <button style={primaryBtn} onClick={back}>{backLabel}</button>
      </div>
    )
  }

  return (
    <div style={{ padding: 16 }}>
      <SubHeader title={t('Settings', 'الإعدادات')} onBack={onBack} onHome={onHome} />
      <div style={{ fontSize: 12, letterSpacing: 1, color: 'var(--muted)', margin: '8px 4px' }}>{t('PREFERENCES', 'التفضيلات')}</div>
      <Row icon="🔔" title={t('Notifications', 'الإشعارات')} subtitle={t('Manage reminders and alerts', 'إدارة التذكيرات والتنبيهات')} onClick={() => setPage('notifications')} />
      <Row icon="🌙" title={t('Appearance', 'المظهر')} subtitle={highContrast ? t('High contrast', 'تباين عالٍ') : t('Light mode', 'الوضع الفاتح')} onClick={() => setPage('appearance')} />
      <Row icon="🌐" title={t('Language', 'اللغة')} subtitle={lang === 'ar' ? 'العربية' : 'English'} onClick={() => setPage('language')} />
      <div style={{ fontSize: 12, letterSpacing: 1, color: 'var(--muted)', margin: '16px 4px 8px' }}>{t('ACCOUNT & PRIVACY', 'الحساب والخصوصية')}</div>
      <Row icon="🔒" title={t('Privacy', 'الخصوصية')} subtitle={t('Your data and permissions', 'بياناتك وصلاحياتك')} onClick={() => setPage('privacy')} />
      <Row icon="❓" title={t('Help & support', 'المساعدة والدعم')} subtitle={t('FAQs and contact', 'الأسئلة الشائعة والتواصل')} onClick={() => setPage('help')} />
      <Row icon="ℹ️" title={t('About Eco-Swap', 'عن Eco-Swap')} subtitle={t('Version 2.0', 'الإصدار 2.0')} onClick={() => setPage('about')} />
      <Row icon="♿" title={t('Accessibility audit', 'تدقيق إمكانية الوصول')} subtitle={t('Touch targets, contrast, errors', 'مساحات اللمس، التباين، الأخطاء')} onClick={() => setPage('audit')} />
      <button style={{ ...primaryBtn, marginTop: 8 }} onClick={onBack}>{t('Back to profile', 'العودة إلى الملف الشخصي')}</button>
    </div>
  )
}