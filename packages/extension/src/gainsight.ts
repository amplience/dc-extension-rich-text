const aptrinsicId = process.env.REACT_APP_APTRINSIC_ID;

export function initGainsight() {
  if (!aptrinsicId) {
    return;
  }
  window.aptrinsic = function() {
    (window.aptrinsic.q = window.aptrinsic.q || []).push(arguments);
  };

  window.aptrinsic.p = aptrinsicId;
  window.aptrinsic.c = { allowCrossDomain: true };

  const script = window.document.createElement("script");
  script.async = true;
  script.src = `https://web-sdk.aptrinsic.com/api/aptrinsic.js?a=${aptrinsicId}`;
  const s = window.document.getElementsByTagName("script")[0];
  s.parentNode?.insertBefore(script, s);
}

export function track(
  win: Window & typeof globalThis,
  eventName: string,
  value: any
) {
  if (win.aptrinsic) {
    win.aptrinsic("track", eventName, value);
  }
}
