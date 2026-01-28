import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/app';
import { useUserStore } from '../store/user';
import { fetchGamesByBrand, startGame } from '../services/games';
import LazyImg from './LazyImg';
import styles from './GameBrandList.module.css';
import { showAlert } from '../store/alert';

interface GameBrandListProps {
  gameType?: string; // 'slot', 'fish', etc.
}

export default function GameBrandList({ gameType = '' }: GameBrandListProps) {
  const navigate = useNavigate();
  const app = useAppStore();
  const token = useUserStore((s) => s.token);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [brandGames, setBrandGames] = useState<any[]>([]);
  const [allProvidersGames, setAllProvidersGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const allGamesLoadedRef = useRef(false);

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
    // Reset all providers games cache when gameType changes
    setAllProvidersGames([]);
    allGamesLoadedRef.current = false;
  }, [gameType, serviceProviders]);

  // Function to fetch games from all providers
  const fetchAllProvidersGames = useCallback(async () => {
    if (allGamesLoadedRef.current && allProvidersGames.length > 0) {
      return allProvidersGames;
    }

    if (serviceProviders.length === 0) return [];

    setSearchLoading(true);
    try {
      const allGamesPromises = serviceProviders.map(async (provider) => {
        try {
          const games = await fetchGamesByBrand({
            productCode: provider.id,
            cateflag: gameType || '',
          });
          return games.map((g: any) => ({
            ...g,
            plat_type: g.plat_type || provider.id,
            _provider_name: provider.name,
          }));
        } catch (err) {
          console.error(`Error fetching games from ${provider.name}:`, err);
          return [];
        }
      });

      const results = await Promise.all(allGamesPromises);
      const combinedGames = results.flat();
      setAllProvidersGames(combinedGames);
      allGamesLoadedRef.current = true;
      return combinedGames;
    } catch (err) {
      console.error('Error fetching all providers games:', err);
      return [];
    } finally {
      setSearchLoading(false);
    }
  }, [serviceProviders, gameType, allProvidersGames]);

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

  // Handle search input with debounce - trigger fetching all games when user starts typing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length >= 2 && !allGamesLoadedRef.current) {
      searchTimeoutRef.current = setTimeout(() => {
        fetchAllProvidersGames();
      }, 300);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, fetchAllProvidersGames]);

  // Determine if we're in search mode (searching across all providers)
  const isSearchMode = searchQuery.trim().length >= 2;

  // Filter and search games, and construct proper image URLs
  const filteredGames = useMemo(() => {
    const domain = app?.data?.domain || '';
    
    // If searching, use all providers games; otherwise use current brand games
    let games = isSearchMode ? [...allProvidersGames] : [...brandGames];

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
        id: g.id || g.game_id,
        plat_type: g.plat_type || selectedBrand,
        game_code: g.game_code || g.code,
      };
    });
  }, [brandGames, allProvidersGames, searchQuery, app?.data?.domain, selectedBrand, isSearchMode]);

  const handleEnterGame = async (game: any) => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const gameId = game.id || game.game_id;
      const platType = game.plat_type || selectedBrand;
      const gameCode = game.game_code || game.code;
      
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
        if (game.is_outopen === 1) {
          window.location.assign(url);
        } else {
          // Default to iframe for is_outopen === 2 or undefined
          navigate('/game', { state: { gameUrl: url } });
        }
      }
    } catch (err) {
      console.error('Game launch error:', err);
      showAlert(String(err));
    }
  };

  return (
    <div className={styles.container}>
      {/* Filter Bar */}
      <div className={styles.filterSection}>
        <div className={styles.filterDropdowns}>
          <div className={styles.filterDropdown}>
            <label className={styles.filterLabel}>GAME PROVIDER</label>
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
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>
      </div>

      {/* Games Grid */}
      <div className={styles.gamesContainer}>
        {(loading || searchLoading) && <div className={styles.loading}>Loading games...</div>}
        {error && <div className={styles.error}>{error}</div>}
        {isSearchMode && !searchLoading && filteredGames.length > 0 && (
          <div className={styles.searchInfo}>
            Showing {filteredGames.length} results across all providers
          </div>
        )}
        {!loading && !searchLoading && filteredGames.length > 0 && (
          <div className={styles.gamesList}>
            {filteredGames.map((game) => (
              <div key={game.id} className={styles.gameItem} onClick={() => handleEnterGame(game)}>
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
        {!loading && !searchLoading && filteredGames.length === 0 && !error && (
          <div className={styles.empty}>No games available</div>
        )}
      </div>
    </div>
  );
}
