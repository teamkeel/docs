import Router from "next/router";
import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    rudderanalytics: any;
  }
}

export const Analytics = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!window.rudderanalytics) {
        rudderInitialize();
      } else {
        trackPage();
      }
    }
  }, []);

  useEffect(() => {
    const pageTrigger = (e) => {
      trackPage();
    };

    Router.events.on("routeChangeComplete", pageTrigger);

    return () => {
      Router.events.off("routeChangeComplete", pageTrigger);
    };
  }, []);

  if (!process.env.NEXT_PUBLIC_KOALA_PK) return null;

  return (
    <Script
      id="koala-snippet"
      dangerouslySetInnerHTML={{
        __html: `!function(t){if(window.ko)return;window.ko=[],["identify","track","removeListeners","open","on","off","qualify","ready"].forEach(function(t){ko[t]=function(){var n=[].slice.call(arguments);return n.unshift(t),ko.push(n),ko}});var n=document.createElement("script");n.async=!0,n.setAttribute("src","https://cdn.getkoala.com/v1/${process.env.NEXT_PUBLIC_KOALA_PK}/sdk.js"),(document.body || document.head).appendChild(n)}();`,
      }}
    />
  );
};

function trackPage() {
  if (typeof window !== "undefined") {
    window.rudderanalytics.page();
  }
}

export function analyticsEnabled() {
  return process.env.NODE_ENV !== "development";
}

export async function rudderInitialize() {
  window.rudderanalytics = await import("rudder-sdk-js");
  window.rudderanalytics.load(
    process.env.NEXT_PUBLIC_RS_WRITE_KEY,
    process.env.NEXT_PUBLIC_RS_DATA_PLANE_URL,
    {
      integrations: { All: true }, // load call options
      configUrl: "https://rs-api.keel.so",
      destSDKBaseURL: "https://rs-cdn.keel.so/v1.1/js-integrations",
    }
  );

  window.rudderanalytics.ready(() => {
    trackPage();
  });
}
