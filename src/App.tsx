import Router from './router';
import './i18n';
import GlobalAlert from './components/GlobalAlert';

export default function App() {
  return (
    <>
      <Router />
      <GlobalAlert />
    </>
  );
}
