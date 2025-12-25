import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Banners from "../components/Banners";
// import GameCard from "../components/GameCard";
import GameCardRow from "../components/GameCardRow";
import GameCategories from "../components/GameCategories";
import styles from "./Home.module.css";

import { fetchInitMeta, fetchInitData } from "../services/api";
import { useAppStore } from "../store/app";
import { useUserStore } from "../store/user";
import { normalizeInitData } from "../utils/transform";
import { startGame } from "../services/games";

export default function Home() {
  const navigate = useNavigate();
  const setMeta = useAppStore((s) => s.setMeta);
  const setData = useAppStore((s) => s.setData);
  const { data } = useAppStore();
  const token = useUserStore((s) => s.token);
  // const logout = useUserStore((s) => s.logout);

  const [loading, setLoading] = useState(false);
  // const [balance, setBalance] = useState("");

  useEffect(function () {
    setLoading(true);
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
      .finally(function () { setLoading(false); });
  }, [setMeta, setData]);

  // useEffect(() => {
  //   if (token) {
  //     fetchBalance().then((res) => {
  //       if (res.status?.errorCode === 0) setBalance(res.data);
  //     });
  //   }
  // }, [token]);

  const allGames = useMemo(() => data?.games || [], [data?.games]);

  // Categorize games
  const hotGames = useMemo(() => allGames.filter(g => g.gameType === 'hot' || g.is_rec || g.level === 2), [allGames]);
  const slots = useMemo(() => allGames.filter(g => g.gameType === 'slot' || g.rel_game_type === 'slot'), [allGames]);
  const live = useMemo(() => allGames.filter(g => g.gameType === 'live' || g.rel_game_type === 'live'), [allGames]);

  const handleEnterGame = async (g: any) => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (g.maintain) {
      alert("Game is under maintenance");
      return;
    }

    // specific logic for folders vs games
    if (g.level == 2) {
      // Is a lobby/folder, navigate to list
      // navigate(/games?brand=...);
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
      <GameCategories />

      {/* Dynamic Game Rows */}
      {hotGames.length > 0 && (
        <GameCardRow title="Hot Games" games={hotGames} onGameClick={handleEnterGame} />
      )}

      {slots.length > 0 && (
        <GameCardRow title="Slots" games={slots} onGameClick={handleEnterGame} />
      )}

      {live.length > 0 && (
        <GameCardRow title="Live Casino" games={live} onGameClick={handleEnterGame} />
      )}

      {/* Fallback if no data yet */}
      {allGames.length === 0 && !loading && (
        <>
          <GameCardRow title="Hot Games" games={[]} />
          <GameCardRow title="Slots" games={[]} />
          <GameCardRow title="Live Casino" games={[]} />
        </>
      )}
    </div>
  );
}
