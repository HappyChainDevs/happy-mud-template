import { throttle } from "lodash";
import { useMemo, useState } from "react";
import useResizeObserver, { ResizeHandler } from "use-resize-observer";

/**
 * Returns the width & height of the given element (0 if undefined), even as it resizes.
 */
export function useSize(element?: HTMLElement): { width: number; height: number } {
  const [{ width, height }, setSize] = useState({
    width: element?.offsetWidth ?? 0,
    height: element?.offsetHeight ?? 0,
  });

  const onResize = useMemo<ResizeHandler>(() => {
    return throttle(({ width, height }) => {
      setSize({ width: width ?? 0, height: height ?? 0 });
    }, 500);
  }, []);

  useResizeObserver({
    ref: element,
    onResize,
  });

  return { width, height };
}