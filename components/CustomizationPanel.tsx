import React from 'react';
import { CustomizationOptions, ImageFile } from '../types';
import { LIGHTING_STYLES, CAMERA_PERSPECTIVES } from '../constants';
import ImageUploader from './ImageUploader';

interface CustomizationPanelProps {
  options: CustomizationOptions;
  setOptions: React.Dispatch<React.SetStateAction<CustomizationOptions>>;
  styleImage: ImageFile | null;
  onStyleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isAnalyzingStyle: boolean;
}

const CustomSelect: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: { value: string; label: string }[] }> = ({ label, value, onChange, options }) => (
    <div className="group">
        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide group-hover:text-sky-500 transition-colors">{label}</label>
        <div className="relative">
            <select value={value} onChange={onChange} className="w-full tech-input rounded-md text-sm py-3 px-3 appearance-none cursor-pointer hover:border-slate-600 transition-colors">
                {options.map(opt => <option key={opt.value} value={opt.value} className="bg-slate-800">{opt.label}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-slate-500 group-hover:text-sky-500 transition-colors">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
        </div>
    </div>
);


const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ options, setOptions, styleImage, onStyleImageUpload, isAnalyzingStyle }) => {
  const handleChange = <K extends keyof CustomizationOptions,>(key: K, value: CustomizationOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="tech-card rounded-lg p-6 flex flex-col gap-6">
      <div className="border-b border-slate-800 pb-4 mb-2">
         <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            إعدادات المشهد
         </h2>
      </div>
      
      <CustomSelect 
        label="الإضاءة والجو العام"
        value={options.lightingStyle}
        onChange={(e) => handleChange('lightingStyle', e.target.value as CustomizationOptions['lightingStyle'])}
        options={LIGHTING_STYLES}
      />

      <CustomSelect 
        label="زاوية التصوير"
        value={options.cameraPerspective}
        onChange={(e) => handleChange('cameraPerspective', e.target.value as CustomizationOptions['cameraPerspective'])}
        options={CAMERA_PERSPECTIVES}
      />

      <div>
        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">نسخ النمط (Reference)</label>
        <div className="relative">
            <ImageUploader 
                id="style-uploader"
                title="اضغط لرفع صورة مرجعية"
                image={styleImage}
                onImageUpload={onStyleImageUpload}
                compact={true}
            />
            {isAnalyzingStyle && (
                <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center rounded border border-sky-500/30">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-sky-500"></div>
                <p className="text-xs text-sky-400 mt-2 font-mono animate-pulse">جاري التحليل...</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;