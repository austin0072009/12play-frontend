
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GameCategories from '../components/GameCategories';
import GameCard from '../components/GameCard';
import styles from './CategoryPage.module.css';
import { useAppStore } from '../store/app';
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

  const [filter, setFilter] = useState<'all' | 'new' | 'popular'>('all');

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

  const popularGames = useMemo(() => {
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

  const gamesToShow = useMemo(() => {
    if (filter === 'all') return filteredByCategory;
    if (filter === 'popular') {
      const cate = (url2Cate[activeCat] || '').toLowerCase();
      if (!cate) return popularGames;
      return popularGames.filter((g: any) => (g.plat_type || '').toLowerCase() === cate || (g.game_type || '').toLowerCase() === cate);
    }
    return filteredByCategory.slice().sort((a, b) => (b.id || 0) - (a.id || 0));
  }, [filter, filteredByCategory, popularGames, activeCat]);

  const handleEnterGame = async (g: any) => {
    try {
      const url = await startGame({ id: g.id, plat_type: g.plat_type, game_code: g.game_code, game_type: 0, devices: 0 });
      if (url) window.location.assign(url);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className={styles.container}>
      <GameCategories
        categories={categories as any}
        activeCat={activeCat}
        onCategoryClick={(u: string) => navigate(`/category${u}`)}
      />

      <div className={styles.filterBar}>
        <div className={styles.filterLeft}>{categories.find(c => c.url === activeCat)?.title || t('home.all') || 'All'}</div>
        <div className={styles.filterRight}>
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="all">All</option>
            <option value="popular">Popular</option>
            <option value="new">Newest</option>
          </select>
        </div>
      </div>

      <div className={styles.grid}>
        {gamesToShow.map((g: any, i: number) => (
          <GameCard key={i} game={g} onClick={() => handleEnterGame(g)} />
        ))}
      </div>

      {gamesToShow.length === 0 && (
        <div className={styles.empty}>No games found</div>
      )}
    </div>
  );
}
