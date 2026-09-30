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

  const referralUrl = `https://alltimemarket.com/refer?ref=${staff.code}`;
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
      // Generate HD PNG directly using browser native rendering (supports oklch, shadows, svgs)
      const dataUrl = await toPng(previewRef.current, {
        pixelRatio: 3, // 3x HD resolution
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

          {/* Dual Card Preview */}
          <div className="p-4 sm:p-6 overflow-x-auto flex justify-center" style={{ background: 'linear-gradient(135deg, #c8d6e0 0%, #8fa3b0 100%)' }}>
            <div
              ref={previewRef}
              style={{
                background: 'linear-gradient(135deg, #c8d6e0 0%, #8fa3b0 100%)',
                padding: '20px 24px',
                borderRadius: 20,
                display: 'inline-flex',
                gap: 24,
                width: 'fit-content',
              }}
            >

              {/* ── FRONT CARD ── */}
              <div className="flex flex-col items-center gap-2">
                <span style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Front</span>
                <div style={{ position: 'relative', paddingTop: 22 }}>
                  {/* Lanyard notch */}
                  <div style={{ position: 'absolute', top: 0, left: 'calc(50% - 23px)', width: 46, height: 22, background: '#c4cacf', borderRadius: 7, zIndex: 10 }} />
                  <div style={{ position: 'absolute', top: 6, left: 'calc(50% - 15px)', width: 30, height: 12, background: '#d8dde2', borderRadius: 5, zIndex: 10 }} />

                  <div style={{ width: cardW, borderRadius: 26, overflow: 'hidden', background: '#fff', boxShadow: '0 24px 60px rgba(0,0,0,0.22)' }}>

                    {/* Green header */}
                    <div style={{ background: 'linear-gradient(135deg, #1a4731 0%, #1b6c42 100%)', paddingBottom: 44, position: 'relative', overflow: 'hidden' }}>
                      {/* Blob */}
                      <div style={{ position: 'absolute', top: -40, right: -40, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                      {/* Floating leaves */}
                      <div style={{ position: 'absolute', left: 10, top: 55, fontSize: 16, opacity: 0.8 }}>🍃</div>
                      <div style={{ position: 'absolute', right: 10, top: 60, fontSize: 16, opacity: 0.8 }}>🍃</div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16, paddingLeft: 16, paddingRight: 16, position: 'relative', zIndex: 5 }}>
                        {/* Logo */}
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: '#fff', padding: 6, border: '2px solid rgba(74,222,128,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', marginBottom: 8 }}>
                          <img src="/logo.png" alt="ATM" style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        </div>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: '#fff', letterSpacing: '0.12em' }}>ALL TIME MARKET</p>
                        <p style={{ margin: '2px 0 0', fontSize: 8, fontWeight: 700, color: '#86efac', letterSpacing: '0.1em' }}>FRESH GROCERIES • FAST DELIVERY</p>
                        <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.15)', fontSize: 8, fontWeight: 700, color: '#fff' }}>
                          <Sparkles size={8} style={{ color: '#fcd34d' }} /> OFFICIAL REFERRAL PASS
                        </div>
                      </div>

                      {/* Organic white wave at bottom of header */}
                      <div style={{ position: 'absolute', bottom: -22, left: '-25%', width: '150%', height: 48, borderRadius: '50%', background: '#ffffff' }} />

                      {/* Lighter green wave offset */}
                      <div style={{ position: 'absolute', bottom: -10, right: '-10%', width: '65%', height: 44, borderRadius: '50%', background: 'rgba(34,197,94,0.2)' }} />
                    </div>

                    {/* White body with produce + avatar */}
                    <div style={{ background: 'linear-gradient(to bottom, #f0fdf4 0%, #fff 60%)', padding: '0 12px 12px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                      {/* Produce emojis */}
                      <div style={{ position: 'absolute', left: 2, top: 10, fontSize: 22, opacity: 0.7 }}>🥦</div>
                      <div style={{ position: 'absolute', right: 2, top: 8, fontSize: 22, opacity: 0.7 }}>🌽</div>
                      <div style={{ position: 'absolute', left: 0, top: 60, fontSize: 20, opacity: 0.6 }}>🥕</div>
                      <div style={{ position: 'absolute', right: 0, top: 60, fontSize: 20, opacity: 0.6 }}>🍇</div>
                      {/* Radial overlay */}
                      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.9) 35%, transparent 75%)' }} />

                      {/* Avatar */}
                      <div style={{ position: 'relative', zIndex: 5, marginTop: -22, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: 72, height: 72, borderRadius: 18, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 900, color: '#fff', boxShadow: '0 8px 24px rgba(5,150,105,0.35)', outline: '4px solid #fff' }}>
                          {staff.name.charAt(0).toUpperCase()}
                        </div>
                        <p style={{ margin: '8px 0 0', fontSize: 14, fontWeight: 900, color: '#0f172a' }}>{staff.name}</p>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '3px 10px', borderRadius: 20, background: '#d1fae5', border: '1px solid #6ee7b7', fontSize: 8, fontWeight: 700, color: '#064e3b', marginTop: 4 }}>
                          <CheckCircle2 size={8} /> Verified
                        </div>
                        <p style={{ margin: '6px 0 0', fontSize: 11, fontWeight: 700, color: '#1a4731' }}>{staff.designation || 'Field Executive'}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 10, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 2 }}>
                          <MapPin size={9} /> {location}
                        </p>
                      </div>
                    </div>

                    {/* Dark green footer */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'linear-gradient(135deg, #1a4731, #155d38)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      {[
                        { icon: <Leaf size={14} style={{ color: '#6ee7b7' }} />, l1: 'FRESH', l2: 'PRODUCTS' },
                        { icon: <Truck size={14} style={{ color: '#6ee7b7' }} />, l1: 'FAST', l2: 'DELIVERY' },
                        { icon: <ShieldCheck size={14} style={{ color: '#6ee7b7' }} />, l1: 'TRUSTED', l2: 'VENDORS' },
                      ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 4px', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.12)' : 'none', gap: 2 }}>
                          {item.icon}
                          <span style={{ fontSize: 7, fontWeight: 700, color: '#a7f3d0', lineHeight: 1.2 }}>{item.l1}</span>
                          <span style={{ fontSize: 7, fontWeight: 700, color: '#a7f3d0', lineHeight: 1.2 }}>{item.l2}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── BACK CARD ── */}
              <div className="flex flex-col items-center gap-2">
                <span style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Back</span>
                <div style={{ position: 'relative', paddingTop: 22 }}>
                  {/* Lanyard notch */}
                  <div style={{ position: 'absolute', top: 0, left: 'calc(50% - 23px)', width: 46, height: 22, background: '#c4cacf', borderRadius: 7, zIndex: 10 }} />
                  <div style={{ position: 'absolute', top: 6, left: 'calc(50% - 15px)', width: 30, height: 12, background: '#d8dde2', borderRadius: 5, zIndex: 10 }} />

                  <div style={{ width: cardW, borderRadius: 26, overflow: 'hidden', background: '#fff', boxShadow: '0 24px 60px rgba(0,0,0,0.22)' }}>

                    {/* Top header with organic green shape */}
                    <div style={{ position: 'relative', height: 68, overflow: 'hidden', background: '#fff' }}>
                      {/* Main diagonal green */}
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, #1a4731 58%, transparent 100%)', clipPath: 'polygon(0 0, 100% 0, 68% 62%, 22% 88%, 0 68%)' }} />
                      {/* Right wave accent */}
                      <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 70, background: 'rgba(34,197,94,0.28)', borderBottomLeftRadius: '80%' }} />
                      {/* Leaf */}
                      <div style={{ position: 'absolute', top: 4, right: 6, fontSize: 24 }}>🍃</div>
                      {/* Logo + text */}
                      <div style={{ position: 'absolute', left: 10, top: 10, display: 'flex', alignItems: 'center', gap: 8, zIndex: 5 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fff', padding: 4, border: '1.5px solid rgba(74,222,128,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <img src="/logo.png" alt="ATM" style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: 10, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>ALL TIME MARKET</p>
                          <p style={{ margin: 0, fontSize: 7, fontWeight: 600, color: '#86efac', lineHeight: 1.2 }}>FRESH GROCERIES • FAST DELIVERY</p>
                        </div>
                      </div>
                    </div>

                    {/* QR section */}
                    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, background: '#fff' }}>
                      {/* QR with viewfinder ONLY */}
                      <div style={{ position: 'relative', padding: 10, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        {/* L-shaped corner brackets using inline styles */}
                        <VFCorner position="tl" size={20} thickness={3} color="#22c55e" offset={-6} />
                        <VFCorner position="tr" size={20} thickness={3} color="#22c55e" offset={-6} />
                        <VFCorner position="bl" size={20} thickness={3} color="#22c55e" offset={-6} />
                        <VFCorner position="br" size={20} thickness={3} color="#22c55e" offset={-6} />
                        <div ref={qrRef} style={{ background: '#fff', padding: 6, borderRadius: 10 }}>
                          <QRCode value={referralUrl} size={130} level="H" />
                        </div>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                          <QrCode size={10} style={{ color: '#22c55e' }} />
                          Scan to join All Time Market
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: 8, color: '#94a3b8' }}>Phone camera, Google Lens, or QR scanner</p>
                      </div>

                      {/* Referral code dark box */}
                      <div style={{ width: '100%', background: '#0f172a', borderRadius: 12, padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <span style={{ fontSize: 7, fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block' }}>Referral Code</span>
                          <span style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 900, color: '#4ade80', letterSpacing: '0.05em' }}>{staff.code}</span>
                        </div>
                        <button onClick={() => handleCopy(staff.code, 'Referral code')} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 9, fontWeight: 700, cursor: 'pointer' }}>
                          {copied ? <Check size={10} style={{ color: '#4ade80' }} /> : <Copy size={10} />}
                          {copied ? 'Copied' : 'Copy'}
                        </button>
                      </div>

                      {/* URL row */}
                      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, padding: '5px 10px' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 7, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 110 }}>{referralUrl}</span>
                        <button onClick={() => handleCopy(referralUrl, 'Link')} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 8, fontWeight: 700, color: '#059669', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          <Copy size={8} /> Copy Link
                        </button>
                      </div>
                    </div>

                    {/* Footer */}
                    <div style={{ padding: '8px 12px 10px', background: '#fff', borderTop: '1px solid #f1f5f9' }}>
                      {/* City skyline bars */}
                      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 1.5, marginBottom: 6, opacity: 0.18 }}>
                        {[10,16,8,22,12,28,10,18,6,24,12,20,8,14,22,10,16].map((h, i) => (
                          <div key={i} style={{ width: 4, height: h, background: '#475569', borderRadius: '2px 2px 0 0' }} />
                        ))}
                      </div>
                      <p style={{ margin: 0, fontSize: 8, fontWeight: 600, color: '#94a3b8', textAlign: 'center' }}>——&nbsp;SUPPORT LOCAL • GROW TOGETHER&nbsp;——</p>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 4 }}>
                        <Leaf size={10} style={{ color: '#4ade80' }} />
                        <Leaf size={8} style={{ color: '#86efac' }} />
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
              <button onClick={() => window.print()} className="h-10 px-4 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm">
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
