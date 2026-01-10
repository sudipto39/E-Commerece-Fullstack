import { useEffect, useState } from "react";

export const useBackendReady = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const wake = async () => {
      const baseUrl = import.meta.env.VITE_API_URL;

      for (let i = 0; i < 6; i++) {
        try {
          const res = await fetch(`${baseUrl}/health`);
          if (res.ok) {
            if (!cancelled) setReady(true);
            return;
          }
        } catch (e) {
          // backend still sleeping
        }

        await new Promise(r => setTimeout(r, 4000)); // wait 4s
      }
    };

    wake();
    return () => (cancelled = true);
  }, []);

  return ready;
};
