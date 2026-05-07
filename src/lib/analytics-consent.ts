export const createAnalyticsConsentScript = (gaMeasurementId: string) => `(() => {
  const GA_ID = ${JSON.stringify(gaMeasurementId)};
  const CONSENT_KEY = 'ga-consent';
  let bannerRef = null;
  const EU_REGIONS = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','GB','UK'];
  const EU_TIMEZONES = ['Europe/Amsterdam','Europe/Andorra','Europe/Athens','Europe/Belgrade','Europe/Berlin','Europe/Bratislava','Europe/Brussels','Europe/Bucharest','Europe/Budapest','Europe/Copenhagen','Europe/Dublin','Europe/Gibraltar','Europe/Helsinki','Europe/Kaliningrad','Europe/Lisbon','Europe/Ljubljana','Europe/London','Europe/Luxembourg','Europe/Madrid','Europe/Malta','Europe/Monaco','Europe/Oslo','Europe/Paris','Europe/Prague','Europe/Riga','Europe/Rome','Europe/San_Marino','Europe/Sarajevo','Europe/Skopje','Europe/Sofia','Europe/Stockholm','Europe/Tallinn','Europe/Tirane','Europe/Vaduz','Europe/Vatican','Europe/Vienna','Europe/Vilnius','Europe/Warsaw','Europe/Zagreb'];

  const readConsent = () => {
    try {
      return localStorage.getItem(CONSENT_KEY);
    } catch (error) {
      return null;
    }
  };

  const persistConsent = (value) => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch (error) {
      // ignore storage errors
    }
  };

  const loadAnalytics = () => {
    if (!GA_ID || window.__gaLoaded) return;
    window.__gaLoaded = true;
    console.debug('[consent] loading analytics');
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  };

  const hideBanner = () => {
    if (bannerRef) bannerRef.hidden = true;
  };

  const applyChoice = (choice) => {
    if (choice === 'accept') {
      persistConsent('granted');
      loadAnalytics();
    } else {
      persistConsent('denied');
    }
    hideBanner();
  };

  const attachHandlers = () => {
    if (!bannerRef || bannerRef.dataset.handlers === 'true') return;
    bannerRef.dataset.handlers = 'true';
    const accept = bannerRef.querySelector('[data-consent="accept"]');
    const decline = bannerRef.querySelector('[data-consent="decline"]');
    accept?.addEventListener('click', () => {
      console.debug('[consent] accept clicked');
      applyChoice('accept');
    });
    decline?.addEventListener('click', () => {
      console.debug('[consent] decline clicked');
      applyChoice('decline');
    });
  };

  window.handleAnalyticsConsent = applyChoice;

  console.debug('[consent] script ready', {
    languages: navigator.languages,
    timeZone: (() => {
      try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
      } catch (error) {
        return 'unknown';
      }
    })(),
  });

  const isLikelyEU = () => {
    try {
      const languages = navigator.languages ?? [navigator.language];
      for (const lang of languages) {
        if (!lang) continue;
        const parts = lang.split('-');
        const region = parts[1]?.toUpperCase();
        if (region && EU_REGIONS.includes(region)) return true;
      }
    } catch (error) {}
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz && EU_TIMEZONES.includes(tz)) return true;
    } catch (error) {}
    return false;
  };

  const initConsent = () => {
    bannerRef = document.getElementById('consentBanner');
    const consent = readConsent();

    if (consent === 'granted') {
      loadAnalytics();
      return;
    }
    if (consent === 'denied') return;

    if (!isLikelyEU()) {
      console.debug('[consent] non-EU locale detected, auto-granting');
      persistConsent('granted');
      loadAnalytics();
      return;
    }

    if (bannerRef) {
      bannerRef.hidden = false;
      attachHandlers();
    }
  };

  window.forceConsentBanner = () => {
    localStorage.removeItem(CONSENT_KEY);
    bannerRef = document.getElementById('consentBanner');
    if (!bannerRef) return;
    bannerRef.hidden = false;
    attachHandlers();
    console.debug('[consent] banner forced visible');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConsent, { once: true });
  } else {
    initConsent();
  }
})();`;
