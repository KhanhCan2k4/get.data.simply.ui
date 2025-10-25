type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  statusColor?: string;
};

export function StatCard({
  title,
  value,
  icon,
  statusColor = "text-gray-900",
}: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center space-x-4">
      <div className="bg-gray-100 p-3 rounded-full">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className={`text-2xl font-bold ${statusColor}`}>{value}</p>
      </div>
    </div>
  );
}
