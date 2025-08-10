import React, { useState } from "react";
import Header from "../component/Header";
import Sidebar from "../component/sidebar";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const Layout = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  if (!isAuthenticated) {
    return (
      <section className="min-h-screen bg-gray-50">
        <Outlet />
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      <main className="p-4 sm:ml-64">
        <Outlet />
      </main>
    </section>
  );
};

export default Layout;