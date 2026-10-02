import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

export default function ReferPage() {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get('ref');

  useEffect(() => {
    const handleReferral = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/customer/refer-link?ref=${ref || ''}`);
        if (res.data?.success && res.data?.data?.playStoreUrl) {
          window.location.href = res.data.data.playStoreUrl;
        } else {
          window.location.href = 'https://play.google.com/store/apps/details?id=com.alltimemarket.app';
        }
      } catch (err) {
        window.location.href = 'https://play.google.com/store/apps/details?id=com.alltimemarket.app';
      }
    };
    handleReferral();
  }, [ref]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900">
      <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
      <h2 className="text-xl font-bold">Redirecting to Play Store...</h2>
      <p className="text-slate-500 mt-2">Please wait while we take you to the app.</p>
    </div>
  );
}
