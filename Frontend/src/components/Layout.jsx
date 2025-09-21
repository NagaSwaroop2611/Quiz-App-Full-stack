import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="max-h-screen flex flex-col">
      <Navbar/>
      <Hero />
      <Outlet/>
    </div>
  );
};

export default Layout;
