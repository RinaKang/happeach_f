import { useEffect } from 'react';

/**
 * @param {RefObject} ref - 외부 클릭을 감지할 타겟 요소 (useRef)
 * @param {Function} callback - 외부 클릭 시 실행할 함수
 */
export const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      callback(event);
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, callback]);
};