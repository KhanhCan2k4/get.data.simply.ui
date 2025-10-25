import { DB } from "@/hooks/apis/use-dbs";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartProps } from "../chart-card/chart-card.types";

export function TypeCountChart({ data }: ChartProps) {
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
}
