import { useEffect, useState } from 'react';
import { fetchServerTime } from '../services/serverTime';

type ClockState = { timestamp: number | null; connected: boolean };

export function useServerClock(): ClockState {
  const [clock, setClock] = useState<ClockState>({ timestamp: null, connected: false });

  useEffect(() => {
    let anchor: { server: number; monotonic: number } | undefined;
    let disposed = false;
    let request: AbortController | undefined;

    const synchronize = async () => {
      request?.abort();
      const currentRequest = new AbortController();
      request = currentRequest;
      const timeout = setTimeout(() => currentRequest.abort(), 10000);
      const sent = performance.now();
      try {
        const timestamp = await fetchServerTime(currentRequest.signal);
        if (disposed || currentRequest.signal.aborted) return;
        const received = performance.now();
        anchor = { server: timestamp + (received - sent) / 2, monotonic: received };
        if (!disposed) setClock({ timestamp: anchor.server, connected: true });
      } catch {
        if (!disposed && request === currentRequest) setClock(previous => ({ ...previous, connected: false }));
      } finally {
        clearTimeout(timeout);
      }
    };

    void synchronize();
    const refresh = setInterval(() => void synchronize(), 60000);
    const tick = setInterval(() => {
      const current = anchor;
      if (current) setClock(previous => ({ ...previous, timestamp: current.server + performance.now() - current.monotonic }));
    }, 1000);
    const onVisible = () => { if (!document.hidden) void synchronize(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      disposed = true;
      request?.abort();
      clearInterval(refresh);
      clearInterval(tick);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return clock;
}
