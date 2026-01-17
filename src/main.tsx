import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/variables.css";
import "./styles/smooth-scroll.css";

import "./index.css";
import App from "./App.tsx";
import { captureReferralFromUrl } from "./utils/referral";

// Capture referral code BEFORE React renders (before any redirects)
captureReferralFromUrl();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
