import { useState, useContext, useEffect } from "react";
import { SnackBarContext } from "../../../App";
import { UseQueryResult } from "react-query";

// Custom hook for managing loading and error states
export const useLoadingAndError = (query: UseQueryResult) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const snackBar = useContext(SnackBarContext);

  useEffect(() => {
    if (query.data) {
      setIsLoading(false);
      setIsError(false);
    } else if (query.isFetching || query.isLoading) {
      setIsLoading(true);
    } else if (query.error) {
      setIsLoading(false);
      setIsError(true);
    }
  }, [query]);

  useEffect(() => {
    if (isError) {
      snackBar.setSnackBar({
        showSnackbar: true,
        setShowSnackbar: () => true,
        message: "Error creating playlist. Please try again.",
        isError: true,
      });
      setIsError(false);
    }
  }, [isError]);

  return { isLoading, setIsLoading, isError, setIsError, snackBar };
};
