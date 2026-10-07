import { useEffect, useState } from 'react';

export default function useElapsedTime(running: boolean) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!running) return;

    const startedAt = Date.now();
    setSeconds(0);

    const timer = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setSeconds(Math.floor(elapsed / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [running]);

  return seconds;
}