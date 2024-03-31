import { useRef, useEffect } from "react";

export const useAdjustFontSize = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const adjustFontSize = () => {
      const container = containerRef.current;
      if (container) {
        const textElement = container.querySelector("span");

        if (textElement) {
          let fontSize = parseFloat(window.getComputedStyle(textElement).fontSize);
          while (textElement.offsetHeight > 16) {
            fontSize -= 1;
            textElement.style.fontSize = fontSize + "px";
          }
        }
      }
    };

    adjustFontSize();

    // Attach event listener for window resize
    window.addEventListener("resize", adjustFontSize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", adjustFontSize);
    };
  }, []); // Empty dependency array means this effect runs once after the initial render

  return containerRef;
};
