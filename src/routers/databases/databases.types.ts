export interface DashboardStats {
  totalDatabases: number;
  totalSizeMB: number;
  serverStatus: "Online" | "Offline";
  activeConnections: number;
}
