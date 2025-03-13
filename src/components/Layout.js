import React from "react";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* flex-grow로 컨텐츠 영역 확장, height 제거 */}
      <div className="flex flex-col flex-grow items-center bg-white w-full pt-16">
        {children}
      </div>
    </div>
  );
};

export default Layout;
