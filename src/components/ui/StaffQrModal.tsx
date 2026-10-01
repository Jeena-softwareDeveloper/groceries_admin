import { useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image';
import {
  X, Download, Copy, Check, Printer,
  CheckCircle2, MapPin, Sparkles, Leaf, Truck, ShieldCheck, CreditCard, QrCode,
} from 'lucide-react';
import type { Staff } from '../../types/staff.types';
import { toast } from 'sonner';

interface StaffQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | null;
}

// Viewfinder L-bracket using inline styles for precision
const VFCorner = ({
  position,
  size = 22,
  thickness = 3,
  color = '#22c55e',
  offset = -8,
}: {
  position: 'tl' | 'tr' | 'bl' | 'br';
  size?: number;
  thickness?: number;
  color?: string;
  offset?: number;
}) => {
  const base: React.CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    pointerEvents: 'none',
    zIndex: 10,
  };
  const posStyles: Record<string, React.CSSProperties> = {
    tl: { top: offset, left: offset, borderTop: `${thickness}px solid ${color}`, borderLeft: `${thickness}px solid ${color}`, borderRadius: '4px 0 0 0' },
    tr: { top: offset, right: offset, borderTop: `${thickness}px solid ${color}`, borderRight: `${thickness}px solid ${color}`, borderRadius: '0 4px 0 0' },
    bl: { bottom: offset, left: offset, borderBottom: `${thickness}px solid ${color}`, borderLeft: `${thickness}px solid ${color}`, borderRadius: '0 0 0 4px' },
    br: { bottom: offset, right: offset, borderBottom: `${thickness}px solid ${color}`, borderRight: `${thickness}px solid ${color}`, borderRadius: '0 0 4px 0' },
  };
  return <div style={{ ...base, ...posStyles[position] }} />;
};

