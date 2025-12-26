import { type ComponentType, type SVGProps } from 'react';
import styles from './GameCategories.module.css';

interface Category {
  title: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  url: string;
}

interface GameCategoriesProps {
  categories: Category[];
  activeCat: string;
  onCategoryClick: (url: string) => void;
}

export default function GameCategories({
  categories,
  activeCat,
  onCategoryClick,
}: GameCategoriesProps) {
  return (
    <div className={styles.gameCategories}>
      {categories.map((cat) => {
        const isActive = activeCat === cat.url;
        const Icon = cat.Icon;

        return (
          <div
            key={cat.url}
            className={`${styles.gameCategoryItem} ${isActive ? styles.active : ''}`}
            onClick={() => onCategoryClick(cat.url)}
          >
            {/* 关键：用 SVG 组件，不再用 img */}
            <Icon className={`${styles.gameCategoryItemIcon} ${isActive ? styles.active : ''}`} />
            <span>{cat.title}</span>
          </div>
        );
      })}
    </div>
  );
}
