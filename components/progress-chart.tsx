"use client";

import { format } from "date-fns";

interface WeeklyProgressPoint {
  weekStart: Date;
  percentage: number;
}

interface ProgressChartProps {
  data: WeeklyProgressPoint[];
}

export function ProgressChart({ data }: ProgressChartProps) {
  if (!data.length) {
    return null;
  }

  return (
    <div className="glass-card flex flex-col gap-4 p-6">
      <div>
        <h2 className="text-xl font-semibold">Consistency trend</h2>
        <p className="text-sm text-white/60">Last 6 weeks of your completion rate.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.map(({ weekStart, percentage }) => (
          <div key={weekStart.toISOString()} className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>Week of {format(weekStart, "MMM d")}</span>
              <span>{Math.round(percentage)}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-brand-500 transition-all"
                style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
