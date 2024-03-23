import { isMobile } from "./responsiveUtils";

/**
 * Gets the URL of the current page
 */
export const getCurrentUrl = () => window.location.href;

/**
 * Gets the URL of the current page
 */
export const getCurrentUrlWithoutParams = () =>
  getCurrentUrl().split("?")[0].split("#")[0];

/**
 * Refreshes the current tab
 */
export const reloadPage = () => window.location.reload();

/**
 * Goes to the provided url on the *current tab*
 * @param url the string url to go to
 */
export const goTo = (url: string) => window.location.assign(url);

/**
 * Goes to the provided url in a *new tab*
 * @param url the string url to go to
 */
export const goToNewTab = (url: string) => window.open(url);

/**
 * On desktop, goes to the provided url in a *new tab*
 * On mobile, goes to the provided url on the *current tab*
 * @param url  the string url to go to
 */
export const goToNewTabOnDesktop = (url: string) => (isMobile() ? goTo(url) : goToNewTab(url));

/**
 * Scrolls to the top of the current tab
 */
export const scrollToTop = () => window.scrollTo(0, 0);
