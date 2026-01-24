import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Banners from "../components/Banners";
import GameCategories from "../components/GameCategories";
import HorizontalGameList from "../components/HorizontalGameList";
import FeatureCards from "../components/FeatureCards";
import Footer from "../components/Footer";
import InitNoticeLayer from "../components/InitNoticeLayer";
import styles from "./Home.module.css";

import { fetchInitMeta, fetchInitData } from "../services/api";
import { useAppStore } from "../store/app";
import { useUserStore } from "../store/user";
import { normalizeInitData } from "../utils/transform";
import { startGame, startLotteryGame, fetchRecentGames } from "../services/games";
import { showAlert } from "../store/alert";

import SlotIcon from '../assets/icons/slot.svg?react';
import FishIcon from '../assets/icons/fish.svg?react';
import LiveIcon from '../assets/icons/live.svg?react';
import SportIcon from '../assets/icons/sport.svg?react';
import LotteryIcon from '../assets/icons/lottery.svg?react';



export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setMeta = useAppStore((s) => s.setMeta);
  const setData = useAppStore((s) => s.setData);
  const app = useAppStore();
  const { data } = useAppStore();
  const token = useUserStore((s) => s.token);

  const [activeCat, setActiveCat] = useState('');
  const [recentGames, setRecentGames] = useState<any[]>([]);

  // Set SEO metadata for home page

  // URL to category type mapping (kept for future use)
  // const url2Cate: Record<string, string> = {
  //   '/slots': 'slot',
  //   '/fish': 'fish',
  //   '/live': 'live',
  //   '/sports': 'sports',
  //   '/lottery': 'lottery',
  //   '/cock': 'cock',
  // };

  const categories = useMemo(() => ([
    {
      title: t('home.slots') || 'Slots',
      Icon: SlotIcon,
      url: '/slots',
    },
    {
      title: t('home.fish') || 'Fish',
      Icon: FishIcon,
      url: '/fish',
    },
    {
      title: t('home.casino') || 'Casino',
      Icon: LiveIcon,
      url: '/live',
    },
    {
      title: t('home.sports') || 'Sports',
      Icon: SportIcon,
      url: '/sports',
    },
    {
      title: t('home.lottery2') || 'Lottery',
      Icon: LotteryIcon,
      url: '/lottery',
    },
  ]), [t]);



  // Use recommended games (tj_games) - already transformed by normalizeInitData
  const recommendedGames = useMemo(() => {
    const tjGames: any[] = app?.data?.tj_games || [];
    return tjGames
      .filter((g) => g && g.m_img) // Only filter by image
      .map((g) => ({
        ...g,
        title: g.game_name || 'Game',
        img: g.m_img, // Use m_img which already includes domain prefix from transform.ts
      }));
  }, [app?.data]);

  // Use popular games (hot_games) - already transformed by normalizeInitData
  const popularGames = useMemo(() => {
    const hotGames: any[] = app?.data?.hot_games || [];
    return hotGames
      .filter((g) => g && g.m_img) // Only filter by image
      .map((g) => ({
        ...g,
        title: g.game_name || 'Game',
        img: g.m_img, // Use m_img which already includes domain prefix from transform.ts
      }));
  }, [app?.data]);

  // Use special games (special_games) - already transformed by normalizeInitData
  const specialGames = useMemo(() => {
    const specGames: any[] = app?.data?.special_games || [];
    return specGames
      .filter((g) => g && g.m_img) // Only filter by image
      .map((g) => ({
        ...g,
        title: g.game_name || 'Game',
        img: g.m_img, // Use m_img which already includes domain prefix from transform.ts
      }));
  }, [app?.data]);

  useEffect(function () {
    fetchInitMeta()
      .then(function (res) {
        var theme = res && res.data ? String(res.data) : '';
        var logo = res && res.logo ? String(res.logo) : '';
        var url = res && res.url ? String(res.url) : '';
        setMeta({ theme: theme, logo: logo, url: url });
        return fetchInitData();
      })
      .then(function (raw) {
        var norm = normalizeInitData(raw || {});
        setData(norm as any);
      })
      .catch(function (e) {
        console.error('Init error:', e);
      })
      .finally(function () { });
  }, [setMeta, setData]);

  // Fetch recently played games when user is logged in
  useEffect(function () {
    if (!token) {
      setRecentGames([]);
      return;
    }

    fetchRecentGames()
      .then(function (games) {
        // Transform to match the format used by HorizontalGameList
        // Get domain from store at transform time to avoid dependency issues
        const domain = useAppStore.getState().data?.domain || '';
        const transformed = games.map(function (g) {
          return {
            ...g,
            id: g.id,
            game_name: g.gameName,
            title: g.gameName,
            plat_type: g.productCode,
            game_code: g.tcgGameCode,
            is_outopen: g.is_outopen,
            img: g.m_img ? (g.m_img.startsWith('http') ? g.m_img : domain + g.m_img) : '',
            m_img: g.m_img ? (g.m_img.startsWith('http') ? g.m_img : domain + g.m_img) : '',
          };
        });
        setRecentGames(transformed);
      })
      .catch(function (e) {
        console.error('Failed to fetch recent games:', e);
        setRecentGames([]);
      });
  }, [token]);

  const handleEnterGame = async (g: any) => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (g.maintain) {
      showAlert(t('home.gameMaintenance'));
      return;
    }

    try {
      const gameId = g.id || g.game_id;
      const platType = g.plat_type || g.productCode;
      const gameCode = g.game_code || g.code;

      if (!gameId || !platType) {
        throw new Error('Missing required game parameters: id or plat_type');
      }

      // Check if this is a lottery game (L2D or L3D)
      const isLotteryGame = platType && (
        platType.toUpperCase() === 'L2D' || 
        platType.toUpperCase() === 'L3D'
      );

      if (isLotteryGame) {
        // Handle lottery games
        await startLotteryGame({
          id: gameId,
          plat_type: platType,
          game_code: gameCode,
          game_type: 0,
          devices: 0,
          tgp: '',
        });
        
        // Navigate to lottery pages
        if (platType.toUpperCase() === 'L2D') {
          navigate('/2d');
        } else {
          navigate('/3d');
        }
      } else {
        // Handle regular games
        const url = await startGame({
          id: gameId,
          plat_type: platType,
          game_code: gameCode,
          game_type: 0,
          devices: 0,
          tgp: '',
        });
        if (url) {
          //console.log('Game URL:', url);
          // Check is_outopen field: 1 = direct assignment, 2 = iframe
          if (g.is_outopen === 1) {
            window.location.assign(url);
          } else {
            // Default to iframe for is_outopen === 2 or undefined
            navigate('/game', { state: { gameUrl: url } });
          }
        }
      }
    } catch (err) {
      console.error('Game launch error:', err);
      showAlert(String(err));
    }
  };

  return (
    <div className={styles.container}>
      <InitNoticeLayer notices={data?.notices || []} />
      
      <Banners banners={data?.banners} />

      <GameCategories
        categories={categories}
        activeCat={activeCat}
        onCategoryClick={(url) => {
          setActiveCat(url);
          navigate(`/category${url}`);
        }}
      />

      {/* Recently Played Games Section - Only shows when logged in and has data */}
      {recentGames.length > 0 && (
        <HorizontalGameList
          title={t('home.recentlyPlayedGames')}
          icon="recent"
          games={recentGames}
          onGameClick={handleEnterGame}
          domain={data?.domain || ''}
        />
      )}

      {/* Special Games Section */}
      {specialGames.length > 0 && (
        <HorizontalGameList
          title={t('home.specialGames')}
          icon="special"
          games={specialGames}
          onGameClick={handleEnterGame}
          domain={data?.domain || ''}
        />
      )}

      {/* Recommended Games Section */}
      {recommendedGames.length > 0 && (
        <HorizontalGameList
          title={t('home.recommendedGames')}
          icon="recommend"
          games={recommendedGames}
          onGameClick={handleEnterGame}
          domain={data?.domain || ''}
        />
      )}

      {/* Popular Games Section */}
      {popularGames.length > 0 && (
        <HorizontalGameList
          title={t('home.popularGames')}
          icon="hot"
          games={popularGames}
          onGameClick={handleEnterGame}
          domain={data?.domain || ''}
        />
      )}


      {/* Feature Cards Section */}
      <FeatureCards />

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
