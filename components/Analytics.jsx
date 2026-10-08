"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function Analytics() {
  const pathname = usePathname();
  const search = useSearchParams();
  useEffect(() => {
    function run() {
      if (window.localStorage.getItem("wd4u-consent") !== "accepted") return;
      const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
      if (id && !document.querySelector(`script[data-ga="${id}"]`)) {
        const script = document.createElement("script");
        script.async = true;
        script.dataset.ga = id;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
        document.head.appendChild(script);
        window.dataLayer = window.dataLayer || [];
        window.gtag = function gtag() { window.dataLayer.push(arguments); };
        window.gtag("js", new Date());
        window.gtag("config", id, { send_page_view: false });
      }
      const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
      if (pixelId && !window.fbq) {
        const script = document.createElement("script");
        script.text = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId.replace(/[^\w-]/g, "")}');`;
        document.head.appendChild(script);
      }
      window.gtag?.("event", "page_view", { page_path: `${pathname}${search ? `?${search}` : ""}` });
      window.fbq?.("track", "PageView");
      const pending = window.__wd4uPendingEvents || [];
      if (window.gtag || window.fbq) {
        window.__wd4uPendingEvents = [];
        for (const event of pending) {
          window.gtag?.("event", event.name.toLowerCase(), event.parameters);
          window.fbq?.("track", event.name, event.parameters);
        }
      }
    }
    run();
    window.addEventListener("wd4u-consent", run);
    return () => window.removeEventListener("wd4u-consent", run);
  }, [pathname, search]);
  return null;
}
