import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import CategoryPage from "../pages/CategoryPage";
import Wallet from "../pages/Wallet";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ClearReferral from "../pages/ClearReferral";
import MainLayout from "../layout/MainLayout";
import Promotions from "../pages/Promotions";
import PromotionDetail from "../pages/PromotionDetail";
import Profile from "../pages/Profile";
import BankAdd from "../pages/BankAdd";
import GameFrame from "../pages/GameFrame";
import ChangePassword from "../pages/ChangePassword";
import ContactSection from "../components/ContactSection";
import Feedback from "../pages/Feedback";
import Download from "../pages/Download";
import DepositConfirm from "../pages/DepositConfirm";
// import Referral from "../pages/Referral";

// 2D Lottery Pages
import Lottery2DHome from "../pages/Lottery2DHome";
import Lottery2DBet from "../pages/Lottery2DBet";
import Lottery2DBetConfirm from "../pages/Lottery2DBetConfirm";
import Lottery2DBetHistory from "../pages/Lottery2DBetHistory";
import Lottery2DClosedDays from "../pages/Lottery2DClosedDays";
import Lottery2DRank from "../pages/Lottery2DRank";

// 3D Lottery Pages
import Lottery3DHome from "../pages/Lottery3DHome";
import Lottery3DBet from "../pages/Lottery3DBet";
import Lottery3DBetConfirm from "../pages/Lottery3DBetConfirm";
import Lottery3DBetHistory from "../pages/Lottery3DBetHistory";
import Lottery3DClosedDays from "../pages/Lottery3DClosedDays";
import Lottery3DRank from "../pages/Lottery3DRank";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* No layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cleanyqm" element={<ClearReferral />} />
        <Route path="/bank/add" element={<BankAdd />} />
        <Route path="/deposit/confirm" element={<DepositConfirm />} />
        <Route path="/game" element={<GameFrame />} />

        {/* Layout routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/promotion" element={<Promotions />} />
          <Route path="/promotion/:id" element={<PromotionDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/contact" element={<ContactSection />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/download" element={<Download />} />
          {/* <Route path="/referral" element={<Referral />} /> */}

          {/* 2D Lottery Routes */}
          <Route path="/2d" element={<Lottery2DHome />} />
          <Route path="/2d/bet" element={<Lottery2DBet />} />
          <Route path="/2d/bet-confirm" element={<Lottery2DBetConfirm />} />
          <Route path="/2d/history" element={<Lottery2DBetHistory />} />
          <Route path="/2d/closed-days" element={<Lottery2DClosedDays />} />
          <Route path="/2d/rank" element={<Lottery2DRank />} />

          {/* 3D Lottery Routes */}
          <Route path="/3d" element={<Lottery3DHome />} />
          <Route path="/3d/bet" element={<Lottery3DBet />} />
          <Route path="/3d/bet-confirm" element={<Lottery3DBetConfirm />} />
          <Route path="/3d/history" element={<Lottery3DBetHistory />} />
          <Route path="/3d/closed-days" element={<Lottery3DClosedDays />} />
          <Route path="/3d/rank" element={<Lottery3DRank />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
