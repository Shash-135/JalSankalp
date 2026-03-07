import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ onScan }) => {
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (!scanning) return;

    // Initialize scanner
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
      false
    );

    scanner.render(
      (decodedText) => {
        // Stop scanning on success
        scanner.clear();
        setScanning(false);
        // We assume the QR contains just a pump ID like "1" or JSON. 
        // We'll pass it up. The parent should fetch the real pump details.
        onScan?.({ qr_code: decodedText });
      },
      (error) => {
        // Ignore constant frame scanning errors. They happen every frame until a code is found.
      }
    );

    return () => {
      scanner.clear().catch(e => console.error("Failed to clear scanner", e));
    };
  }, [scanning, onScan]);

  return (
    <div className="bg-slate-900 rounded-lg p-6 grid gap-4 text-center border-4 border-slate-800 shadow-inner relative overflow-hidden">
      {/* Decorative view-finder corners */}
      <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-secondary opacity-80"></div>
      <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-secondary opacity-80"></div>
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-secondary opacity-80"></div>
      <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-secondary opacity-80"></div>

      <div className="text-xl font-black text-white uppercase tracking-wider relative z-10 text-shadow-md">Scan Infrastructure QR</div>
      
      {!scanning ? (
        <>
          <p className="text-sm text-slate-300 font-medium relative z-10 mx-4">
            Automatically detect pump identifiers via camera.
          </p>
          <div className="mt-2 relative z-10">
            <button 
              className="w-full py-4 rounded-md bg-secondary text-white font-black text-lg uppercase tracking-wider hover:bg-orange-700 transition shadow-lg border-2 border-transparent hover:border-orange-900" 
              onClick={() => setScanning(true)}
            >
              Initialize Scanner
            </button>
          </div>
        </>
      ) : (
        <div className="relative z-10 bg-white rounded-md overflow-hidden p-2">
          <div id="qr-reader" className="w-full"></div>
          <button 
            className="mt-4 w-full py-2 bg-slate-200 text-slate-800 font-bold rounded hover:bg-slate-300"
            onClick={() => setScanning(false)}
          >
            Cancel Scan
          </button>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
