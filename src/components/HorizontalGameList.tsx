import { useRef } from 'react';
import LazyImg from './LazyImg';
import styles from './HorizontalGameList.module.css';

interface Game {
  id?: number;
  m_img?: string;
  img?: string;
  gameName?: string;
  game_name?: string;
  plat_type?: string;
  game_code?: string;
  [key: string]: any;
}

interface HorizontalGameListProps {
  title: string;
  icon?: 'hot' | 'recommend';
  games: Game[];
  onGameClick?: (game: Game) => void;
  domain?: string;
}

export default function HorizontalGameList({
  title,
  icon = 'hot',
  games,
  onGameClick,
  domain = '',
}: HorizontalGameListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!games || games.length === 0) return null;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Construct proper image URL
  const getImageUrl = (game: Game): string => {
    const raw = game.m_img || game.img || '';
    return raw ? (raw.startsWith('http') ? raw : (domain ? domain + raw : raw)) : '';
  };

  const getGameName = (game: Game): string => {
    return game.gameName || game.game_name || 'Game';
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {icon === 'hot' ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              width="24px"
              height="24px"
              className={styles.icon}
            >
              <g clipPath="url(#Hot_svg__a)">
                <path
                  fill="currentColor"
                  d="M3.463 17.116c-.246 3.904 3.987 5.262 6.192 5.866-1.727-1.075-2.217-3.092-1.058-4.576.928-1.187.848-2.47.692-2.963.476-.149 1.352.783 1.268 2.12 1.955-1.122 2.239-3.491 2.136-4.536 2.921 1.365-.326 5.187 1.286 6.308-.324-1.094.263-2.399 1.187-2.824-.326.731-.472 1.259.135 2.317.606 1.058 1.525 1.6-.25 3.957 7.135-1.967 5.35-5.676 4.234-9.343s-.94-3.763-.063-6.124c-.614-.038-3.255.923-3.467 4.292-3.376-3.38-4.25-6.441-2.307-10.56-2.88.302-4.71 4.427-4.408 6.755.298 2.293 1.278 4.643-.607 6.081.53-2.167.59-3.13-1.835-5.59.978 4.946-2.912 5.277-3.135 8.82"
                ></path>
              </g>
              <defs>
                <clipPath id="Hot_svg__a">
                  <path fill="#fff" d="M0 0h24v24H0z"></path>
                </clipPath>
              </defs>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              width="24px"
              height="24px"
              className={styles.icon}
            >
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"
              />
            </svg>
          )}
          <span className={styles.title}>{title}</span>
        </div>

        {/* Scroll Buttons */}
        <div className={styles.headerRight}>
          <button className={styles.arrowButton} onClick={scrollLeft} aria-label="Scroll left">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className={styles.arrowIcon}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button className={styles.arrowButton} onClick={scrollRight} aria-label="Scroll right">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className={styles.arrowIcon}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Games Scroll Container */}
      <div className={styles.scrollContainer} ref={scrollContainerRef}>
        {games.map((game, idx) => (
          <div
            key={game.id || idx}
            className={styles.gameItem}
            onClick={() => onGameClick && onGameClick(game)}
          >
            <LazyImg
              src={getImageUrl(game)}
              alt={getGameName(game)}
              className={styles.gameImage}
            />
            <div className={styles.gameLabel}>
              <span>{getGameName(game)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
