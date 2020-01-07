import { useEffect } from 'react';

export const useOnClickOutside = (ref, handler) => {
  // Put a ref={el} on the element
  // Pass that ref and a handler to useOnClickOutside()
  useEffect(() => {
    const listener = e => {

      if (!ref.current || ref.current.contains(e.target)) {
        return
      }
      handler();
    }
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    }
  }, [])
}