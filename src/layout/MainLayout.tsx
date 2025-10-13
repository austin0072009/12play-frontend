import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import styles from "./MainLayout.module.css";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className={styles.appWrapper}>
      <Header />
      <div className={styles.contentArea}>
        <Sidebar />
        <main className={styles.main}>
          <Outlet /> {/* nested routes render here */}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
