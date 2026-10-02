import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

export default function ReferPage() {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get('ref');

  useEffect(() => {
    const handleReferral = async () => {
      // Build Play Store URL with referrer so Google Play tracks installs (Deferred Deep Linking)
      const buildPlayStoreUrl = (baseUrl: string, refCode: string) => {
        const referrer = encodeURIComponent(`utm_source=${refCode}&utm_medium=qr_referral`);
        return baseUrl.includes('?') ? `${baseUrl}&referrer=${referrer}` : `${baseUrl}?referrer=${referrer}`;
      };

      const fallbackPlayStore = ref
        ? `https://play.google.com/store/apps/details?id=com.alltimemarket.app&referrer=${encodeURIComponent(`utm_source=${ref}&utm_medium=qr_referral`)}`
        : 'https://play.google.com/store/apps/details?id=com.alltimemarket.app';

      try {
        // Log QR scan and get Play Store URL from settings
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/customer/refer-link?ref=${ref || ''}`);
        const basePlayStoreUrl = (res.data?.success && res.data?.data?.playStoreUrl)
          ? res.data.data.playStoreUrl
          : 'https://play.google.com/store/apps/details?id=com.alltimemarket.app';

        const playStoreUrl = ref ? buildPlayStoreUrl(basePlayStoreUrl, ref) : basePlayStoreUrl;

        // Go directly to Play Store with referrer code embedded
        // Google Play will pass the referrer to the app on first install (Deferred Deep Link)
        window.location.href = playStoreUrl;

      } catch (err) {
        // On API error, still redirect to Play Store with referrer
        window.location.href = fallbackPlayStore;
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
