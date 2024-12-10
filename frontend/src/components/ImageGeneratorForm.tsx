import { FormEvent, useRef, useState } from 'react';

import CloseIcon from '@assets/icons/close.svg';
import GenerateIcon from '@assets/icons/home.svg';
import type { FormData } from '@types';

import {
  COLORS,
  COLORSHEX,
  GUIDANCE_SCALE,
  RESOLUTIONS,
} from '@constants/image';
import { useAutoResize } from '@hooks';

type ImageGeneratorFormProps = {
  onSubmit: (formData: FormData) => void;
};

export const ImageGeneratorForm = ({ onSubmit }: ImageGeneratorFormProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutoResize(textAreaRef);

  const defaultFormData: FormData = {
    prompt: '',
    negativePrompt: '',
    color: '',
    resolution: '1024 × 1024 (1:1)',
    guidance: 7.0,
  };

  const [formData, setFormData] = useState<FormData>(defaultFormData);

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
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, color: '' }))}
            className="w-8 h-8 rounded-full border border-darkAlt2 flex items-center justify-center cursor-pointer"
          >
            <img src={CloseIcon} alt="Clear color" />
          </button>
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
          Guidance Scale ({formData.guidance.toFixed(1)})
        </legend>
        <input
          type="range"
          min={GUIDANCE_SCALE.MIN}
          max={GUIDANCE_SCALE.MAX}
          step={GUIDANCE_SCALE.STEP}
          value={formData.guidance}
          onChange={e =>
            setFormData(prev => ({
              ...prev,
              guidance: parseFloat(e.target.value),
            }))
          }
          className="w-full accent-purple"
        />
        <div className="flex justify-between text-xs text-gray mt-1">
          <span>Less Creative (1.0)</span>
          <span>More Creative (15.0)</span>
        </div>
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
