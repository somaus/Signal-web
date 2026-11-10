import { useCallback, useEffect, useState } from "react";

/**
 * active인 동안 ms가 지나면 timedOut이 된다. 폴링이 끝나지 않을 때 "오래 걸려요" 화면을 보여주는 데 쓴다.
 * restart를 부르면 시간을 처음부터 다시 센다.
 */
export function usePollTimeout(active: boolean, ms: number) {
  const [timedOut, setTimedOut] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => setTimedOut(true), ms);
    return () => clearTimeout(timer);
  }, [active, ms, attempt]);

  const restart = useCallback(() => {
    setTimedOut(false);
    setAttempt((value) => value + 1);
  }, []);

  return { timedOut: active && timedOut, restart };
}
