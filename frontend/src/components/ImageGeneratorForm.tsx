import React, { FormEvent, useRef } from 'react';

import CloseIcon from '@assets/icons/close.svg';
import GenerateIcon from '@assets/icons/home.svg';
import { COLORS, COLORSHEX, GUIDANCE_SCALE, RESOLUTIONS } from '@constants';
import { useAutoResize } from '@hooks';
import type { FormData } from '@types';

type ImageGeneratorFormProps = {
  formData: FormData;
  onChange: (formData: FormData) => void;
  onSubmit: (e: FormEvent) => void;
};

export const ImageGeneratorForm = ({
  formData,
  onChange,
  onSubmit
}: ImageGeneratorFormProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutoResize(textAreaRef);

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col flex-start gap-8 max-w-[511px] w-full"
      aria-label="Image Generation Form"
    >
      {/* Prompt */}
      <div className="form-group" role="group" aria-labelledby="prompt-label">
        <label id="prompt-label" className="text-gray text-label font-semibold">
          Prompt
          <span className="text-red ml-1" aria-label="required">*</span>
        </label>
        <textarea
          ref={textAreaRef}
          id="prompt"
          value={formData.prompt}
          onChange={e => onChange({ ...formData, prompt: e.target.value })}
          placeholder="Enter the prompt"
          className="form-input overflow-hidden"
          required
          aria-required="true"
          aria-describedby="prompt-description"
        />
        <span id="prompt-description" className="sr-only">
          Enter a description of the image you want to generate
        </span>
      </div>

      {/* Negative prompt */}
      <div className="form-group" role="group" aria-labelledby="negative-prompt-label">
        <label id="negative-prompt-label" className="text-gray text-label font-semibold">
          Negative prompt (Optional)
        </label>
        <input
          type="text"
          id="negative-prompt"
          value={formData.negativePrompt}
          onChange={e =>
            onChange({ ...formData, negativePrompt: e.target.value })
          }
          placeholder="Enter negative prompt"
          className="form-input min-h-[42px]"
          aria-describedby="negative-prompt-description"
        />
        <span id="negative-prompt-description" className="sr-only">
          Enter what you don't want to see in the generated image
        </span>
      </div>

      {/* Colors */}
      <div className="form-group" role="group" aria-labelledby="colors-label">
        <label id="colors-label" className="text-gray text-label font-semibold mb-3">
          Colors
        </label>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Color selection">
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
                  onChange({
                    ...formData,
                    color: e.target.value as (typeof COLORS)[number]
                  })
                }
                className="sr-only"
                aria-label={color}
              />
              <span
                className="block w-full h-full rounded-full"
                style={{ backgroundColor: COLORSHEX[color] }}
                aria-hidden="true"
              />
            </label>
          ))}
          <button
            type="button"
            onClick={() => onChange({ ...formData, color: '' })}
            className="w-8 h-8 rounded-full border border-darkAlt2 flex items-center justify-center cursor-pointer"
            aria-label="Clear color selection"
          >
            <img src={CloseIcon} alt="" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Resolution */}
      <div className="form-group" role="group" aria-labelledby="resolution-label">
        <label id="resolution-label" className="text-gray text-label font-semibold mb-3">
          Resolution
        </label>
        <div
          className="flex flex-wrap items-center gap-3"
          role="radiogroup"
          aria-label="Resolution selection"
        >
          {RESOLUTIONS.map(resolution => (
            <label
              key={resolution}
              className={`border rounded-lg py-1.5 px-3 flex items-center justify-center cursor-pointer transition-colors ${
                formData.resolution === resolution
                  ? 'border-purple bg-purple text-white'
                  : 'border-darkAlt2 hover:border-purple'
              }`}
            >
              <input
                type="radio"
                name="resolution"
                value={resolution}
                checked={formData.resolution === resolution}
                onChange={e =>
                  onChange({
                    ...formData,
                    resolution: e.target.value as (typeof RESOLUTIONS)[number]
                  })
                }
                className="sr-only"
                aria-label={`Resolution ${resolution}`}
              />
              <span className="text-small font-normal">{resolution}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-group" role="group" aria-labelledby="guidance-label">
        <label id="guidance-label" className="text-gray text-label font-semibold">
          Guidance Scale ({formData.guidance.toFixed(1)})
        </label>
        <input
          type="range"
          id="guidance"
          min={GUIDANCE_SCALE.MIN}
          max={GUIDANCE_SCALE.MAX}
          step={GUIDANCE_SCALE.STEP}
          value={formData.guidance}
          onChange={e =>
            onChange({
              ...formData,
              guidance: parseFloat(e.target.value)
            })
          }
          className="w-full accent-purple"
          aria-label={`Guidance scale: ${formData.guidance.toFixed(1)}`}
          aria-describedby="guidance-description"
        />
        <div className="flex justify-between text-xs text-gray mt-1">
          <span id="guidance-description">Less Creative</span>
          <span>More Creative</span>
        </div>
      </div>

      {/* Generate button */}
      <button
        type="submit"
        className="flex items-center justify-center gap-2 bg-purple hover:bg-purple/90 text-white py-3 px-4 rounded-lg transition-colors"
        aria-label="Generate image with current settings"
      >
        <img src={GenerateIcon} alt="" aria-hidden="true" className="w-5 h-5" />
        Generate Image
      </button>
    </form>
  );
};
