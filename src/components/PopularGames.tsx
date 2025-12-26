import { useRef } from 'react';
import GameCard from './GameCard';
import styles from './PopularGames.module.css';

export default function PopularGames({
    title = 'Popular Games',
    games = [],
    onGameClick,
}: {
    title?: string;
    games?: any[];
    onGameClick?: (g: any) => void;
}) {
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

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        width="24px"
                        height="24px"
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
                    <span>{title}</span>
                </div>
                <div className={styles.headerRight}>
                    <button className={styles.arrowButton} onClick={scrollLeft} aria-label="Scroll left">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className={styles.arrowIcon}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 19.5 8.25 12l7.5-7.5"
                            />
                        </svg>
                    </button>
                    <button className={styles.arrowButton} onClick={scrollRight} aria-label="Scroll right">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className={styles.arrowIcon}
                            strokeWidth="1.5"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m8.25 4.5 7.5 7.5-7.5 7.5"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <div className={styles.gameRow} ref={scrollContainerRef}>
                {games.map((g, i) => (
                    <GameCard key={g.id || i} game={g} onClick={() => onGameClick && onGameClick(g)} />
                ))}
            </div>
        </div>
    );
}
