import { useEffect, useState } from "react";

const breakPoints = {
  640: "sm",
  768: "md",
  1024: "lg",
  1260: "xl",
  1536: "2xl",
};

export const isSmall = (breakPoint: string): boolean => {
  return breakPoint === "sm";
};
export const isMedium = (breakPoint: string): boolean => {
  return breakPoint === "md";
};
export const isLarge = (breakPoint: string): boolean => {
  return breakPoint === "lg";
};
export const isXLarge = (breakPoint: string): boolean => {
  return breakPoint === "xl";
};
export const is2XLarge = (breakPoint: string): boolean => {
  return breakPoint === "2xl";
};

export const useBreakPoint = () => {
  const [breakpoint, setBreakPoint] = useState("");
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    if (windowSize.width <= 640) {
      setBreakPoint(breakPoints[640]);
    } else if (windowSize.width <= 768) {
      setBreakPoint(breakPoints[768]);
    } else if (windowSize.width <= 1024) {
      setBreakPoint(breakPoints[1024]);
    } else if (windowSize.width <= 1280) {
      setBreakPoint(breakPoints[1260]);
    } else {
      setBreakPoint(breakPoints[1536]);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [windowSize.width]);

  return breakpoint;
};
