import { useState, useRef } from "react";
import axios from "axios";

export default function UploadPage() {
  const fileInputRef = useRef(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi ukuran file (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Ukuran file terlalu besar. Maksimal 10MB.");
      return;
    }

    setError(null);
    setUploadedFileName(file.name);
    setUploadPreview(URL.createObjectURL(file));
    setUploadResult(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("https://zinklorin-bbackend.hf.space/detect", formData, {
        timeout: 30000,
      });
      setUploadResult("data:image/jpeg;base64," + res.data.image);
    } catch (err) {
      setError("Gagal memproses gambar. Pastikan server berjalan.");
      console.error("Gagal upload gambar:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setUploadPreview(null);
    setUploadResult(null);
    setUploadedFileName(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4 pb-4 md:pb-0">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4 flex items-start gap-3 animate-fadeIn">
          <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-300">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 flex-shrink-0">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Main Upload Container - Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 auto-rows-max">
        {/* Left Column: File Upload Area */}
        <div className="flex flex-col gap-4">
          {/* Upload Area Card */}
          <div className="bg-slate-900 border-2 border-dashed border-slate-700 hover:border-indigo-500/50 rounded-2xl p-6 md:p-8 text-center transition duration-300 cursor-pointer">
            <label className="flex flex-col items-center justify-center gap-4 cursor-pointer h-full">
              <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-full">
                <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-slate-200 mb-1">Upload Gambar</h3>
                <p className="text-xs md:text-sm text-slate-500">Klik untuk memilih atau drag & drop</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={uploadImage}
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <label className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold px-4 py-3 md:py-4 rounded-xl transition duration-200 active:scale-[0.98] cursor-pointer text-sm md:text-base">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
              </svg>
              Pilih File
              <input
                ref={fileInputRef}
                type="file"
                onChange={uploadImage}
                className="hidden"
                accept="image/*"
              />
            </label>
            {uploadPreview && (
              <button
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-3 md:py-4 rounded-xl transition duration-200 active:scale-[0.98] text-sm md:text-base"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Preview & Results */}
        {uploadPreview && (
          <div className="flex flex-col gap-4">
            {/* Original Image Preview */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="px-4 pt-4 pb-3 border-b border-slate-800">
                <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Gambar Asli</span>
              </div>
              <div className="aspect-video bg-slate-950 flex items-center justify-center p-2">
                <img
                  src={uploadPreview}
                  className="w-full h-full object-contain rounded"
                  alt="Preview Asli"
                />
              </div>
            </div>

            {/* Detection Result */}
            {uploadResult && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="px-4 pt-4 pb-3 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Hasil Deteksi</span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full font-medium">
                    ✓ Selesai
                  </span>
                </div>
                <div className="aspect-video bg-slate-950 flex items-center justify-center p-2">
                  <img
                    src={uploadResult}
                    className="w-full h-full object-contain rounded"
                    alt="Hasil Deteksi"
                  />
                </div>
              </div>
            )}

            {/* Loading State */}
            {isUploading && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="px-4 pt-4 pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Memproses...</span>
                </div>
                <div className="aspect-video bg-slate-950 flex flex-col items-center justify-center gap-3">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 border-r-indigo-500 animate-spin" />
                  </div>
                  <p className="text-sm text-slate-400 font-medium">Menganalisis gambar...</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info Box */}
      {!uploadPreview && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <p className="text-xs md:text-sm text-slate-400">
              Format: JPG, PNG | Ukuran max: 10MB | Resolusi optimal: min 640x480
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
