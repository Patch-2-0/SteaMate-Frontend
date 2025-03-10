import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";

const Home = () => <div className="text-center text-xl p-8">홈 화면</div>;
const ChatMate = () => <div className="text-center text-xl p-8">ChatMate 화면</div>;
const PickMate = () => <div className="text-center text-xl p-8">PickMate 화면</div>;
const Login = () => <div className="text-center text-xl p-8">로그인 화면</div>;
const Signup = () => <div className="text-center text-xl p-8">회원가입 화면</div>;

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chatmate" element={<ChatMate />} />
        <Route path="/pickmate" element={<PickMate />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
