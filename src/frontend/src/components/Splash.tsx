import { useEffect } from "react";
const logo = "/icon.jpg";

export function Splash({ onFinish }: { onFinish?: () => void }) {
  useEffect(() => {
    return () => {
      // cleanup if needed
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0f1724]">
      <div className="flex flex-col items-center gap-6">
        <img
          src={logo}
          alt="logo"
          className="w-56 h-56 rounded-lg object-contain shadow-xl"
        />
        <div className="text-white text-sm font-medium tracking-wide">Loading...</div>
      </div>
    </div>
  );
}
