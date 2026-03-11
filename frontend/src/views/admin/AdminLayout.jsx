import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const AdminLayout = () => {
  const location = useLocation();

  const tabs = [
    { name: "Pelaajat", path: "/admin/ranking", icon: "fa-users" },
    { name: "Tulokset", path: "/admin/results", icon: "fa-trophy" },
    { name: "Turnaukset", path: "/admin/opens", icon: "fa-calendar" },
    { name: "Sisältö", path: "/admin/about", icon: "fa-file-text" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-extrabold text-prussian_blue">
          Ylläpitopaneeli
        </h1>
      </div>

      <div className="bg-white rounded-lg border border-alabaster_grey-400 shadow-sm overflow-hidden">
        <nav className="flex flex-wrap border-b border-alabaster_grey-300 bg-alabaster_grey-800">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`px-6 py-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 ${
                  isActive
                    ? "border-orange text-prussian_blue bg-white"
                    : "border-transparent text-black-700 hover:text-prussian_blue hover:bg-alabaster_grey-500"
                }`}
              >
                <i className={`fa ${tab.icon}`}></i>
                {tab.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
