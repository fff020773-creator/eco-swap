import { useState, useEffect, useCallback } from 'react';

const FIREBASE_DB_URL = 'https://eco-swap-1c8d4-default-rtdb.firebaseio.com/frictionLogs.json';

export function useAdaptiveUX({
  dwellThresholdMs = 7000,
  idleThresholdMs = 4000,
} = {}) {
  const [highContrast, setHighContrast] = useState(false);
  const [frictionLog, setFrictionLog] = useState(() => {
    try {
      const saved = localStorage.getItem('eco_swap_friction_log');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast-mode');
    } else {
      root.classList.remove('high-contrast-mode');
    }
  }, [highContrast]);

  const logFriction = useCallback((reason, durationMs = 0) => {
    const entry = {
      id: Date.now() + Math.random(),
      reason,
      durationMs,
      timestamp: new Date().toISOString(),
    };

    setFrictionLog((prev) => {
      const updated = [entry, ...prev];
      try {
        localStorage.setItem('eco_swap_friction_log', JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
      return updated;
    });

    if (FIREBASE_DB_URL && !FIREBASE_DB_URL.includes('YOUR-PROJECT-ID')) {
      fetch(FIREBASE_DB_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      }).catch(() => {
        // Fallback silently if offline
      });
    }

    setHighContrast(true);
  }, []);

  useEffect(() => {
    let lastActivity = Date.now();

    const resetActivity = () => {
      lastActivity = Date.now();
    };

    window.addEventListener('mousemove', resetActivity);
    window.addEventListener('keydown', resetActivity);
    window.addEventListener('scroll', resetActivity);

    const interval = setInterval(() => {
      const idleTime = Date.now() - lastActivity;
      if (idleTime >= idleThresholdMs) {
        logFriction('Prolonged user inactivity / hesitation detected', idleTime);
        lastActivity = Date.now();
      }
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', resetActivity);
      window.removeEventListener('keydown', resetActivity);
      window.removeEventListener('scroll', resetActivity);
      clearInterval(interval);
    };
  }, [idleThresholdMs, logFriction]);

  return {
    highContrast,
    setHighContrast,
    frictionLog,
    logFriction,
  };
}
