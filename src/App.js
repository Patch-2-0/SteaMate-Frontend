import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ChatMate from "./pages/ChatMate";
import PickMate from "./pages/PickMate";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyPage from "./pages/MyPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/chatmate" element={<Layout><ChatMate /></Layout>} />
        <Route path="/pickmate" element={<Layout><PickMate /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/signup" element={<Layout><Signup /></Layout>} />
        <Route path="/mypage" element={<Layout><MyPage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
