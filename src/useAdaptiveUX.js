import { useEffect, useState, useCallback } from "react";

export function useAdaptiveUX({ dwellThresholdMs = 7000, idleThresholdMs = 4000 } = {}) {
  const [highContrast, setHighContrast] = useState(false);
  const [frictionLog, setFrictionLog] = useState([]);

  const logFriction = useCallback((reason, durationMs) => {
    const entry = {
      id: Date.now(),
      reason,
      durationMs,
      timestamp: new Date().toISOString(),
    };
    setFrictionLog((prev) => [...prev, entry]);
  }, []);

  useEffect(() => {
    const pageEnterTime = Date.now();
    let lastActivityTime = Date.now();
    let dwellTriggered = false;

    const resetActivity = () => {
      lastActivityTime = Date.now();
    };

    window.addEventListener("mousemove", resetActivity);
    window.addEventListener("keydown", resetActivity);
    window.addEventListener("scroll", resetActivity);

    const interval = setInterval(() => {
      const now = Date.now();
      const totalDwell = now - pageEnterTime;
      const idleTime = now - lastActivityTime;

      if (!dwellTriggered && totalDwell >= dwellThresholdMs && idleTime >= idleThresholdMs) {
        dwellTriggered = true;
        setHighContrast(true);
        logFriction("High dwell/hesitation detected", totalDwell);
      }
    }, 500);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", resetActivity);
      window.removeEventListener("keydown", resetActivity);
      window.removeEventListener("scroll", resetActivity);
    };
  }, [dwellThresholdMs, idleThresholdMs, logFriction]);

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast-mode", highContrast);
  }, [highContrast]);

  return {
    highContrast,
    setHighContrast,
    frictionLog,
    logFriction,
  };
}
