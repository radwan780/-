import React from 'react';

interface PromptEditorProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
}

const PromptEditor: React.FC<PromptEditorProps> = ({ prompt, setPrompt }) => {
  return (
    <div className="tech-card rounded-lg p-4">
       <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-bold text-gray-300 flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            الموجه (AI Prompt)
          </h2>
          <span className="text-[10px] text-gray-600 font-mono">EDITABLE</span>
       </div>
       <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
        className="w-full tech-input rounded p-3 text-sm font-mono text-gray-300 leading-relaxed resize-none focus:h-32 transition-all"
        placeholder="سيظهر وصف المشهد هنا..."
      />
    </div>
  );
};

export default PromptEditor;