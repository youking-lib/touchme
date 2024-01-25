import React, { useEffect, useState } from "react";

export function useIsEllipsis(
  ref: React.RefObject<HTMLElement>,
  deps: React.DependencyList = []
) {
  const [isEllipsis, setIsEllipsis] = useState(false);

  useEffect(() => {
    if (!ref.current) {
      setIsEllipsis(false);
      return;
    }

    if (ref.current.scrollWidth > ref.current.clientWidth) {
      setIsEllipsis(true);
    } else {
      setIsEllipsis(false);
    }
  }, deps);

  return isEllipsis;
}
