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



  // Transform recommended games (tj_games) with images
  const recommendedGames = useMemo(() => {
    const domain: string = app?.data?.domain || '';
    const tjGames: any[] = app?.data?.tj_games || [];
    return tjGames.map((g) => {
      const raw = g.m_img || g.img || '';
      const img = raw ? (raw.startsWith('http') ? raw : (domain ? domain + raw : raw)) : '';
      return {
        ...g,
        id: g.id,
        title: g.gameName || g.game_name || 'Game',
        img,
        game_name: g.gameName || g.game_name || 'Game',
        plat_type: g.plat_type,
        game_code: g.game_code,
      };
    });
  }, [app?.data]);

  // Transform popular games (hot_games) with images
  const popularGames = useMemo(() => {
    const domain: string = app?.data?.domain || '';
    const hotGames: any[] = app?.data?.hot_games || [];
    return hotGames.map((g) => {
      const raw = g.m_img || g.img || '';
      const img = raw ? (raw.startsWith('http') ? raw : (domain ? domain + raw : raw)) : '';
      return {
        ...g,
        id: g.id,
        title: g.gameName || g.game_name || 'Game',
        img,
        game_name: g.gameName || g.game_name || 'Game',
        plat_type: g.plat_type,
        game_code: g.game_code,
      };
    });
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
      const url = await startGame({
        id: g.id,
        plat_type: g.plat_type,
        game_code: g.game_code,
        game_type: 0,
        devices: 0
      });
      if (url) window.location.assign(url);
    } catch (err) {
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
