import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import CategoryPage from "../pages/CategoryPage";
import Wallet from "../pages/Wallet";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MainLayout from "../layout/MainLayout";
import Promotions from "../pages/Promotions";
import Profile from "../pages/Profile";
import BankAdd from "../pages/BankAdd";
import GameFrame from "../pages/GameFrame";
import ChangePassword from "../pages/ChangePassword";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* No layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bank/add" element={<BankAdd />} />
        <Route path="/game" element={<GameFrame />} />

        {/* Layout routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/promotion" element={<Promotions />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
