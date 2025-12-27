
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GameCategories from '../components/GameCategories';
import GameBrandList from '../components/GameBrandList';
import GameCard from '../components/GameCard';
import styles from './CategoryPage.module.css';
import { useAppStore } from '../store/app';
import { useUserStore } from '../store/user';
import { startGame } from '../services/games';
import SlotIcon from '../assets/icons/slot.svg?react';
import FishIcon from '../assets/icons/fish.svg?react';
import LiveIcon from '../assets/icons/live.svg?react';
import SportIcon from '../assets/icons/sport.svg?react';
import LotteryIcon from '../assets/icons/lottery.svg?react';

export default function CategoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const app = useAppStore();
  const token = useUserStore((s) => s.token);

  const categories = useMemo(() => ([
    { title: t('home.slots') || 'Slots', Icon: SlotIcon, url: '/slots' },
    { title: t('home.fish') || 'Fish', Icon: FishIcon, url: '/fish' },
    { title: t('home.casino') || 'Casino', Icon: LiveIcon, url: '/live' },
    { title: t('home.sports') || 'Sports', Icon: SportIcon, url: '/sports' },
    { title: t('home.lottery2') || 'Lottery', Icon: LotteryIcon, url: '/lottery' },
  ]), [t]);

  const activeCat = slug ? `/${slug}` : '';

  const url2Cate: Record<string, string> = {
    '/slots': 'slot',
    '/fish': 'fish',
    '/live': 'live',
    '/sports': 'sports',
    '/lottery': 'lottery',
    '/cock': 'cock',
  };

  const gamebrands = useMemo(() => {
    const domain: string = app?.data?.domain || '';
    const games: any[] = app?.data?.games || [];
    return games.map((g) => {
      const raw = g.m_img || g.img || '';
      const img = raw ? (raw.startsWith('http') ? raw : (domain ? domain + raw : raw)) : '';
      return {
        ...g,
        id: g.id,
        title: g.gameName || g.plat_type || 'Game',
        img,
        url: 'none',
        gameType: (g.gameType || '').toLowerCase(),
        productCode: g.plat_type,
      };
    });
  }, [app?.data]);

  const filteredByCategory = useMemo(() => {
    const cate = (url2Cate[activeCat] || '').toLowerCase();
    if (!cate) return gamebrands.filter(g => g.is_show);
    return gamebrands.filter(g => g.gameType === cate && g.is_show);
  }, [activeCat, gamebrands]);

  const gamesToShow = useMemo(() => {
    return filteredByCategory;
  }, [filteredByCategory]);

  const handleEnterGame = async (g: any) => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // If this is a game brand (is_cate = 1), find the bound game
      let gameToStart = g;
      if (g.is_cate === 1 || g.level === 1) {
        // This is a game brand, find the actual game it binds to
        const allGames: any[] = app?.data?.games || [];
        const boundGame = allGames.find((game) => game.plat_type === g.plat_type && game.is_cate !== 1);
        if (boundGame) {
          gameToStart = boundGame;
        }
      }

      const url = await startGame({ 
        id: gameToStart.id, 
        plat_type: gameToStart.plat_type, 
        game_code: gameToStart.game_code, 
        game_type: 0, 
        devices: 0 
      });
      if (url) {
        // Check is_outopen field of the actual game being started: 1 = direct assignment, 2 = iframe
        if (gameToStart.is_outopen === 1) {
          window.location.assign(url);
        } else {
          // Default to iframe for is_outopen === 2 or undefined
          navigate('/game', { state: { gameUrl: url } });
        }
      }
    } catch (err) {
      alert(err);
    }
  };

  // Show filter bar only for slots and fish
  const showFilter = activeCat === '/slots' || activeCat === '/fish';

  return (
    <div className={styles.container}>
      <GameCategories
        categories={categories as any}
        activeCat={activeCat}
        onCategoryClick={(u: string) => navigate(`/category${u}`)}
      />

      {/* Show GameBrandList for slots and fish ONLY */}
      {showFilter && (
        <GameBrandList key={activeCat} gameType={url2Cate[activeCat] || ''} />
      )}

      {/* Show regular game grid for other categories ONLY */}
      {!showFilter && (
        <div className={styles.grid}>
          {gamesToShow.map((g: any, i: number) => (
            <GameCard key={i} game={g} onClick={() => handleEnterGame(g)} />
          ))}
        </div>
      )}

      {!showFilter && gamesToShow.length === 0 && (
        <div className={styles.empty}>No games found</div>
      )}
    </div>
  );
}
