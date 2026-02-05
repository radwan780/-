import React, { useState } from 'react';
import { ImageFile } from '../types';
import ImageUploader from './ImageUploader';
import ResultDisplay from './ResultDisplay';

interface ImageWorkspaceProps {
  productImage: ImageFile | null;
  onProductImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  generatedImage: ImageFile | null;
  isLoading: boolean;
}

const WorkspaceHeader: React.FC<{title: string, step: string}> = ({title, step}) => (
    <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-bold text-slate-200">{title}</h3>
        <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-900/20 px-2 py-0.5 rounded border border-sky-500/20">{step}</span>
    </div>
)

const ImageWorkspace: React.FC<ImageWorkspaceProps> = ({ productImage, onProductImageUpload, generatedImage, isLoading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[500px]">
      <div className="flex flex-col h-full tech-card rounded-lg p-4">
        <WorkspaceHeader title="المنتج الأصلي (Input)" step="01" />
        <div className="flex-1 min-h-[300px] relative">
            <ImageUploader 
                id="product-uploader"
                title="اسحب الصورة هنا أو اضغط للرفع"
                image={productImage}
                onImageUpload={onProductImageUpload}
            />
        </div>
      </div>
      
      <div className="flex flex-col h-full tech-card rounded-lg p-4 relative">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-sky-500/10 to-transparent rounded-tr-lg pointer-events-none"></div>
        <WorkspaceHeader title="النتيجة النهائية (Render)" step="02" />
        <div className="flex-1 min-h-[300px]">
            <ResultDisplay 
                imageFile={generatedImage}
                isLoading={isLoading}
            />
        </div>
      </div>
    </div>
  );
};

export default ImageWorkspace;