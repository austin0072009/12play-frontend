import { useMemo, useState, useEffect } from 'react';
import { useAppStore } from '../store/app';
import { fetchGamesByBrand } from '../services/games';
import LazyImg from './LazyImg';
import styles from './GameBrandList.module.css';

interface GameBrandListProps {
  gameType?: string; // 'slot', 'fish', etc.
}

export default function GameBrandList({ gameType = '' }: GameBrandListProps) {
  const app = useAppStore();
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [brandGames, setBrandGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Extract unique game providers (plat_type) from app.data.games, filtered by gameType
  const serviceProviders = useMemo(() => {
    const games: any[] = app?.data?.games || [];
    const providers = new Map<string, string>();
    
    games.forEach((game) => {
      // Filter by gameType if provided
      const currentGameType = (game.gameType || '').toLowerCase();
      if (gameType && currentGameType !== gameType.toLowerCase()) {
        return; // Skip games that don't match the current gameType
      }
      
      const platType = game.plat_type;
      if (platType && !providers.has(platType)) {
        providers.set(platType, platType);
      }
    });

    return Array.from(providers.entries()).map(([id, name]) => ({
      id,
      name,
    }));
  }, [app?.data?.games, gameType]);

  // Set default selected brand when gameType changes
  useEffect(() => {
    // Reset selected brand when gameType changes
    if (serviceProviders.length > 0) {
      setSelectedBrand(serviceProviders[0].id);
      setBrandGames([]);
    } else {
      setSelectedBrand('');
      setBrandGames([]);
    }
  }, [gameType, serviceProviders]);

  // Fetch games when brand changes
  useEffect(() => {
    if (!selectedBrand) return;

    const loadGames = async () => {
      setLoading(true);
      setError('');
      setBrandGames([]);
      try {
        const games = await fetchGamesByBrand({
          productCode: selectedBrand,
          cateflag: gameType || '',
        });
        setBrandGames(games || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load games');
        console.error('Error fetching games:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, [selectedBrand, gameType]);

  // Filter and search games, and construct proper image URLs
  const filteredGames = useMemo(() => {
    const domain = app?.data?.domain || '';
    let games = [...brandGames];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      games = games.filter((g) =>
        (g.gameName || '').toLowerCase().includes(query) ||
        (g.game_name || '').toLowerCase().includes(query)
      );
    }

    // Construct proper image URLs with domain
    return games.map((g) => {
      const raw = g.m_img || g.img || '';
      const img = raw ? (raw.startsWith('http') ? raw : (domain ? domain + raw : raw)) : '';
      return {
        ...g,
        _img: img,
      };
    });
  }, [brandGames, searchQuery, app?.data?.domain]);

  return (
    <div className={styles.container}>
      {/* Filter Bar */}
      <div className={styles.filterSection}>
        <div className={styles.filterDropdowns}>
          <div className={styles.filterDropdown}>
            <label className={styles.filterLabel}>服务提供商</label>
            <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
              {serviceProviders.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>
          {/* <div className={styles.filterDropdown}>
            <label className={styles.filterLabel}>类别</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="all">All</option>
              <option value="slot">Slot</option>
              <option value="fish">Fish</option>
            </select>
          </div> */}
        </div>

        {/* Search Bar */}
        <div className={styles.filterSearch}>
          <input
            type="text"
            placeholder="搜索"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>
      </div>

      {/* Games Grid */}
      <div className={styles.gamesContainer}>
        {loading && <div className={styles.loading}>Loading games...</div>}
        {error && <div className={styles.error}>{error}</div>}
        {!loading && filteredGames.length > 0 && (
          <div className={styles.gamesList}>
            {filteredGames.map((game) => (
              <div key={game.id} className={styles.gameItem}>
                <LazyImg
                  src={game._img || ''}
                  alt={game.gameName || game.game_name || 'Game'}
                  className={styles.gameIcon}
                />
                <div className={styles.gameLabel}>
                  <span>{game.gameName || game.game_name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && filteredGames.length === 0 && !error && (
          <div className={styles.empty}>No games available</div>
        )}
      </div>
    </div>
  );
}
