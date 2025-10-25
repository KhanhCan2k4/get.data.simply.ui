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

// --- TYPE DEFINITIONS ---
interface DashboardStats {
  totalDatabases: number;
  totalSizeMB: number;
  serverStatus: "Online" | "Offline";
  activeConnections: number;
}

interface DatabaseInfo {
  id: string;
  name: string;
  type: "mysql" | "postgres";
  sizeMB: number;
  tableCount: number;
  createdAt: string; // ISO Date String
}

// --- MOCK DATA (Replace with API call in a real app) ---
const mockDashboardData = {
  systemStats: {
    totalDatabases: 5,
    totalSizeMB: 7830,
    serverStatus: "Online",
    activeConnections: 27,
  } as DashboardStats,
  databases: [
    {
      id: "db1",
      name: "production_main_db",
      type: "postgres",
      sizeMB: 4500,
      tableCount: 152,
      createdAt: "2023-01-15T10:00:00Z",
    },
    {
      id: "db2",
      name: "staging_analytics",
      type: "postgres",
      sizeMB: 1250,
      tableCount: 45,
      createdAt: "2024-03-20T14:30:00Z",
    },
    {
      id: "db3",
      name: "legacy_wordpress",
      type: "mysql",
      sizeMB: 880,
      tableCount: 33,
      createdAt: "2020-11-01T08:00:00Z",
    },
    {
      id: "db4",
      name: "user_service_db",
      type: "mysql",
      sizeMB: 1100,
      tableCount: 12,
      createdAt: "2024-08-01T11:00:00Z",
    },
    {
      id: "db5",
      name: "dev_playground",
      type: "postgres",
      sizeMB: 100,
      tableCount: 8,
      createdAt: "2025-10-14T12:00:00Z",
    },
  ] as DatabaseInfo[],
};

// --- HELPER ICONS ---
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
const MySQLIcon = () => (
  <svg
    className="w-8 h-8 text-blue-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 6.25278C12 6.25278 10.137 5.92578 8.6875 7.37528C7.2375 8.82528 6.9105 10.6875 6.9105 10.6875M12 6.25278V17.7472M12 6.25278C12 6.25278 13.863 5.92578 15.3125 7.37528C16.7625 8.82528 17.0895 10.6875 17.0895 10.6875M12 17.7472C12 17.7472 10.137 18.0742 8.6875 16.6247C7.2375 15.1747 6.9105 13.3125 6.9105 13.3125M12 17.7472C12 17.7472 13.863 18.0742 15.3125 16.6247C16.7625 15.1747 17.0895 13.3125 17.0895 13.3125M6.9105 10.6875C6.9105 10.6875 5 10.6875 5 12C5 13.3125 6.9105 13.3125 6.9105 13.3125M17.0895 10.6875C17.0895 10.6875 19 10.6875 19 12C19 13.3125 17.0895 13.3125 17.0895 13.3125"
    ></path>
  </svg>
);
const PostgresIcon = () => (
  <svg
    className="w-8 h-8 text-blue-800"
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6.572 20.959h3.818V3.041H6.572v17.918zm6.552 0h4.295c3.818 0 6.573-2.58 6.573-6.282 0-2.016-.84-3.79-2.28-4.992 1.14-1.202 1.763-2.887 1.763-4.743 0-3.356-2.525-5.9-5.9-5.9h-4.45v17.918zm3.818-14.735h.336c1.62 0 2.58.896 2.58 2.392 0 1.524-.96 2.42-2.58 2.42h-.336V6.224zm0 8.046h.42c1.8 0 2.94 1.008 2.94 2.696 0 1.712-1.14 2.78-2.94 2.78h-.42v-5.476zM.001 3.041h3.818v17.918H.001V3.041z"></path>
  </svg>
);

// --- CHART COMPONENTS ---
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
const SizeDistributionChart = ({ data }: { data: DatabaseInfo[] }) => {
  const chartData = data.map((db) => ({ name: db.name, value: db.sizeMB }));
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value} MB`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const TypeCountChart = ({ data }: { data: DatabaseInfo[] }) => {
  const typeCounts = data.reduce((acc, db) => {
    acc[db.type] = (acc[db.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(typeCounts).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    count,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={80}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip cursor={{ fill: "#f3f4f6" }} />
          <Bar dataKey="count" fill="#8884d8" barSize={30}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.name === "Postgres" ? "#0088FE" : "#00C49F"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- MAIN DASHBOARD PAGE ---
export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { systemStats, databases } = mockDashboardData;
  const navigate = useNavigate();

  const filteredDatabases = useMemo(() => {
    if (!searchTerm) return databases;
    return databases.filter((db) =>
      db.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [databases, searchTerm]);

  const formatSize = (sizeMB: number) => {
    if (sizeMB > 1024) {
      return `${(sizeMB / 1024).toFixed(2)} GB`;
    }
    return `${sizeMB} MB`;
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex gap-3 items-center text-xl font-bold bg-white py-4 px-8 rounded-full shadow-sm">
            <img
              src={__logo}
              alt="Logo"
              className="w-10 h-10"
              onClick={() => navigate(ROUTERS.DATABASES.path)}
            />
            GET DATA SIMPLY
          </div>
          <button
            onClick={() => navigate(ROUTERS.DATABASE_CREATE.path)}
            className="mt-4 md:mt-0 px-6 py-2 bg-blue-400 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 transition-colors"
          >
            + Create New Database
          </button>
        </div>

        {/* System Stats Cards */}
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

        {/* Main Content: Databases & Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Database List */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-700">
                All Databases
              </h2>
              <input
                type="text"
                placeholder="Search databases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDatabases.map((db) => (
                <DatabaseCard key={db.id} db={db} formatSize={formatSize} />
              ))}
            </div>
          </div>
          {/* Right Column: Charts */}
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

// --- SUB-COMPONENTS ---
const StatCard = ({
  title,
  value,
  icon,
  statusColor = "text-gray-900",
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  statusColor?: string;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center space-x-4">
    <div className="bg-gray-100 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className={`text-2xl font-bold ${statusColor}`}>{value}</p>
    </div>
  </div>
);

const DatabaseCard = ({
  db,
  formatSize,
}: {
  db: DatabaseInfo;
  formatSize: (size: number) => string;
}) => (
  <div className="bg-white rounded-xl shadow-sm border hover:shadow-lg hover:border-blue-500 transition-all duration-200 flex flex-col">
    <div className="p-4 border-b flex justify-between items-start">
      <div>
        <div className="flex items-center space-x-2">
          {db.type === "postgres" ? <PostgresIcon /> : <MySQLIcon />}
          <h3 className="text-lg font-bold text-gray-800 truncate">
            {db.name}
          </h3>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Created on: {new Date(db.createdAt).toLocaleDateString()}
        </p>
      </div>
      {/* More actions menu can go here */}
    </div>
    <div className="p-4 space-y-2 text-sm grow">
      <div className="flex justify-between">
        <span className="text-gray-600">Size:</span>{" "}
        <span className="font-semibold">{formatSize(db.sizeMB)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Tables:</span>{" "}
        <span className="font-semibold">{db.tableCount}</span>
      </div>
    </div>
    <div className="p-4 bg-gray-50 rounded-b-xl">
      <button className="w-full px-4 py-2 bg-white border border-gray-300 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
        Manage Database
      </button>
    </div>
  </div>
);

const ChartCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border">
    <h3 className="text-xl font-semibold text-gray-700 mb-4">{title}</h3>
    {children}
  </div>
);
