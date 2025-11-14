"use client";

import { format, isToday, subDays } from "date-fns";
import { motion } from "framer-motion";
import { CalendarCheck2, Trash2 } from "lucide-react";
import type { Habit } from "@/lib/types";
import { getDateKey } from "@/lib/utils";

interface HabitCardProps {
  habit: Habit;
  onToggle: (habitId: string, date: Date) => void;
  onDelete: (habitId: string) => void;
}

const dayLabels = Array.from({ length: 7 }).map((_, index) => {
  const date = subDays(new Date(), 6 - index);
  return {
    label: format(date, "EEE"),
    date
  };
});

export function HabitCard({ habit, onToggle, onDelete }: HabitCardProps) {
  return (
    <motion.div
      layout
      className="glass-card flex flex-col gap-4 p-6"
      style={{ borderTop: `4px solid ${habit.color}` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: habit.color }}
            />
            <h3 className="text-lg font-semibold">{habit.name}</h3>
          </div>
          <p className="mt-2 text-sm text-white/60">{habit.goal}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/60">
            <span className="rounded-full border border-white/10 px-3 py-1">
              {habit.frequency.toUpperCase()}
            </span>
            {habit.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 px-3 py-1">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={() => onDelete(habit.id)}
          className="text-white/50 transition hover:text-white"
          aria-label={`Delete ${habit.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div>
        <div className="flex items-center gap-3 text-sm text-white/60">
          <CalendarCheck2 className="h-4 w-4" />
          <span>
            Current streak: <span className="text-white">{habit.streak} days</span>
          </span>
          <span className="hidden text-white/40 sm:block">|</span>
          <span className="hidden text-sm text-white/60 sm:block">
            Best streak: <span className="text-white">{habit.bestStreak} days</span>
          </span>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-2">
          {dayLabels.map(({ label, date }) => {
            const key = getDateKey(date);
            const isChecked = Boolean(habit.completions[key]);
            const highlight = isToday(date);
            return (
              <button
                key={label}
                onClick={() => onToggle(habit.id, date)}
                className={`flex flex-col items-center gap-1 rounded-xl border border-white/10 px-2 py-2 text-xs transition ${
                  isChecked
                    ? "bg-white/15 text-white"
                    : highlight
                      ? "border-dashed text-white/80"
                      : "text-white/50"
                }`}
                style={isChecked ? { backgroundColor: `${habit.color}25` } : undefined}
              >
                <span>{label}</span>
                <span className="text-sm font-semibold">
                  {format(date, "d")}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
