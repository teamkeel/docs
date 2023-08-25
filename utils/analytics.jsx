import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect } from "react";

export const Analytics = () => {
  const router = useRouter();

  useEffect(() => {
    if(!window.rudderanalytics) {
      rudderInitialize();
    }
  });

  useEffect(() => {
    window.rudderanalytics.page();
  }, [router.pathname]);

  return <Script id="rudderstack" src="https://rs-cdn.keel.so/v1.1/rudder-analytics.min.js"></Script>;
};

function rudderInitialize() {
  (function () {
    window.rudderanalytics = window.rudderanalytics = [];

  var methods = [
    'load',
    'page',
    'track',
    'identify',
    'alias',
    'group',
    'ready',
    'reset',
    'getAnonymousId',
    'setAnonymousId',
  ];

  for (var i = 0; i < methods.length; i++) {
    var method = methods[i];
    window.rudderanalytics[method] = (function (methodName) {
      return function () {
        rudderanalytics.push([methodName].concat(Array.prototype.slice.call(arguments)));
      };
    })(method);
  }
  rudderanalytics.load(process.env.NEXT_PUBLIC_RS_WRITE_KEY, process.env.NEXT_PUBLIC_RS_DATA_PLANE_URL);
  })();
}
