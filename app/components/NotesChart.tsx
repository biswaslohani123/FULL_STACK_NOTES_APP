"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartData {
  date: string;
  count: number;
}

interface Props {
  data: ChartData[];
}

export default function NotesChart({ data }: Props) {
  return (
    <div className="mb-8 rounded-lg border bg-white p-5">
      <h2 className="mb-4 text-xl font-semibold">
        Notes Created Per Day
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          <YAxis allowDecimals={false} />

          <Tooltip />

          <Bar dataKey="count" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}