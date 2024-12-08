import DefaultImage from '@assets/images/box-shapes.png';
import { ImageGeneratorForm } from '@components/ImageGeneratorForm';

import { COLORS, RESOLUTIONS } from '@components/ImageGeneratorForm';

type FormData = {
  prompt: string;
  negativePrompt: string;
  color: (typeof COLORS)[number];
  resolution: (typeof RESOLUTIONS)[number];
  guidance: number;
};

export const Home = () => {
  const handleSubmit = (formData: FormData) => {
    console.log('Form submitted:', formData);
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full mx-[72px] my-[52px] flex justify-center gap-[30px]">
        <ImageGeneratorForm onSubmit={handleSubmit} />

        <div className="max-w-[511px] w-full h-[511px] bg-darkAlt rounded-lg flex items-center justify-center">
          <img
            src={DefaultImage}
            alt="Preview area"
            className="w-60 h-60 object-contain"
          />
        </div>
      </div>
    </div>
  );
};
