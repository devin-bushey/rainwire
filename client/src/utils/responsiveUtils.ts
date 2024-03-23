
/**
 * Anything under this width is considered a mobile device
 */
const MOBILE_BREAKPOINT = 768;

/**
 * Checks if the user is on a mobile device
 * @returns true if the window width is <= the mobile width breakpoint, false otherwise
 * 
 */
export const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;
