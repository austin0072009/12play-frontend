import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchLeaderboard } from '../../services/api';
import './leaderboard.css';

// Types
export interface LeaderboardEntry {
  id: string;
  date: string;
  time: string;
  game: string;
  playerName: string;
  payout: string;
}

interface LeaderboardProps {
  autoScrollInterval?: number; // ms between new entries
}

// SVG Icons - exact match from original
const WinnerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24px" height="24px" className="tabIcon">
    <g clipPath="url(#Winner_svg__a)">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 22h15M8 21h9"></path>
      <path stroke="currentColor" strokeWidth="2" d="M10 22v-7m5 7v-7"></path>
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 5H3v4c0 2 1.714 4 4 4m11-8h4v4c0 2-1.714 4-4 4"></path>
      <path fill="currentColor" d="M6 10.482V1.998A1 1 0 0 1 7 1h11c.552 0 1 .446 1 .999v8.482C19 14.038 17.05 17 12.5 17S6 13.444 6 10.482"></path>
    </g>
    <defs>
      <clipPath id="Winner_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

const HighRollerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24px" height="24px" className="tabIcon">
    <g clipPath="url(#HighRoller_svg__a)">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.842 13.966 22 11.62 18.842 21 12 4l-3.5 9m6.132 4.483L12 19.828 2 11.62 5 21l1.5-2"></path>
    </g>
    <defs>
      <clipPath id="HighRoller_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

// Component
export default function Leaderboard({
  autoScrollInterval = 2000,
}: LeaderboardProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'winners' | 'highrollers'>('winners');
  const [winnersData, setWinnersData] = useState<LeaderboardEntry[]>([]);
  const [highRollersData, setHighRollersData] = useState<LeaderboardEntry[]>([]);
  // Display item with unique key for rendering
  interface DisplayItem extends LeaderboardEntry {
    displayKey: string;
  }
  const [displayData, setDisplayData] = useState<DisplayItem[]>([]);
  const [enteringKey, setEnteringKey] = useState<string | null>(null);
  const displayKeyCounter = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const dataIndexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Format currency: amount + MMK
  const formatPayout = (amount: number): string => {
    return `${amount.toFixed(2)} MMK`;
  };

  // Fetch leaderboard data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await fetchLeaderboard();

        if (response && response.data) {
          console.log('Leaderboard API response:', response);
          // Transform winners data
          const transformedWinners: LeaderboardEntry[] = (response.data.winners || []).map((item: any, index: number) => {
            const [date, time] = (item.betTime || '').split(' ');
            return {
              id: `w-${index}-${Date.now()}`,
              date: date || '',
              time: time || '',
              game: item.gameName || item.productCode || '',
              playerName: item.username || '',
              payout: formatPayout(item.winAmount || 0),
            };
          });

          // Transform high rollers data
          const transformedHighRollers: LeaderboardEntry[] = (response.data.highRollers || []).map((item: any, index: number) => {
            const [date, time] = (item.betTime || '').split(' ');
            return {
              id: `hr-${index}-${Date.now()}`,
              date: date || '',
              time: time || '',
              game: item.gameName || item.productCode || '',
              playerName: item.username || '',
              payout: formatPayout(item.winAmount || 0),
            };
          });

          setWinnersData(transformedWinners);
          setHighRollersData(transformedHighRollers);

          // Initialize display with winners data
          if (transformedWinners.length > 0) {
            const initialDisplay = transformedWinners.slice(0, 12).map((entry) => ({
              ...entry,
              displayKey: `display-${displayKeyCounter.current++}`,
            }));
            setDisplayData(initialDisplay);
            dataIndexRef.current = Math.min(12, transformedWinners.length);
          }
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-scroll animation: insert new row at top
  useEffect(() => {
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const data = activeTab === 'winners' ? winnersData : highRollersData;
    if (!data || data.length === 0) return;

    // Only start auto-scroll if we have more than 12 items
    if (data.length <= 12) return;

    intervalRef.current = setInterval(() => {
      const currentData = activeTab === 'winners' ? winnersData : highRollersData;
      if (!currentData || currentData.length === 0) return;

      const newEntry = currentData[dataIndexRef.current % currentData.length];
      const newDisplayKey = `display-${displayKeyCounter.current++}`;

      setEnteringKey(newDisplayKey);

      setDisplayData(prev => {
        const newItem = { ...newEntry, displayKey: newDisplayKey };
        const newData = [newItem, ...prev.slice(0, 11)];
        return newData;
      });

      dataIndexRef.current = (dataIndexRef.current + 1) % currentData.length;

      // Clear entering animation after it completes
      setTimeout(() => {
        setEnteringKey(null);
      }, 400);
    }, autoScrollInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [activeTab, winnersData, highRollersData, autoScrollInterval]);

  // Handle tab change
  const handleTabChange = (tab: 'winners' | 'highrollers') => {
    if (tab === activeTab) return;

    // Clear interval before switching
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setActiveTab(tab);
    const data = tab === 'winners' ? winnersData : highRollersData;
    if (data && data.length > 0) {
      const newDisplay = data.slice(0, 12).map((entry) => ({
        ...entry,
        displayKey: `display-${displayKeyCounter.current++}`,
      }));
      setDisplayData(newDisplay);
      dataIndexRef.current = Math.min(12, data.length);
    } else {
      setDisplayData([]);
      dataIndexRef.current = 0;
    }
  };

  // Don't render if loading or no data
  if (isLoading) {
    return null;
  }

  if (winnersData.length === 0 && highRollersData.length === 0) {
    return null;
  }

  return (
    <div className="leaderboardContainer">
      <div>
        <div>
          {/* Tabs */}
          <div className="tabsContainer">
            <div
              className={`tab ${activeTab === 'winners' ? 'tabActive' : 'tabInactive'}`}
              onClick={() => handleTabChange('winners')}
            >
              <WinnerIcon />
              <span className="tabText">{t('leaderboard.latestWinners')}</span>
            </div>
            <div
              className={`tab ${activeTab === 'highrollers' ? 'tabActive' : 'tabInactive'}`}
              onClick={() => handleTabChange('highrollers')}
            >
              <HighRollerIcon />
              <span className="tabText">{t('leaderboard.highRollers')}</span>
            </div>
          </div>

          {/* Table */}
          <div className="tableContainer">
            <table className="table">
              <thead className="tableHead">
                <tr>
                  <td className="tableCell">{t('leaderboard.betDate')}</td>
                  <td className="tableCell">{t('leaderboard.game')}</td>
                  <td className="tableCell">{t('leaderboard.player')}</td>
                  <td className="tableCell">{t('leaderboard.payout')}</td>
                </tr>
              </thead>
              <tbody className="tableBody">
                {displayData.map((entry) => (
                  <tr
                    key={entry.displayKey}
                    className={`tableRow ${enteringKey === entry.displayKey ? 'tableRowEntering' : ''}`}
                  >
                    <td className="tableCell dateCellBody">
                      <div className="dateCellContent">
                        <span className="dateText">{entry.date}</span>
                        <span className="timeText">{entry.time}</span>
                      </div>
                    </td>
                    <td className="tableCell gameCell">{entry.game}</td>
                    <td className="tableCell playerCell">{entry.playerName}</td>
                    <td className="tableCell payoutCell">{entry.payout}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

