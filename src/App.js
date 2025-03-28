import React, { useRef, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ChatMate from "./pages/ChatMate";
import PickMate from "./pages/PickMate";
import Login from "./pages/Login";
import SteamCallback from "./pages/SteamCallback";
import Signup from "./pages/Signup";
import SteamSignup from "./pages/SteamSignup";
import MyPage from "./pages/MyPage";
import NotFound from "./pages/404";
import ErrorPage from "./pages/ErrorPage";
import VerifyEmail from "./pages/VerifyEmail";

// 인증이 필요한 페이지를 위한 컴포넌트
const AuthRoute = ({ children, path }) => {
  const isAuthenticated = localStorage.getItem('access_token') !== null;
  const alertShown = useRef(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  if (!isAuthenticated && !alertShown.current) {
    alertShown.current = true;
    setTimeout(() => {
      alert("로그인이 필요한 서비스입니다.");
      setShouldRedirect(true);
    }, 100);
    return null;
  }
  
  if (shouldRedirect) {
    return <Navigate to="/login" replace state={{ from: path }} />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace state={{ from: path }} />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/chatmate" element={
          <AuthRoute path="/chatmate">
            <Layout><ChatMate /></Layout>
          </AuthRoute>
        } />
        <Route path="/pickmate" element={
          <AuthRoute path="/pickmate">
            <Layout><PickMate /></Layout>
          </AuthRoute>
        } />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/signup" element={<Layout><Signup /></Layout>} />
        <Route path="/steamsignup" element={<Layout><SteamSignup /></Layout>} />
        <Route path="/mypage" element={
          <AuthRoute path="/mypage">
            <Layout><MyPage /></Layout>
          </AuthRoute>
        } />
        <Route path="/steam-callback" element={<SteamCallback />} /> {/* Steam Callback 처리 */}
        <Route path="*" element={<Layout><NotFound /></Layout>} /> {/* 404 처리 */}
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/verify-email/:uidb64/:token" element={<VerifyEmail />} />
      </Routes>
    </Router>
  );
}

export default App;
