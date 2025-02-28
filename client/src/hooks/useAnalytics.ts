/* eslint-disable */
import React from "react";
import { useLocation } from "react-router-dom";

import * as analytics from "./ga4";

export function useAnalytics() {
  const location = useLocation();

  React.useEffect(() => {
    analytics.init();
  }, []);

  React.useEffect(() => {
    const path = location.pathname + location.search;
    //analytics.sendPageview(path);
  }, [location]);
}

export default useAnalytics;
