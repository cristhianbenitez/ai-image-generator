export const imageUtils = {
  convertBlobToBase64: async (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert image to base64'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  },

  createColoredPrompt: (prompt: string, color: string | null): string => {
    if (!color) return prompt;
    return `${prompt}, ${color.toLowerCase()} color theme, ${color.toLowerCase()} tones`;
  },

  parseResolution: (resolution: string): { width: number; height: number } => {
    const [width, height] = resolution
      .split('×')
      .map(str => parseInt(str.trim()));
    return { width, height };
  },
};
