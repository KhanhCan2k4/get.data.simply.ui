type StatsItemProps = {
  objKey: string;
  value: string | number;
};

export function StatsItem({ objKey, value }: StatsItemProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div className="text-sm text-gray-500 capitalize">
        {objKey.replace("Count", " Count")}
      </div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
