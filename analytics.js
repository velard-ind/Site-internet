/* VELARD industry — analytics (Google Analytics 4 + consentement RGPD) */
(function (window, document) {
    'use strict';

    // Remplacez par votre ID de mesure GA4 (Admin Google Analytics > Flux de données > ID de mesure)
    var GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

    var STORAGE_KEY = 'velard_analytics_consent';
    var gtagLoaded = false;

    function hasValidGaId() {
        return typeof GA_MEASUREMENT_ID === 'string' && /^G-[A-Z0-9]+$/i.test(GA_MEASUREMENT_ID) && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX';
    }

    function getConsent() {
        try {
            return window.localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    function setConsent(value) {
        try {
            window.localStorage.setItem(STORAGE_KEY, value);
        } catch (e) {
            /* ignore */
        }
    }

    function loadGtag() {
        if (gtagLoaded || !hasValidGaId()) {
            return;
        }
        gtagLoaded = true;

        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'granted'
        });
        window.gtag('config', GA_MEASUREMENT_ID, {
            anonymize_ip: true,
            send_page_view: false
        });

        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_MEASUREMENT_ID);
        document.head.appendChild(script);
    }

    function pagePath(pageId) {
        return pageId === 'accueil' ? '/' : '/#' + pageId;
    }

    function trackPageView(pageId) {
        if (getConsent() !== 'granted' || typeof window.gtag !== 'function') {
            return;
        }
        var path = pagePath(pageId || 'accueil');
        var title = document.title;
        window.gtag('event', 'page_view', {
            page_title: title,
            page_location: window.location.origin + path,
            page_path: path
        });
    }

    function trackEvent(name, params) {
        if (getConsent() !== 'granted' || typeof window.gtag !== 'function') {
            return;
        }
        window.gtag('event', name, params || {});
    }

    function hideBanner() {
        var banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.hidden = true;
        }
    }

    function showBanner() {
        var banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.hidden = false;
        }
    }

    function acceptAnalytics() {
        setConsent('granted');
        hideBanner();
        loadGtag();
        var page = (window.location.hash || '#accueil').replace(/^#/, '') || 'accueil';
        trackPageView(page);
    }

    function refuseAnalytics() {
        setConsent('denied');
        hideBanner();
    }

    function setupBanner() {
        var acceptBtn = document.getElementById('cookie-accept');
        var refuseBtn = document.getElementById('cookie-refuse');
        var prefsLink = document.getElementById('cookie-prefs');

        if (acceptBtn) {
            acceptBtn.addEventListener('click', acceptAnalytics);
        }
        if (refuseBtn) {
            refuseBtn.addEventListener('click', refuseAnalytics);
        }
        if (prefsLink) {
            prefsLink.addEventListener('click', function (e) {
                e.preventDefault();
                showBanner();
            });
        }

        var consent = getConsent();
        if (consent === 'granted') {
            hideBanner();
            loadGtag();
        } else if (consent === 'denied') {
            hideBanner();
        } else {
            showBanner();
        }
    }

    function setupOutboundTracking() {
        document.addEventListener('click', function (e) {
            var link = e.target.closest('a[href]');
            if (!link) {
                return;
            }
            var href = link.getAttribute('href') || '';
            if (href.indexOf('mailto:') === 0) {
                trackEvent('contact_email', { link_url: href });
            } else if (href.indexOf('tel:') === 0) {
                trackEvent('contact_phone', { link_url: href });
            }
        });
    }

    window.VelardAnalytics = {
        trackPageView: trackPageView,
        trackEvent: trackEvent,
        hasValidGaId: hasValidGaId,
        getConsent: getConsent
    };

    document.addEventListener('DOMContentLoaded', function () {
        setupBanner();
        setupOutboundTracking();
        if (!hasValidGaId()) {
            console.warn('VELARD analytics : renseignez votre ID GA4 (G-…) dans analytics.js pour activer le suivi.');
        }
    });
})(window, document);
