import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import ChatMate from "./pages/ChatMate";
import PickMate from "./pages/PickMate";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <Router>
      <Header />
      {/* 헤더 높이(4rem = 64px)를 제외한 화면 영역 설정 */}
      <div className="flex flex-col items-center justify-center bg-white" style={{ height: "calc(100vh - 4rem)", marginTop: "4rem" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chatmate" element={<ChatMate />} />
          <Route path="/pickmate" element={<PickMate />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