export function StaffQrModal({ isOpen, onClose, staff }: StaffQrModalProps) {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !staff) return null;

  const baseUrl = import.meta.env.VITE_WEB_APP_URL;
  const referralUrl = `${baseUrl}/refer?ref=${staff.code}`;
  const location = staff.area?.name
    ? `${staff.area.name}, ${staff.district?.name || 'Tamil Nadu'}`
    : staff.district?.name || 'All Areas, Tamil Nadu';

  const handleCopy = (text: string, label = 'Copied') => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Download: capture HTML preview directly via html-to-image ──────
  const handleDownload = async () => {
    if (!previewRef.current) {
      toast.error('Preview not ready');
      return;
    }
    try {
      setIsGenerating(true);
      const dataUrl = await toPng(previewRef.current, {
        pixelRatio: 3,
        cacheBust: true,
      });

      const a = document.createElement('a');
      a.download = `atm-id-card-${staff.name.toLowerCase().replace(/\s+/g, '-')}-${staff.code}.png`;
      a.href = dataUrl;
      a.click();
      toast.success('ID Card downloaded — exactly matches preview!');
    } catch (e) {
      console.error(e);
      toast.error('Download failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = async () => {
    if (!previewRef.current) {
      toast.error('Preview not ready');
      return;
    }
    try {
      setIsGenerating(true);
      toast.loading('Preparing high quality print...', { id: 'print-toast' });
      // Generate HD PNG
      const dataUrl = await toPng(previewRef.current, {
        pixelRatio: 3,
        cacheBust: true,
      });
      
      // Print via hidden iframe
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      iframe.contentDocument?.write(`
        <html>
          <head>
            <title>Print Staff ID</title>
            <style>
              @page { margin: 10mm; size: auto; }
              body { margin: 0; display: flex; justify-content: center; font-family: sans-serif; }
              img { width: 320px; height: auto; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" onload="window.print(); setTimeout(() => window.parent.document.body.removeChild(window.frameElement), 1000);" />
          </body>
        </html>
      `);
      iframe.contentDocument?.close();
      toast.success('Print ready!', { id: 'print-toast' });
    } catch (e) {
      console.error(e);
      toast.error('Print failed', { id: 'print-toast' });
    } finally {
      setIsGenerating(false);
    }
  };

  // Card width for preview
  const cardW = 220;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110]" onClick={onClose} />
      <div className="fixed inset-0 z-[111] flex items-center justify-center p-3 overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto" style={{ width: '100%', maxWidth: 700 }}>

          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CreditCard size={17} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 m-0">Staff ID Card — Front &amp; Back</h3>
                <p className="text-[11px] text-slate-400 m-0">Premium dual-sided lanyard card</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer">
              <X size={18} />
            </button>
          </div>

          {/* Card Preview Area */}
          <div className="p-4 sm:p-6 overflow-x-auto flex justify-center" style={{ background: 'linear-gradient(135deg, #c8d6e0 0%, #8fa3b0 100%)' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #c8d6e0 0%, #8fa3b0 100%)',
                padding: '20px 24px',
                borderRadius: 20,
                display: 'inline-flex',
                gap: 24,
                width: 'fit-content',
              }}
            >

              {/* ── SINGLE CARD ── */}
              <div className="flex flex-col items-center gap-2">
                <div style={{ position: 'relative' }}>

                  {/* Main Card */}
                  <div ref={previewRef} className="print-only-card" style={{ 
                    width: 320,
                    minWidth: 320,
                    maxWidth: 320,
                    height: 520,
                    minHeight: 520,
                    maxHeight: 520,
                    flexShrink: 0,
                    borderRadius: 28, 
                    overflow: 'hidden', 
                    background: 'url(/id-template.png) center/cover no-repeat #fff', 
                    boxShadow: '0 24px 60px rgba(0,0,0,0.25)', 
                    position: 'relative' 
                  }}>
                    
                    {/* Top header (Logo + ATM Text) */}
                    <div style={{ position: 'absolute', top: 32, left: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: '#fff', padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        <img src="/logo.png" alt="ATM" style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 17, fontWeight: 900, color: '#fff', letterSpacing: '0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>ALL TIME MARKET</p>
                        <p style={{ margin: '2px 0 0', fontSize: 9, fontWeight: 700, color: '#a7f3d0', letterSpacing: '0.08em', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>ALL SHOPS & ITEMS • FAST DELIVERY</p>
                      </div>
                    </div>

                    {/* QR Code (centered) */}
                    <div style={{ position: 'absolute', top: 110, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                      <div style={{ position: 'relative', padding: 12, borderRadius: 24, background: '#fff', border: '1px solid #f1f5f9', boxShadow: '0 12px 35px rgba(0,0,0,0.06)' }}>
                        <VFCorner position="tl" size={26} thickness={4} color="#22c55e" offset={-8} />
                        <VFCorner position="tr" size={26} thickness={4} color="#22c55e" offset={-8} />
                        <VFCorner position="bl" size={26} thickness={4} color="#22c55e" offset={-8} />
                        <VFCorner position="br" size={26} thickness={4} color="#22c55e" offset={-8} />
                        <div ref={qrRef} style={{ background: '#fff', padding: 10, borderRadius: 14 }}>
                          <QRCode value={referralUrl} size={150} level="H" />
                        </div>
                      </div>

                      <div style={{ textAlign: 'center', marginTop: 14 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          <QrCode size={14} style={{ color: '#22c55e' }} />
                          Scan to register as Vendor
                        </p>
                        <p style={{ margin: '4px 0 0', fontSize: 10, color: '#64748b', fontWeight: 500 }}>Point camera or Google Lens</p>
                      </div>
                    </div>

                    {/* Footer Area: Staff Name & Referral Code */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#fff', padding: '14px 20px 18px', display: 'flex', flexDirection: 'column', gap: 10, borderTop: '2px solid rgba(16,185,129,0.1)', boxShadow: '0 -10px 40px rgba(0,0,0,0.05)' }}>
                      
                      {/* Staff Info Box */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#fff', boxShadow: '0 4px 12px rgba(5,150,105,0.25)' }}>
                          {staff.name.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{staff.name}</p>
                            <CheckCircle2 size={12} style={{ color: '#10b981' }} />
                          </div>
                          <p style={{ margin: '1px 0 0', fontSize: 10, fontWeight: 700, color: '#64748b' }}>{staff.designation || 'Field Executive'}</p>
                        </div>
                      </div>

                      {/* Referral code dark box */}
                      <div style={{ background: '#050b14', borderRadius: 14, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <span style={{ fontSize: 8, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>Referral Code</span>
                          <span style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 900, color: '#4ade80', letterSpacing: '0.06em' }}>{staff.code}</span>
                        </div>
                        <button onClick={() => handleCopy(staff.code, 'Referral code')} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.05)', color: '#fff', fontSize: 10, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                          {copied ? <Check size={12} style={{ color: '#4ade80' }} /> : <Copy size={12} />}
                          {copied ? 'Copied' : 'Copy'}
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Footer actions */}
          <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
            <p className="text-xs text-slate-400 font-medium m-0">Single HD image · both sides combined</p>
            <div className="flex items-center gap-2">
              <button disabled={isGenerating} onClick={handlePrint} className="h-10 px-4 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50">
                <Printer size={14} /> Print
              </button>
              <button disabled={isGenerating} onClick={handleDownload}
                className="h-10 px-5 text-xs font-bold rounded-xl text-white flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50 hover:scale-105 active:scale-95 transition-all"
                style={{ background: 'linear-gradient(135deg, #059669, #0d9488)' }}>
                <Download size={14} />
                {isGenerating ? 'Generating…' : 'Download HD Card'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
