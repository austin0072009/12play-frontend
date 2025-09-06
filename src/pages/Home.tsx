import Banners from "../components/Banners";
import GameCard from "../components/GameCard";
import GameCardRow from "../components/GameCardRow";
import GameCategories from "../components/GameCategories";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <Banners />
      <GameCategories />
      <GameCardRow />
      <GameCardRow />
      <GameCardRow />
    </div>
  );
}
