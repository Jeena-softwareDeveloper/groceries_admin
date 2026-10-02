import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

export default function ReferPage() {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get('ref');

  useEffect(() => {
    const handleReferral = async () => {
      // Build the Play Store URL with referrer so Google Play passes the code through on first install
      const buildPlayStoreUrl = (baseUrl: string, refCode: string) => {
        const referrer = encodeURIComponent(`utm_source=${refCode}&utm_medium=qr_referral`);
        // If base URL already has query params, just append
        if (baseUrl.includes('?')) {
          return `${baseUrl}&referrer=${referrer}`;
        }
        return `${baseUrl}?referrer=${referrer}`;
      };

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/customer/refer-link?ref=${ref || ''}`);
        const basePlayStoreUrl = (res.data?.success && res.data?.data?.playStoreUrl) 
            ? res.data.data.playStoreUrl 
            : 'https://play.google.com/store/apps/details?id=com.alltimemarket.app';
        
        const playStoreUrl = ref ? buildPlayStoreUrl(basePlayStoreUrl, ref) : basePlayStoreUrl;
            
        // 1. Try to open the mobile app directly using the custom scheme (if app already installed)
        window.location.href = `districtmart://refer?ref=${ref || ''}`;
        
        // 2. If app not installed, fallback to Play Store WITH the referrer so it's tracked on first install
        setTimeout(() => {
          window.location.href = playStoreUrl;
        }, 2000);

      } catch (err) {
        const fallbackUrl = ref
          ? `https://play.google.com/store/apps/details?id=com.alltimemarket.app&referrer=${encodeURIComponent(`utm_source=${ref}&utm_medium=qr_referral`)}`
          : 'https://play.google.com/store/apps/details?id=com.alltimemarket.app';
        window.location.href = `districtmart://refer?ref=${ref || ''}`;
        setTimeout(() => {
          window.location.href = fallbackUrl;
        }, 2000);
      }
    };
    handleReferral();
  }, [ref]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 m-0 p-0 overflow-hidden">
      <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
      <h2 className="text-lg font-medium text-slate-900">Redirecting to Play Store...</h2>
      <p className="text-slate-700 mt-2 text-sm">Please wait while we take you to the app.</p>
    </div>
  );
}
