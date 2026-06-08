import { useRef, useState } from "react";

export default function CameraPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [ws, setWs] = useState(null);
  const [resultImg, setResultImg] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState(null);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
      setIsCameraActive(true);

      const socket = new WebSocket("wss://zinklorin-bbackend.hf.space/ws");
      setWs(socket);

      socket.onmessage = (event) => {
        setResultImg("data:image/jpeg;base64," + event.data);
      };

      socket.onerror = () => {
        setError("Koneksi WebSocket gagal. Pastikan server berjalan.");
      };

      const interval = setInterval(() => {
        if (!videoRef.current || socket.readyState !== 1) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const videoWidth = videoRef.current.videoWidth || 640;
        const videoHeight = videoRef.current.videoHeight || 480;

        canvas.width = videoWidth;
        canvas.height = videoHeight;

        ctx.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

        canvas.toBlob((blob) => {
          if (socket.readyState === 1) socket.send(blob);
        }, "image/jpeg");
      }, 200);

      socket.interval = interval;
    } catch (err) {
      setError("Gagal mengakses kamera. Pastikan browser memiliki izin akses.");
      console.error("Gagal mengakses kamera:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    if (ws) {
      clearInterval(ws.interval);
      ws.close();
    }
    setIsCameraActive(false);
    setResultImg(null);
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

      {/* Main Camera Container - Combined Camera + Detection */}
      <div className="flex flex-col gap-4">
        {/* Live Camera Feed with Overlay Detection */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg w-full">
          <div className="aspect-[4/3] bg-black flex items-center justify-center relative w-full">
            {/* Video Feed Base */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Detection Result Overlay - Bounding Boxes */}
            {resultImg && isCameraActive && (
              <img 
                src={resultImg} 
                className="absolute inset-0 w-full h-full object-cover" 
                alt="Deteksi Bounding Box" 
              />
            )}

            {/* Status Badge */}
            {isCameraActive && resultImg && (
              <div className="absolute top-4 right-4 z-10">
                <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Deteksi
                </span>
              </div>
            )}

            {/* Placeholder - Camera Not Active */}
            {!isCameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 text-slate-400 p-6 text-center z-10">
                <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-full mb-4">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-200 mb-2">Deteksi Kamera</h3>
                <p className="text-xs text-slate-500 max-w-xs">Mulai kamera untuk deteksi objek real-time dengan bounding box</p>
              </div>
            )}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-3">
          <button
            onClick={startCamera}
            disabled={isCameraActive}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:from-slate-700 disabled:to-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-4 py-3 md:py-4 rounded-xl transition duration-200 active:scale-[0.98] text-sm md:text-base"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            Start
          </button>
          <button
            onClick={stopCamera}
            disabled={!isCameraActive}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-4 py-3 md:py-4 rounded-xl transition duration-200 active:scale-[0.98] text-sm md:text-base"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm0 2h12v12H4V4z" clipRule="evenodd" />
            </svg>
            Stop
          </button>
        </div>
      </div>

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
