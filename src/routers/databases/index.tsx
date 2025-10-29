import { ROUTERS } from "@/constants/routes";
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import __logo from "@public/logo.png";
import { DashboardStats } from "./databases.types";
import { DatabaseCard } from "./views/dashboard-card";
import { DB, useDBs } from "@/hooks/apis/use-dbs";
import SearchInput from "@/components/search-input";
import { ChartCard } from "./views/chart-card";
import { StatCard } from "./views/stat-card";
import { TypeCountChart } from "./views/type-count-chart";
import { SizeDistributionChart } from "./views/size-distribution-chart";
import Avatar from "@/components/avatar";
import { formatSize } from "@/utils/format-size";

const mockDashboardData = {
  systemStats: {
    totalDatabases: 5,
    totalSizeMB: 7830,
    serverStatus: "Online",
    activeConnections: 27,
  } as DashboardStats,
  databases: [] as DB[],
};

const ServerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
    />
  </svg>
);
const DabaseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7a8 8 0 0116 0"
    />
  </svg>
);

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { systemStats } = mockDashboardData;
  const { getAllDBs } = useDBs();
  const navigate = useNavigate();

  const databases = getAllDBs.data || [];

  const filteredDatabases = useMemo(() => {
    if (!searchTerm) return databases;
    return databases.filter((db) =>
      db.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [databases, searchTerm]);

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex gap-3 items-center font-bold bg-white py-4 px-8 rounded-full shadow-sm">
            <img
              src={__logo}
              alt="Logo"
              className="w-10 h-10"
              onClick={() => navigate(ROUTERS.HOME.path)}
            />
            GET DATA SIMPLY
            <span className="w-1 h-10 rounded-full bg-gray-200 mx-2" />
            <div className="flex items-center justify-center gap-2 cursor-pointer">
              <Avatar name="Hello world" />
              <div className={`flex flex-col ${!open && "hidden"}`}>
                <span className="font-semibold">Hello World</span>
                <span className="font-light text-sm">
                  hello.world@example.com
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate(ROUTERS.DATABASE_CREATE.path)}
            className="mt-4 px-6 py-2 bg-blue-400 text-white rounded-full shadow-sm hover:bg-blue-500 transition-colors"
          >
            + Create New Database
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Server Status"
            value={systemStats.serverStatus}
            icon={<ServerIcon />}
            statusColor={
              systemStats.serverStatus === "Online"
                ? "text-green-500"
                : "text-red-500"
            }
          />
          <StatCard
            title="Total Databases"
            value={systemStats.totalDatabases}
            icon={<DabaseIcon />}
          />
          <StatCard
            title="Total Size"
            value={formatSize(systemStats.totalSizeMB)}
            icon={<DabaseIcon />}
          />
          <StatCard
            title="Active Connections"
            value={systemStats.activeConnections}
            icon={<ServerIcon />}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                All Databases
              </h2>

              <SearchInput onFinish={setSearchTerm} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDatabases.map((db) => (
                <DatabaseCard key={db.id} db={db} />
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <ChartCard title="Storage Distribution">
              <SizeDistributionChart data={databases} />
            </ChartCard>
            <ChartCard title="Database Types">
              <TypeCountChart data={databases} />
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
}
