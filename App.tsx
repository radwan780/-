import React, { useState, useEffect, useCallback } from 'react';
import { CustomizationOptions, ImageFile, User } from './types';
import { generateImage, analyzeStyleImage } from './services/geminiService';
import CustomizationPanel from './components/CustomizationPanel';
import ImageWorkspace from './components/ImageWorkspace';
import PromptEditor from './components/PromptEditor';
import AuthGuard from './components/AuthGuard';
import { LIGHTING_STYLES, CAMERA_PERSPECTIVES } from './constants';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [productImage, setProductImage] = useState<ImageFile | null>(null);
  const [styleImage, setStyleImage] = useState<ImageFile | null>(null);
  const [generatedImage, setGeneratedImage] = useState<ImageFile | null>(null);
  
  const [styleDescription, setStyleDescription] = useState<string | null>(null);
  const [isAnalyzingStyle, setIsAnalyzingStyle] = useState<boolean>(false);

  const [options, setOptions] = useState<CustomizationOptions>({
    lightingStyle: LIGHTING_STYLES[0].value,
    cameraPerspective: CAMERA_PERSPECTIVES[0].value,
  });

  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check for existing user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('radwan_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.isVerified) {
          setUser(parsed);
        }
      } catch (e) {
        localStorage.removeItem('radwan_user');
      }
    }
  }, []);

  useEffect(() => {
    if (styleImage) {
      const getStyleDescription = async () => {
        setIsAnalyzingStyle(true);
        setError(null);
        try {
          const description = await analyzeStyleImage(styleImage);
          setStyleDescription(description);
        } catch (err) {
          console.error(err);
          setError(err instanceof Error ? err.message : "تعذر تحليل صورة النمط.");
          setStyleDescription(null);
        } finally {
          setIsAnalyzingStyle(false);
        }
      };
      getStyleDescription();
    } else {
      setStyleDescription(null);
    }
  }, [styleImage]);


  useEffect(() => {
    const generateNewPrompt = () => {
      if (!productImage) return '';
      let newPrompt = `قم بتوليد صورة منتج احترافية عالية الدقة للموضوع الموجود في الصورة المقدمة.

المتطلبات الرئيسية:
- الإضاءة: قم بإضاءة المشهد بنمط ${options.lightingStyle}. يجب أن تكون الإضاءة جذابة وتبرز تفاصيل المنتج.
- منظور الكاميرا: التقط المنتج من ${options.cameraPerspective}.
- الخلفية: يجب أن تكون الخلفية نظيفة وغير مشتتة للانتباه ومكملة للمنتج. يفضل إعداد استوديو راقي ودقيق.
- المزاج العام: يجب أن تبدو الصورة فاخرة ونظيفة وملهمة.`;

      if (styleImage) {
        if (isAnalyzingStyle) {
            newPrompt += `\n\n- مرجع النمط: جاري تحليل صورة المرجع المقدمة...`;
        } else if (styleDescription) {
            newPrompt += `\n\n- مرجع النمط: التزم بدقة بجماليات صورة المرجع المقدمة، والتي تتميز بـ ${styleDescription}. الهدف هو جعل المنتج يبدو وكأنه ينتمي إلى نفس العالم البصري.`;
        } else {
             newPrompt += `\n\n- مرجع النمط: التزم بدقة بالجماليات ولوحة الألوان والملمس والمزاج العام لصورة المرجع المقدمة. الهدف هو جعل المنتج يبدو وكأنه ينتمي إلى نفس العالم البصري لمرجع النمط.`;
        }
      }

      setPrompt(newPrompt);
    };
    generateNewPrompt();
  }, [options, productImage, styleImage, styleDescription, isAnalyzingStyle]);
  
  const handleGenerate = useCallback(async () => {
    if (!productImage || !prompt) {
      setError('يرجى تحميل صورة المنتج والتأكد من أن الموجه ليس فارغاً.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateImage(productImage, prompt, styleImage);
      setGeneratedImage(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'حدث خطأ غير معروف أثناء توليد الصورة.');
    } finally {
      setIsLoading(false);
    }
  }, [productImage, prompt, styleImage]);

  const handleFileChange = (setter: React.Dispatch<React.SetStateAction<ImageFile | null>>) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setter({
          base64: base64String.split(',')[1],
          mimeType: file.type,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
      localStorage.removeItem('radwan_user');
      // We do NOT remove the chat_id so the admin config stays
      setUser(null);
  };

  if (!user) {
      return <AuthGuard onVerified={setUser} />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-slate-950">
      {/* Header */}
      <nav className="w-full bg-slate-900 border-b border-slate-800 py-4 px-6 md:px-12 mb-8 shadow-lg z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
                {/* Brand Logo */}
                <div className="relative w-10 h-10 group">
                    <div className="absolute inset-0 bg-sky-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg relative z-10">
                        <defs>
                            <linearGradient id="logo_grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#0ea5e9" />
                                <stop offset="1" stopColor="#0369a1" />
                            </linearGradient>
                        </defs>
                        <rect width="40" height="40" rx="10" fill="url(#logo_grad)" />
                        {/* Abstract Camera Lens / Eye */}
                        <path d="M20 10C14.48 10 10 14.48 10 20C10 25.52 14.48 30 20 30C25.52 30 30 25.52 30 20C30 14.48 25.52 10 20 10ZM20 26C16.69 26 14 23.31 14 20C14 16.69 16.69 14 20 14C23.31 14 26 16.69 26 20C26 23.31 23.31 26 20 26Z" fill="white" fillOpacity="0.25"/>
                        <path d="M20 16.5C18.07 16.5 16.5 18.07 16.5 20C16.5 21.93 18.07 23.5 20 23.5C21.93 23.5 23.5 21.93 23.5 20C23.5 18.07 21.93 16.5 20 16.5Z" fill="white"/>
                        {/* Accents */}
                        <path d="M31 9L28 12M9 31L12 28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-white tracking-wide font-sans leading-none flex items-center gap-1">
                        RADWAN<span className="text-sky-500">MEDIA</span>
                    </h1>
                    <p className="text-[9px] text-slate-400 tracking-[0.2em] uppercase font-bold mt-1">AI Production Studio</p>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end mr-2">
                    <span className="text-xs text-white font-bold">{user.name}</span>
                    <span className="text-[10px] text-sky-500">{user.email}</span>
                </div>
                <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white border border-slate-600 ring-2 ring-transparent hover:ring-sky-500/50 transition-all">
                        {user.name.charAt(0)}
                </div>
                <button 
                    onClick={handleLogout}
                    className="text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded transition-colors"
                >
                    خروج
                </button>
            </div>
        </div>
      </nav>
      
      <main className="w-full max-w-7xl px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 flex-grow">
        {/* Main Workspace (Left) */}
        <div className="lg:col-span-8 space-y-6">
            <ImageWorkspace 
                productImage={productImage} 
                onProductImageUpload={handleFileChange(setProductImage)}
                generatedImage={generatedImage}
                isLoading={isLoading}
            />
             <PromptEditor 
                prompt={prompt}
                setPrompt={setPrompt}
            />
        </div>

        {/* Sidebar Controls (Right) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
            <CustomizationPanel 
                options={options}
                setOptions={setOptions}
                styleImage={styleImage}
                onStyleImageUpload={handleFileChange(setStyleImage)}
                isAnalyzingStyle={isAnalyzingStyle}
            />
            
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm" role="alert">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="font-bold">خطأ:</span> 
                    </div>
                    <div className="mt-1 mr-6 opacity-90">{error}</div>
                </div>
            )}

             <button 
                onClick={handleGenerate}
                disabled={isLoading || !productImage || isAnalyzingStyle}
                className="btn-primary w-full text-white font-bold py-4 px-6 rounded-lg shadow-lg shadow-sky-900/20 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sky-500/20 flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        جاري المعالجة...
                    </>
                ) : isAnalyzingStyle ? (
                    'جاري تحليل النمط...'
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        بدء المعالجة (Render)
                    </>
                )}
            </button>
        </div>
      </main>

      <footer className="w-full bg-slate-900 border-t border-slate-800 py-6 text-center mt-auto">
        <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-slate-400 text-sm flex items-center gap-2">
                <span className="font-bold text-sky-500">Radwan Media</span> &copy; {new Date().getFullYear()}
                <span className="hidden sm:inline text-slate-600">|</span>
                <span className="text-slate-500">تطوير رضوان ميديا - جميع الحقوق محفوظة</span>
            </p>
            <p className="text-[10px] text-slate-600 font-mono tracking-widest">SECURE RENDER ENGINE PROTECTION</p>
        </div>
      </footer>
    </div>
  );
}

export default App;