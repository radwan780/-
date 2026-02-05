import React from 'react';
import { ImageFile } from '../types';

interface ImageUploaderProps {
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  image: ImageFile | null;
  title: string;
  id: string;
  compact?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, image, title, id, compact = false }) => {
  return (
    <div className="w-full h-full">
      <label htmlFor={id} className={`cursor-pointer group relative block w-full ${compact ? 'aspect-video' : 'aspect-square md:aspect-auto md:h-full'}`}>
        <div className={`
            relative w-full h-full bg-slate-800/50 
            border border-slate-700 hover:border-sky-500/50 hover:bg-slate-800
            transition-all duration-300 overflow-hidden
            flex flex-col justify-center items-center text-center p-4
            ${image ? '' : 'border-dashed'}
        `}>
            
            {/* Corner Accents */}
            <div className="corner-accent top-0 right-0 border-t-2 border-r-2 rounded-tr-sm"></div>
            <div className="corner-accent top-0 left-0 border-t-2 border-l-2 rounded-tl-sm"></div>
            <div className="corner-accent bottom-0 right-0 border-b-2 border-r-2 rounded-br-sm"></div>
            <div className="corner-accent bottom-0 left-0 border-b-2 border-l-2 rounded-bl-sm"></div>

          {image ? (
            <>
                <img src={`data:${image.mimeType};base64,${image.base64}`} alt={title} className="absolute inset-0 w-full h-full object-contain p-2" />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <span className="text-white text-sm bg-slate-800 px-4 py-2 rounded-md border border-slate-600 shadow-xl flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        تغيير الصورة
                    </span>
                </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 z-10">
              <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center group-hover:bg-sky-500/20 group-hover:text-sky-400 transition-colors text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`${compact ? 'h-5 w-5' : 'h-6 w-6'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                 </svg>
              </div>
              <p className={`text-slate-400 group-hover:text-white transition-colors font-medium ${compact ? 'text-xs' : 'text-sm'}`}>{title}</p>
            </div>
          )}
        </div>
      </label>
      <input id={id} type="file" className="hidden" accept="image/*" onChange={onImageUpload} />
    </div>
  );
};

export default ImageUploader;