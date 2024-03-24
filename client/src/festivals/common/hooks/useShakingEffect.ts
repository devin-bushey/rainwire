import { useState, useEffect } from "react";

export const useShakingEffect = () => {
  const [isShaking, setIsShaking] = useState(false);
  const [isSignInShaking, setIsSignInShaking] = useState(false);

  useEffect(() => {
    function handleShaking() {
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
      }, 2000);
    }

    function handleSignInShaking() {
      setIsSignInShaking(true);
      setTimeout(() => {
        setIsSignInShaking(false);
      }, 2000);
    }

    handleSignInShaking();

    const intervalId = setInterval(() => {
      handleShaking();
    }, 8000);

    return () => clearInterval(intervalId);
  }, []);

  return { isShaking, isSignInShaking };
};
