import { RefObject, useEffect } from 'react';

// This hook automatically adjusts the height of a textarea based on its content
export const useAutoResize = (textAreaRef: RefObject<HTMLTextAreaElement>) => {
  useEffect(() => {
    const textArea = textAreaRef.current;
    if (!textArea) return;

    // Function to adjust the textarea height
    const adjustHeight = () => {
      // First reset height to default 42px to get accurate scrollHeight
      textArea.style.height = '42px';

      // Get the height of content including overflow
      const scrollHeight = textArea.scrollHeight;

      // Set the height to either scrollHeight or minimum 42px
      textArea.style.height = scrollHeight > 42 ? `${scrollHeight}px` : '42px';
    };

    // Run adjustHeight whenever user types/inputs into textarea
    textArea.addEventListener('input', adjustHeight);

    // Initial height adjustment when component mounts
    adjustHeight();

    // Cleanup event listener when component unmounts
    return () => textArea.removeEventListener('input', adjustHeight);
  }, [textAreaRef]); // Re-run effect if textAreaRef changes
};
