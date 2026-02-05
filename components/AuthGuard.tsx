import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface AuthGuardProps {
  onVerified: (user: User) => void;
}

// Token provided by user
const TELEGRAM_BOT_TOKEN = '8390439612:AAGzZsNpu5dYBIm4zY-wYt5BcfPB5a6auDM';
// Hardcoded Admin ID
const ADMIN_CHAT_ID = '6108446682';

const AuthGuard: React.FC<AuthGuardProps> = ({ onVerified }) => {
  // User Data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check local storage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('radwan_user');
    
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.isVerified) {
          onVerified(parsed);
        }
      } catch (e) {
        localStorage.removeItem('radwan_user');
      }
    }
  }, [onVerified]);

  const sendToTelegram = async (userData: User) => {
      const message = `
🔔 <b>تسجيل دخول جديد</b>
----------------------------
👤 <b>الاسم:</b> ${userData.name}
📧 <b>البريد:</b> ${userData.email}
📱 <b>الهاتف:</b> ${phone || 'غير محدد'}
📅 <b>الوقت:</b> ${new Date().toLocaleString('ar-SA')}
----------------------------
✨ <i>تم الإرسال من استوديو رضوان ميديا</i>
      `;

      try {
          const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
          await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  chat_id: ADMIN_CHAT_ID,
                  text: message,
                  parse_mode: 'HTML'
              })
          });
      } catch (e) {
          console.error('Telegram Error:', e);
          // We continue even if telegram fails, to not block the user
      }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
        setError('يرجى إدخال الاسم والبريد الإلكتروني');
        return;
    }

    setLoading(true);
    setError(null);

    const user: User = {
        name: name,
        email: email,
        isVerified: true
    };

    // Send notification in background
    await sendToTelegram(user);

    // Save and Proceed
    localStorage.setItem('radwan_user', JSON.stringify(user));
    setLoading(false);
    onVerified(user);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      <div className="w-full max-w-md tech-card p-8 rounded-xl shadow-2xl border border-slate-800 relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
        </div>
        
        <div className="relative z-10 text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-6 relative group">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-sky-500/20 blur-xl rounded-full group-hover:bg-sky-500/30 transition-all duration-700"></div>
                
                {/* Logo SVG */}
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10 drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
                    <defs>
                        <linearGradient id="logo_grad_lg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#0ea5e9" />
                            <stop offset="1" stopColor="#0369a1" />
                        </linearGradient>
                    </defs>
                    <rect width="40" height="40" rx="10" fill="url(#logo_grad_lg)" />
                     <path d="M20 8C13.37 8 8 13.37 8 20C8 26.63 13.37 32 20 32C26.63 32 32 26.63 32 20C32 13.37 26.63 8 20 8ZM20 27.2C16.02 27.2 12.8 23.98 12.8 20C12.8 16.02 16.02 12.8 20 12.8C23.98 12.8 27.2 16.02 27.2 20C27.2 23.98 23.98 27.2 20 27.2Z" fill="white" fillOpacity="0.25"/>
                    <path d="M20 15.2C17.35 15.2 15.2 17.35 15.2 20C15.2 22.65 17.35 24.8 20 24.8C22.65 24.8 24.8 22.65 24.8 20C24.8 17.35 22.65 15.2 20 15.2Z" fill="white"/>
                    <path d="M33 7L29 11M7 33L11 29" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">RADWAN<span className="text-sky-500">MEDIA</span></h1>
            <p className="text-slate-400 text-sm font-medium tracking-wide flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                SYSTEM ONLINE
            </p>
        </div>

        {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs mb-6 text-center relative z-10">
                {error}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 relative z-10">
        <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">الاسم الكامل</label>
            <input 
            type="text" 
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full tech-input rounded p-3 text-sm"
            placeholder="الاسم الثلاثي"
            />
        </div>
        <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">البريد الإلكتروني</label>
            <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full tech-input rounded p-3 text-sm"
            placeholder="name@example.com"
            />
        </div>
        <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">رقم الهاتف (اختياري)</label>
            <input 
            type="tel" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full tech-input rounded p-3 text-sm text-left"
            placeholder="+966..."
            dir="ltr"
            />
        </div>
        
        <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-3 rounded text-white font-bold text-sm flex justify-center items-center gap-2 mt-6"
        >
            {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
            تسجيل الدخول للنظام
        </button>
        </form>
      </div>
    </div>
  );
};

export default AuthGuard;