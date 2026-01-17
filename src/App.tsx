import { useEffect } from 'react';
import Router from './router';
import './i18n';
import GlobalAlert from './components/GlobalAlert';
import { captureReferralFromUrl } from './utils/referral';

export default function App() {
  // Capture referral code from URL on first visit
  useEffect(() => {
    captureReferralFromUrl();
  }, []);

  return (
    <>
      <Router />
      <GlobalAlert />
    </>
  );
}
