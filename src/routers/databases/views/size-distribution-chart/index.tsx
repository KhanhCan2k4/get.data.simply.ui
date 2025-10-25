import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartProps } from "../chart-card/chart-card.types";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export function SizeDistributionChart({ data }: ChartProps) {
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
            {chartData.map((_, index) => (
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
}
