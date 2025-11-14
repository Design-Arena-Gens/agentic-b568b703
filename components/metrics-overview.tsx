"use client";

import { BarChart3, Flame, Sparkles, Trophy } from "lucide-react";
import type { HabitCheckInStats } from "@/lib/types";

interface MetricsOverviewProps {
  stats: HabitCheckInStats;
}

const cards = [
  {
    key: "completedToday" as const,
    label: "Habits completed today",
    Icon: Sparkles,
    suffix: "",
    accent: "from-brand-400/50 to-brand-500/10"
  },
  {
    key: "weeklyProgress" as const,
    label: "Weekly completion",
    Icon: BarChart3,
    suffix: "%",
    accent: "from-emerald-400/40 to-emerald-500/5"
  },
  {
    key: "longestStreak" as const,
    label: "Longest active streak",
    Icon: Trophy,
    suffix: " days",
    accent: "from-amber-400/40 to-amber-500/5"
  },
  {
    key: "activeHabits" as const,
    label: "Active habits",
    Icon: Flame,
    suffix: "",
    accent: "from-pink-400/40 to-pink-500/5"
  }
];

export function MetricsOverview({ stats }: MetricsOverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ key, label, Icon, suffix, accent }) => (
        <div key={key} className={`glass-card relative overflow-hidden p-6`}> 
          <div className={`absolute inset-0 bg-gradient-to-br ${accent}`} />
          <div className="relative z-10 flex flex-col gap-4">
            <Icon className="h-5 w-5 text-white/60" />
            <div>
              <p className="text-xs uppercase tracking-wide text-white/50">{label}</p>
              <p className="text-3xl font-semibold text-white">
                {stats[key]}
                {suffix}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
