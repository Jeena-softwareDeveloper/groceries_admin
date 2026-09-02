import { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { QrCode, Download, Link2, Copy, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../components/ui';

export default function QrGeneratorPage() {
  const [inputValue, setInputValue] = useState('');
  const [baseUrl, setBaseUrl] = useState(window.location.origin);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const finalUrl = inputValue.startsWith('http') 
    ? inputValue 
    : inputValue 
      ? `${baseUrl.replace(/\/$/, '')}/${inputValue.replace(/^\//, '')}` 
      : baseUrl;

  const handleDownload = () => {
    if (!qrRef.current) return;
    
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `qr-code-${Date.now()}.png`;
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      }
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1000px] mx-auto pb-12 text-slate-900">
      <PageHeader 
        title="QR Code Generator" 
        description="Create QR codes for your domain links instantly." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left Column: Inputs */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-semibold text-slate-700 flex items-center gap-1.5">
              <Link2 size={16} className="text-green-600" />
              Domain / Base URL
            </label>
            <input 
              type="text" 
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://yourdomain.com"
              className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3 rounded-lg text-[13px] text-slate-700 outline-none transition-all focus:border-green-600 focus:bg-white focus:ring-[3px] focus:ring-green-600/10"
            />
            <p className="text-[11px] text-slate-500">The base domain for your generated links.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-semibold text-slate-700 flex items-center gap-1.5">
              <QrCode size={16} className="text-green-600" />
              Path or Full URL
            </label>
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g. shop/123 or https://example.com"
              className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3 rounded-lg text-[13px] text-slate-700 outline-none transition-all focus:border-green-600 focus:bg-white focus:ring-[3px] focus:ring-green-600/10"
            />
            <p className="text-[11px] text-slate-500">
              Enter a path to append to the domain, or a full URL to override it.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <label className="text-[12px] font-bold text-slate-800">Final URL Target:</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-green-50 text-green-800 border border-green-200 py-2 px-3 rounded-lg text-[13px] font-medium break-all select-all">
                {finalUrl}
              </div>
              <button 
                onClick={copyToClipboard}
                className="w-9 h-9 shrink-0 flex items-center justify-center bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-green-600 transition-colors"
                title="Copy URL"
              >
                {copied ? <CheckCircle2 size={16} className="text-green-600" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: QR Preview */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center gap-6 min-h-[350px]">
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm" ref={qrRef}>
            <QRCode 
              value={finalUrl} 
              size={200}
              level="H"
              bgColor="#ffffff"
              fgColor="#0d3d25"
            />
          </div>
          
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Download size={16} />
            Download QR Code (PNG)
          </button>
        </div>
      </div>
    </div>
  );
}
