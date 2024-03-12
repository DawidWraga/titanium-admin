import { useEffect, useRef } from "react";

/**
 * Custom hook that calls a function at specified interval.
 *
 * @param callback - The function to be called at each interval.
 * @param delay - The delay duration in milliseconds of each interval.
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current!();
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
