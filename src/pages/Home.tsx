import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Banners from "../components/Banners";
import GameCategories from "../components/GameCategories";
import HorizontalGameList from "../components/HorizontalGameList";
import FeatureCards from "../components/FeatureCards";
import Footer from "../components/Footer";
import styles from "./Home.module.css";

import { fetchInitMeta, fetchInitData } from "../services/api";
import { useAppStore } from "../store/app";
import { useUserStore } from "../store/user";
import { normalizeInitData } from "../utils/transform";
import { startGame } from "../services/games";

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

  const handleEnterGame = async (g: any) => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (g.maintain) {
      alert("Game is under maintenance");
      return;
    }

    try {
      const gameId = g.id || g.game_id;
      const platType = g.plat_type || g.productCode;
      const gameCode = g.game_code || g.code;

      if (!gameId || !platType) {
        throw new Error('Missing required game parameters: id or plat_type');
      }

      const url = await startGame({
        id: gameId,
        plat_type: platType,
        game_code: gameCode,
        game_type: 0,
        devices: 0,
        tgp: '',
      });
      if (url) {
        // Check is_outopen field: 1 = direct assignment, 2 = iframe
        if (g.is_outopen === 1) {
          window.location.assign(url);
        } else {
          // Default to iframe for is_outopen === 2 or undefined
          navigate('/game', { state: { gameUrl: url } });
        }
      }
    } catch (err) {
      console.error('Game launch error:', err);
      alert(err);
    }
  };

  return (
    <div className={styles.container}>
      <Banners banners={data?.banners} />

      <GameCategories
        categories={categories}
        activeCat={activeCat}
        onCategoryClick={(url) => {
          setActiveCat(url);
          navigate(`/category${url}`);
        }}
      />

      {/* Special Games Section */}
      {specialGames.length > 0 && (
        <HorizontalGameList
          title="权威认证"
          icon="special"
          games={specialGames}
          onGameClick={handleEnterGame}
          domain={data?.domain || ''}
        />
      )}

      {/* Recommended Games Section */}
      {recommendedGames.length > 0 && (
        <HorizontalGameList
          title="推荐游戏"
          icon="recommend"
          games={recommendedGames}
          onGameClick={handleEnterGame}
          domain={data?.domain || ''}
        />
      )}

      {/* Popular Games Section */}
      {popularGames.length > 0 && (
        <HorizontalGameList
          title="热门游戏"
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
