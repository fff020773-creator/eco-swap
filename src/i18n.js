import { useState, useEffect } from 'react'

export function getLang() {
  try {
    return localStorage.getItem('eco-lang') === 'ar' ? 'ar' : 'en'
  } catch (e) {
    return 'en'
  }
}

function applyDir(lang) {
  document.documentElement.lang = lang
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
}

export function changeLang(lang) {
  try {
    localStorage.setItem('eco-lang', lang)
  } catch (e) {
    /* ignore */
  }
  applyDir(lang)
  window.dispatchEvent(new Event('eco-lang'))
}

// use inside any screen: const lang = useLang()
export function useLang() {
  const [lang, setLang] = useState(getLang())
  useEffect(() => {
    const onChange = () => setLang(getLang())
    window.addEventListener('eco-lang', onChange)
    return () => window.removeEventListener('eco-lang', onChange)
  }, [])
  return lang
}

applyDir(getLang())