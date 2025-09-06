// src/layout/MainLayout.tsx
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import styles from "./MainLayout.module.css";
import { useState } from "react";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <div className={styles.appWrapper}>
      <Header />
      <div className={styles.contentArea}>
        <Sidebar />
        <main className={styles.main}>{children}</main>
      </div>

      <BottomNav />
    </div>
  );
}
