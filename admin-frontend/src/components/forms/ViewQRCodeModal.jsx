import React, { useRef } from 'react';
import { HiX, HiDownload } from 'react-icons/hi';
import { QRCodeCanvas } from 'qrcode.react';

const ViewQRCodeModal = ({ pump, onClose }) => {
  const qrRef = useRef();

  const handleDownload = () => {
    const canvas = qrRef.current.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `pump_qr_${pump.qr_code || pump.id}.png`;
      link.href = url;
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-semibold text-slate-800">Registration QR Code</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
            <HiX className="h-5 w-5" />
          </button>
        </div>

        <div className="p-8 flex flex-col items-center">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100" ref={qrRef}>
            <QRCodeCanvas 
              value={pump.qr_code || `JALSANKALP_PUMP_${pump.id}`} 
              size={200}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: '/vite.svg', // Assuming vite logo as placeholder, could be JalSankalp logo
                x: undefined,
                y: undefined,
                height: 24,
                width: 24,
                excavate: true,
              }}
            />
          </div>
          
          <div className="mt-6 text-center">
            <h4 className="font-bold text-slate-800 text-lg">{pump.name}</h4>
            <div className="inline-block px-3 py-1 mt-2 tracking-wider text-xs font-mono font-medium rounded-md bg-slate-100 text-slate-600 border border-slate-200">
              {pump.qr_code || `PUMP_ID:${pump.id}`}
            </div>
            <p className="text-sm text-slate-500 mt-4 leading-relaxed">
              Print and attach this QR code to the physical pump. Operators must scan it to log active sessions.
            </p>
          </div>

          <button
            onClick={handleDownload}
            className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 shadow-sm shadow-primary/20 transition-all"
          >
            <HiDownload className="h-5 w-5" />
            Download QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewQRCodeModal;
