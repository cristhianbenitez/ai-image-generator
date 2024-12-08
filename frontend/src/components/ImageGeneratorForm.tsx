import { FormEvent, useRef, useState } from 'react';

import CloseIcon from '@assets/icons/close.svg';
import GenerateIcon from '@assets/icons/home.svg';

import { useAutoResize } from '@hooks/useAutoResize';

type FormDataType = {
  prompt: string;
  negativePrompt: string;
  color: (typeof COLORS)[number];
  resolution: (typeof RESOLUTIONS)[number];
  guidance: number;
};

type ImageGeneratorFormProps = {
  onSubmit: (formData: FormDataType) => void;
};

export const RESOLUTIONS = [
  '1024 × 1024 (1:1)',
  '1152 × 896 (9:7)',
  '896 × 1152 (7:9)',
  '1344 × 768 (7:4)',
  '768 × 1344 (4:7)',
] as const;

export const COLORS = [
  'Red',
  'Orange',
  'Green',
  'Blue',
  'Purple',
  'White',
] as const;
export const COLORSHEX = {
  Red: '#DD524C',
  Orange: '#E87B35',
  Green: '#5EC269',
  Blue: '#4E80EE',
  Purple: '#9D59EF',
  White: '#E4E4E7',
} as const;

export const ImageGeneratorForm = ({ onSubmit }: ImageGeneratorFormProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutoResize(textAreaRef);

  const [formData, setFormData] = useState<FormDataType>({
    prompt: '',
    negativePrompt: '',
    color: 'White',
    resolution: '1024 × 1024 (1:1)',
    guidance: 5.0,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col flex-start gap-8 max-w-[511px] w-full"
    >
      {/* Prompt */}
      <fieldset className="form-group">
        <legend className="text-gray text-label font-semibold">Prompt</legend>
        <textarea
          ref={textAreaRef}
          value={formData.prompt}
          onChange={e =>
            setFormData(prev => ({ ...prev, prompt: e.target.value }))
          }
          placeholder="Enter the prompt"
          className="form-input overflow-hidden"
          required
        />
      </fieldset>

      {/* Negative prompt */}
      <fieldset className="form-group">
        <legend className="text-gray text-label font-semibold">
          Negative prompt (Optional)
        </legend>
        <input
          type="text"
          value={formData.negativePrompt}
          onChange={e =>
            setFormData(prev => ({
              ...prev,
              negativePrompt: e.target.value,
            }))
          }
          placeholder="Enter negative prompt"
          className="form-input min-h-[42px]"
        />
      </fieldset>

      {/* Colors */}
      <fieldset className="form-group">
        <legend className="text-gray text-label font-semibold mb-3">
          Colors
        </legend>
        <div className="flex flex-wrap gap-2">
          {COLORS.map(color => (
            <label
              key={color}
              className={`w-8 h-8 rounded-full relative cursor-pointer ${
                formData.color === color
                  ? 'ring-2 ring-purple ring-offset-2 ring-offset-dark'
                  : ''
              }`}
            >
              <input
                type="radio"
                name="color"
                value={color}
                checked={formData.color === color}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    color: e.target.value as (typeof COLORS)[number],
                  }))
                }
                className="sr-only"
              />
              <span
                className="block w-full h-full rounded-full"
                style={{ backgroundColor: COLORSHEX[color] }}
              />
            </label>
          ))}
          <div className="w-8 h-8 rounded-full border border-darkAlt2 flex items-center justify-center cursor-pointer">
            <img src={CloseIcon} alt="Clear color" />
          </div>
        </div>
      </fieldset>

      {/* Resolution */}
      <fieldset className="form-group">
        <legend className="text-gray text-label font-semibold mb-3">
          Resolution
        </legend>
        <div className="flex flex-wrap items-center gap-3">
          {RESOLUTIONS.map(resolution => (
            <label
              key={resolution}
              className={`border rounded-lg py-1.5 px-3 flex items-center justify-center cursor-pointer transition-colors ${
                formData.resolution === resolution
                  ? 'border-purple bg-purple text-white'
                  : 'border-darkAlt2 hover:border-purple'
              }`}
              role="radio"
              aria-checked={formData.resolution === resolution}
            >
              <input
                type="radio"
                name="resolution"
                value={resolution}
                checked={formData.resolution === resolution}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    resolution: e.target.value as (typeof RESOLUTIONS)[number],
                  }))
                }
                className="sr-only"
                aria-label={`Select ${resolution} resolution`}
              />
              <span className="text-small font-normal">{resolution}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="form-group">
        <legend className="text-gray text-label font-semibold">
          Guidance ({formData.guidance.toFixed(1)})
        </legend>
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={formData.guidance}
          onChange={e =>
            setFormData(prev => ({
              ...prev,
              guidance: parseFloat(e.target.value),
            }))
          }
          className="w-full accent-purple"
        />
      </fieldset>

      {/* Generate button */}
      <button
        type="submit"
        className="flex items-center justify-center gap-2 bg-purple hover:bg-purple/90 text-white py-3 px-4 rounded-lg transition-colors"
      >
        <img src={GenerateIcon} alt="" className="w-5 h-5" />
        Generate Image
      </button>
    </form>
  );
};
