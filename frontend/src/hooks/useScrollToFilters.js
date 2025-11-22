import { useCallback } from "react";

export const useScrollToFilters = () => {
  const scrollToFilters = useCallback(() => {
    const filterSection = document.querySelector(
      ".bg-white.rounded-xl.shadow-sm.border.p-6.mb-8"
    );

    if (filterSection) {
      window.scrollTo({
        top: filterSection.offsetTop - 64,
        behavior: "smooth",
      });
    }
  }, []);

  return scrollToFilters;
};
