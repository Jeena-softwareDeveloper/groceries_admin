import { useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import { X, Download, Copy, Check, QrCode, Building, Phone, UserCheck, Printer } from 'lucide-react';
import type { Staff } from '../../types/staff.types';
import { toast } from 'sonner';

interface StaffQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | null;
}

export function StaffQrModal({ isOpen, onClose, staff }: StaffQrModalProps) {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !staff) return null;

  // Referral payload: direct URL format or code
  const referralUrl = `https://alltimemarket.com/become-vendor?ref=${staff.code}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Referral code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    try {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Canvas with white padding and branding
        const padding = 32;
        const headerHeight = 70;
        const footerHeight = 60;
        canvas.width = img.width + padding * 2;
        canvas.height = img.height + padding * 2 + headerHeight + footerHeight;

        if (ctx) {
          // Background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Top Banner
          ctx.fillStyle = '#16a34a';
          ctx.fillRect(0, 0, canvas.width, 8);

          // Header Text
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 18px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(staff.name, canvas.width / 2, 40);

          ctx.fillStyle = '#64748b';
          ctx.font = '13px Inter, sans-serif';
          ctx.fillText(staff.designation || 'Field Representative', canvas.width / 2, 60);

          // Draw QR Code
          ctx.drawImage(img, padding, headerHeight + padding);

          // Footer Text
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 16px monospace';
          ctx.fillText(`CODE: ${staff.code}`, canvas.width / 2, canvas.height - 35);

          ctx.fillStyle = '#16a34a';
          ctx.font = '11px Inter, sans-serif';
          ctx.fillText('All Time Market • Vendor Onboarding', canvas.width / 2, canvas.height - 16);

          const pngFile = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.download = `staff-qr-${staff.code}.png`;
          downloadLink.href = pngFile;
          downloadLink.click();
          toast.success('QR Code downloaded successfully!');
        }
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch (e) {
      console.error(e);
      toast.error('Failed to download QR image');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] transition-opacity" 
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[111] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <QrCode size={18} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 m-0">Staff Referral QR</h3>
                <p className="text-[11px] text-slate-400 m-0">Vendor onboarding badge & code</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 flex flex-col items-center">
            
            {/* Staff info card */}
            <div className="w-full bg-slate-50 border border-slate-200/70 rounded-xl p-3 mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold text-base flex items-center justify-center shadow-sm">
                  {staff.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="m-0 text-sm font-bold text-slate-900 leading-tight">{staff.name}</h4>
                  <span className="text-xs text-slate-500 font-medium">{staff.designation || 'Field Marketing Executive'}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Referral Code</span>
                <div className="font-mono text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-md">
                  {staff.code}
                </div>
              </div>
            </div>

            {/* QR Code container */}
            <div 
              ref={qrRef}
              className="bg-white p-5 rounded-2xl border-2 border-dashed border-emerald-300 shadow-inner flex flex-col items-center justify-center"
            >
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <QRCode
                  value={referralUrl}
                  size={190}
                  level="H"
                />
              </div>
              <p className="text-[11px] font-medium text-slate-500 mt-3 text-center">
                Scan with phone camera to register vendor under <br />
                <span className="font-bold text-slate-800">{staff.name}</span>
              </p>
            </div>

            {/* Referral code copy row */}
            <div className="w-full mt-4 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2">
              <span className="text-xs font-mono font-bold text-slate-700 px-2 flex-1 truncate">
                {staff.code}
              </span>
              <button
                onClick={() => handleCopy(staff.code)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                {copied ? 'Copied' : 'Copy Code'}
              </button>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500">
              Assigned: {staff.area?.name ? `${staff.area.name}, ${staff.district?.name}` : 'Platform-wide'}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="h-9 px-3 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-2xs"
                title="Print QR Badge"
              >
                <Printer size={14} />
                Print
              </button>
              <button
                onClick={handleDownload}
                className="h-9 px-4 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Download size={14} />
                Download PNG
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
