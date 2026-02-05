import React, { useState } from 'react';
import { ImageFile } from '../types';

interface ResultDisplayProps {
  imageFile: ImageFile | null;
  isLoading: boolean;
}

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="relative">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                 <div className="h-2 w-2 bg-sky-500 rounded-full animate-pulse"></div>
             </div>
        </div>
        <p className="text-xs text-sky-400 font-mono animate-pulse">جاري المعالجة الرقمية...</p>
    </div>
);

const ResultDisplay: React.FC<ResultDisplayProps> = ({ imageFile, isLoading }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = (resolution: '2k' | '4k') => {
        if (!imageFile) return;

        setIsDownloading(true);
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = `data:${imageFile.mimeType};base64,${imageFile.base64}`;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                setIsDownloading(false);
                return;
            };

            const targetWidth = resolution === '4k' ? 4096 : 2048;
            const aspectRatio = img.width / img.height;
            
            canvas.width = targetWidth;
            canvas.height = targetWidth / aspectRatio;

            // Draw original image
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // --- ADD WATERMARK ---
            const fontSize = Math.floor(canvas.width * 0.025); // Responsive font size
            const padding = Math.floor(canvas.width * 0.02);
            
            ctx.save();
            
            // Text settings
            ctx.font = `900 ${fontSize}px "Segoe UI", Arial, sans-serif`;
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            
            // Shadow for contrast
            ctx.shadowColor = "rgba(0,0,0,0.8)";
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;

            // Watermark Text
            const text = "© RADWAN MEDIA | تطوير رضوان ميديا";
            
            // Draw Outline (for dark images)
            ctx.strokeStyle = 'rgba(0,0,0,0.5)';
            ctx.lineWidth = fontSize / 8;
            ctx.strokeText(text, canvas.width - padding, canvas.height - padding);

            // Draw Fill (White)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillText(text, canvas.width - padding, canvas.height - padding);
            
            // Add subtle repeating pattern overlay for extra protection (optional but professional)
            // ctx.font = `bold ${fontSize * 3}px sans-serif`;
            // ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
            // ctx.textAlign = 'center';
            // ctx.translate(canvas.width / 2, canvas.height / 2);
            // ctx.rotate(-Math.PI / 6);
            // ctx.fillText("RADWAN MEDIA", 0, 0);

            ctx.restore();
            // --- END WATERMARK ---

            const link = document.createElement('a');
            link.download = `radwan-media-${resolution}-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            setIsDownloading(false);
        }
        img.onerror = () => {
             setIsDownloading(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col gap-4">
            <div className="w-full flex-1 bg-slate-950 border border-slate-800 rounded flex items-center justify-center overflow-hidden relative group">
                
                {/* Grid overlay for tech feel */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                     style={{backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
                </div>

                {isLoading && <LoadingSpinner />}
                {!isLoading && !imageFile && (
                    <div className="text-center p-6">
                        <div className="w-16 h-16 mx-auto mb-4 border border-slate-800 rounded-full flex items-center justify-center bg-slate-900">
                            <svg className="w-8 h-8 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                        <span className="text-slate-500 text-sm font-medium">مساحة العرض فارغة</span>
                    </div>
                )}
                {!isLoading && imageFile && (
                    <>
                        <img 
                            src={`data:${imageFile.mimeType};base64,${imageFile.base64}`} 
                            alt="Generated Result" 
                            className="object-contain w-full h-full relative z-10"
                        />
                        {/* On-screen Watermark Overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-4 z-20 pointer-events-none flex justify-end">
                            <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-xl">
                                <p className="text-[10px] text-white/90 font-bold font-mono tracking-widest flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
                                    RADWAN MEDIA PROTECTED
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
            {imageFile && !isLoading && (
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => handleDownload('2k')}
                        disabled={isDownloading}
                        className="flex items-center justify-center bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-sky-500/30 text-slate-300 font-medium py-2 px-4 rounded-md text-xs transition-all disabled:opacity-50"
                    >
                        <DownloadIcon />
                        تصدير HD (2K)
                    </button>
                    <button 
                        onClick={() => handleDownload('4k')}
                        disabled={isDownloading}
                        className="flex items-center justify-center bg-sky-900/20 hover:bg-sky-900/40 border border-sky-500/30 text-sky-400 font-medium py-2 px-4 rounded-md text-xs transition-all disabled:opacity-50"
                    >
                        <DownloadIcon />
                        تصدير ULTRA (4K)
                    </button>
                </div>
            )}
        </div>
    );
};

export default ResultDisplay;