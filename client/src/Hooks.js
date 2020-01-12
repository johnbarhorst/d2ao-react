import { useEffect, useState } from 'react';

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
  }, [ref, handler]);
}

// Todo: Doesn't update after api call
export const useSetPageTitle = title => {
  const [pageTitle, setPageTitle] = useState(document.title);
  const updateTitle = newTitle => newTitle ? document.title = `D2AO: ${newTitle}` : document.title = `D2AO`;
  useEffect(() => {
    setPageTitle(title);
    updateTitle(pageTitle);
  }, [pageTitle, title]);
}