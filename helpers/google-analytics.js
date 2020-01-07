const gaTrackingId = process.env.GA_TRACKING_ID;

// See also:
// https://www.garymeehan.ie/blog/google-analytics-nextjs-and-prismic

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const gaPageView = (url) => {
  if (!window || !window.gtag) return;

  try {
    window.gtag('config', gaTrackingId, {
      page_location: url
    });
  } catch (error) {
    // silences the error in dev mode
    // and/or if gtag fails to load
    console.log(error);
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const gaEvent = ({ action, category, label, value }) => {
  if (!window || !window.gtag) return;

  try {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  } catch (error) {
    console.log(error);
  }
}
