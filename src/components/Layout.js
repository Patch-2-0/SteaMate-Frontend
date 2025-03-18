import React from "react";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen navy">
      <Header />
        <div
          className="flex flex-col w-full min-h-screen bg-gradient-to-b from-[#1b1b3a] to-[#0a0a23]"
          style={{ paddingTop: "56px" }} // 헤더 높이만큼 여백 추가
          >
          {children}
        </div>
    </div>
  );
};

export default Layout;
