"use client";
import { useMediaQuery } from "react-responsive";

const useDevice = () => {
  const isDesktop = useMediaQuery({ query: "(min-width: 1200px)" });
  const isLaptop = useMediaQuery({
    query: "(min-width: 992px) and (max-width: 1199px)",
  });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px) and (max-width: 991px)",
  });
  const isPhone = useMediaQuery({ query: "(max-width: 767px)" });

  return { isDesktop, isLaptop, isTablet, isPhone };
};

export default useDevice;
