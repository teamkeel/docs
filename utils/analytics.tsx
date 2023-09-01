import Router from "next/router";
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

  return null;
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
