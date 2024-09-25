
import { useRegisterSW } from "virtual:pwa-register/react";

const AppUpdater = () => {
    const intervalMS = 1000 * 60 * 60 // 1 hour;
  
    useRegisterSW({
      onRegisteredSW(swUrl, r) {
        r &&
          setInterval(async () => {
            if (!(!r.installing && navigator)) return;
            if ("connection" in navigator && !navigator.onLine) return;
  
            const resp = await fetch(swUrl, {
              cache: "no-store",
              headers: {
                cache: "no-store",
                "cache-control": "no-cache",
              },
            });
  
            if (resp?.status === 200) await r.update();
          }, intervalMS);
      },
    });
  
    return null;
  };

  
  export default AppUpdater;