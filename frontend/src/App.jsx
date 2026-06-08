import { useState } from "react";
import CameraPage from "./pages/CameraPage";
import UploadPage from "./pages/UploadPage";

export default function App() {
  const [activeTab, setActiveTab] = useState("camera");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100 font-sans antialiased">
      {/* HEADER - Responsive dan Sticky */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-30 px-4 py-3 md:py-4 transition-all duration-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex-shrink-0">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
              </svg>
            </div>
            <h1 className="text-lg md:text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent whitespace-nowrap">
              AI Vision Detector
            </h1>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs md:text-sm text-slate-400">{activeTab === "camera" ? "Deteksi Kamera" : "Upload Gambar"}</p>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA - Responsive Layout */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 md:py-8">
        {/* Camera Page */}
        {activeTab === "camera" && (
          <div className="animate-fadeIn">
            <CameraPage />
          </div>
        )}

        {/* Upload Page */}
        {activeTab === "upload" && (
          <div className="animate-fadeIn">
            <UploadPage />
          </div>
        )}
      </main>

      {/* BOTTOM NAVIGATION - Responsive */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-20 border-t border-slate-800 bg-slate-900/95 backdrop-blur-xl px-4 py-3 shadow-2xl">
        <div className="flex justify-around gap-2 max-w-6xl mx-auto">
          {/* Camera Tab Button */}
          <button
            onClick={() => setActiveTab("camera")}
            className={`flex flex-col items-center gap-1.5 py-2 px-6 rounded-xl transition duration-300 ${
              activeTab === "camera"
                ? "text-indigo-400 bg-indigo-500/10 border border-indigo-500/30"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <svg className="w-5 h-5" fill={activeTab === "camera" ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs font-bold tracking-wider uppercase">Camera</span>
          </button>

          {/* Upload Tab Button */}
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex flex-col items-center gap-1.5 py-2 px-6 rounded-xl transition duration-300 ${
              activeTab === "upload"
                ? "text-indigo-400 bg-indigo-500/10 border border-indigo-500/30"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <svg className="w-5 h-5" fill={activeTab === "upload" ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-bold tracking-wider uppercase">Upload</span>
          </button>
        </div>
      </div>

      {/* DESKTOP TAB NAVIGATION */}
      <div className="hidden md:block max-w-6xl mx-auto border-t border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="flex gap-1 px-4 py-3">
          <button
            onClick={() => setActiveTab("camera")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition duration-300 font-medium ${
              activeTab === "camera"
                ? "text-indigo-400 bg-indigo-500/10 border border-indigo-500/30"
                : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            Deteksi Kamera
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition duration-300 font-medium ${
              activeTab === "upload"
                ? "text-indigo-400 bg-indigo-500/10 border border-indigo-500/30"
                : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Upload Gambar
          </button>
        </div>
      </div>
    </div>
  );
}