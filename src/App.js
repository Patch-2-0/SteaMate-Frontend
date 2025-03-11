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
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
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
