"use client";

import { useMemo } from "react";
import type { Habit } from "@/lib/types";

interface FilterBarProps {
  habits: Habit[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  search: string;
  onSearch: (value: string) => void;
}

export function FilterBar({ habits, selectedTag, onSelectTag, search, onSearch }: FilterBarProps) {
  const tags = useMemo(() => {
    const unique = new Set<string>();
    habits.forEach((habit) => habit.tags.forEach((tag) => unique.add(tag)));
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [habits]);

  return (
    <div className="glass-card flex flex-col gap-4 p-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-white/80">Search habits</span>
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search by name or goal"
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none transition focus:border-brand-400 focus:bg-white/10"
        />
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-white/50">Filter by tag</span>
          <button
            onClick={() => onSelectTag(null)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              selectedTag === null ? "bg-brand-500 text-white" : "bg-white/5 text-white/60"
            }`}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onSelectTag(tag)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                selectedTag === tag ? "bg-brand-400 text-black" : "bg-white/5 text-white/60"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
