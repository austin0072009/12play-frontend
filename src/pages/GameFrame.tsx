import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './GameFrame.module.css';
import BackIcon from '../assets/icons/back.svg?react';
import HotIcon from '../assets/icons/hot.svg?react';
import RefreshIcon from '../assets/icons/refresh.svg?react';
import DepositIcon from '../assets/icons/deposit.svg?react';
import ChatIcon from '../assets/icons/chat.svg?react';
import FullscreenIcon from '../assets/icons/fullscreen.svg?react';

export default function GameFrame() {
  const navigate = useNavigate();
  const location = useLocation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(true); // Default to fullscreen mode

  // Enable fullscreen on mount
  useEffect(() => {
    console.log("=== GAME FRAME LOADED - FULLSCREEN MODE ENABLED ===");
  }, []);

  // Get game URL from location state
  const gameUrl = (location.state as any)?.gameUrl || '';

  if (!gameUrl) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Game URL not found</div>
      </div>
    );
  }

  const handleBack = () => {
    navigate(-1);
  };

  const handleHot = () => {
    navigate('/');
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = gameUrl;
    }
  };

  const handleDeposit = () => {
    navigate('/wallet');
  };

  const handleChat = () => {
    // Open live chat - could be a modal, new window, or external chat service
    window.open('https://example.com/chat', 'livechat', 'width=400,height=600');
  };

  const handleFullscreen = async () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div ref={containerRef} className={`${styles.container} ${isFullscreen ? styles.fullscreenMode : ''}`}>
      <iframe
        ref={iframeRef}
        src={gameUrl}
        className={styles.iframe}
        title="Game"
      />

      {/* Bottom Navigation Bar - Always on top */}
      <div className={styles.bottomNav}>
        <button className={styles.navButton} onClick={handleBack} title="Back">
          <BackIcon className={styles.icon} />
          <span className={styles.label}>Back</span>
        </button>

        <button className={styles.navButton} onClick={handleHot} title="Hot">
          <HotIcon className={styles.icon} />
          <span className={styles.label}>Hot</span>
        </button>

        <button className={styles.navButton} onClick={handleRefresh} title="Refresh">
          <RefreshIcon className={styles.icon} />
          <span className={styles.label}>Refresh</span>
        </button>

        <button className={styles.navButton} onClick={handleDeposit} title="Deposit">
          <DepositIcon className={styles.icon} />
          <span className={styles.label}>Deposit</span>
        </button>

        <button className={styles.navButton} onClick={handleChat} title="Live Chat">
          <ChatIcon className={styles.icon} />
          <span className={styles.label}>Live Chat</span>
        </button>

        <button className={styles.navButton} onClick={handleFullscreen} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
          <FullscreenIcon className={styles.icon} />
          <span className={styles.label}>{isFullscreen ? "Exit" : "Fullscreen"}</span>
        </button>
      </div>
    </div>
  );
}
