type ChartCardProps = {
  title: string;
  children: React.ReactNode;
};

export function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
      {children}
    </div>
  );
}
