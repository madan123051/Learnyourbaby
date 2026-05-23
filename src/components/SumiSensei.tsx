import React, { useEffect, useState } from 'react';
import { Mic, WifiOff } from 'lucide-react';

export const SumiSensei: React.FC = () => {
  const [online, setOnline] = useState<boolean>(navigator.onLine);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  return (
    <div className="h-full p-4 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center text-center">
      <div className="text-6xl mb-3 animate-bounce">🦝</div>
      <h2 className="text-2xl font-black text-purple-700">Sumi Sensei's Treehouse</h2>
      {!online ? (
        <div className="mt-5 rounded-3xl bg-white/90 p-6 max-w-md shadow-lg">
          <div className="text-4xl mb-2">💤</div>
          <p className="font-bold text-lg">Sumi is napping... Zzz</p>
          <p className="text-sm text-slate-600 mt-1">No internet right now. Let's explore the Forest Map!</p>
          <div className="mt-3 inline-flex items-center gap-2 text-rose-500 font-semibold"><WifiOff size={16}/> Offline mode active</div>
        </div>
      ) : (
        <>
          <p className="mt-2 text-slate-700 max-w-md">Hold the giant mic and speak. Sumi listens and teaches with playful English + Japanese replies.</p>
          <button
            onMouseDown={() => setListening(true)}
            onMouseUp={() => setListening(false)}
            onTouchStart={() => setListening(true)}
            onTouchEnd={() => setListening(false)}
            className={`mt-8 w-44 h-44 rounded-full flex items-center justify-center shadow-2xl transition-transform ${listening ? 'bg-rose-500 scale-95' : 'bg-gradient-to-br from-fuchsia-500 to-violet-600'}`}
          >
            <div className="text-white text-center">
              <Mic size={44} className="mx-auto" />
              <div className="font-bold mt-1">Hold to Talk</div>
            </div>
          </button>
          <p className="mt-4 text-sm text-slate-600">{listening ? '🎙️ Listening...' : 'Tap and hold to start magic chat'}</p>
        </>
      )}
    </div>
  );
};
