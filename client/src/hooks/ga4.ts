import ga4 from "react-ga4";

const TRACKING_ID = import.meta.env.VITE_GOOGLE_ANALYTICS;

export const init = () => ga4.initialize(TRACKING_ID);

// export const sendEvent = (name: string) =>
//   ga4.event('screen_view', {
//     app_name: 'Record Shop',
//     screen_name: name,
//   });

// export const sendPageview = (path: string) =>
//   ga4.send({
//     hitType: 'pageview',
//     page: path,
//   });

// export const trackButtonClick = () => {
//   ga4.event({
//     category: 'Button',
//     action: 'Click',
//     label: 'BuyRiffTickets',
//   });
// };

// export const trackPageView = () => {
//   ga4.event({
//     category: 'Button',
//     action: 'Click',
//     label: 'BuyRiffTickets',
//   });
// };
