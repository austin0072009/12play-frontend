import Router from './router';
import './i18n';
import GlobalAlert from './components/GlobalAlert';

export default function App() {
  // Note: Referral capture happens in main.tsx before React renders
  return (
    <>
      <Router />
      <GlobalAlert />
    </>
  );
}
