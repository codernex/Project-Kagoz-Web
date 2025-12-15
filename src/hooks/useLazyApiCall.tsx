import { useEffect, useState, RefObject } from "react";

interface UseFetchOnVisibleOptions {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
}

/**
 * Hook to perform a fetch or action when a component becomes visible in the viewport.
 *
 * @param elementRef - The reference to the DOM element to observe.
 * @param action - The callback function to execute when the element is visible.
 * @param deps - Dependencies for the callback to trigger when it changes.
 * @param options - IntersectionObserver options.
 */
export const useFetchOnVisible = (
  elementRef: RefObject<Element | null>,
  action: () => void,
  options: UseFetchOnVisibleOptions = {}
) => {
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const { threshold = 0.7, root = null, rootMargin = "0px" } = options;

    if (!elementRef.current || hasFetched) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          action();
          setHasFetched(true);
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, action, hasFetched, options]);
};
