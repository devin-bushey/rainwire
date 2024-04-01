import { useEffect } from "react";
import { scrollToTop } from "../utils/browserUtils";

export const setDocumentTitle = (documentTitle: string) => {
  useEffect(() => {
    document.title = documentTitle;
    scrollToTop();
  }, []);
};
