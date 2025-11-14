"use client";

import { useEffect, useMemo, useState } from "react";
import { differenceInCalendarDays, endOfWeek, isWithinInterval, startOfWeek, subWeeks } from "date-fns";
import { Habit } from "@/lib/types";
import { HabitForm } from "@/components/habit-form";
import { HabitCard } from "@/components/habit-card";
import { MetricsOverview } from "@/components/metrics-overview";
import { EmptyState } from "@/components/empty-state";
import { FilterBar } from "@/components/filter-bar";
import { ProgressChart } from "@/components/progress-chart";
import { loadHabits, saveHabits } from "@/lib/storage";
import { buildDemoHabits } from "@/lib/sample-data";
import { recomputeStreak, todayKey, toggleCompletion } from "@/lib/utils";

export default function HomePage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const stored = loadHabits();
    if (stored.length) {
      setHabits(stored.map(recomputeStreak));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveHabits(habits);
    }
  }, [habits, hydrated]);

  const filteredHabits = useMemo(() => {
    const query = search.trim().toLowerCase();
    return habits.filter((habit) => {
      const matchesSearch = query
        ? habit.name.toLowerCase().includes(query) || habit.goal.toLowerCase().includes(query)
        : true;
      const matchesTag = selectedTag ? habit.tags.includes(selectedTag) : true;
      return matchesSearch && matchesTag;
    });
  }, [habits, search, selectedTag]);

  const stats = useMemo(() => {
    const today = todayKey();
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const todayDate = new Date();
    const daysInRange = differenceInCalendarDays(todayDate, weekStart) + 1;
    let completedToday = 0;
    let weeklyCompleted = 0;
    let longestStreak = 0;

    habits.forEach((habit) => {
      if (habit.completions[today]) {
        completedToday += 1;
      }
      longestStreak = Math.max(longestStreak, habit.bestStreak, habit.streak);
      Object.keys(habit.completions).forEach((key) => {
        const date = new Date(key);
        if (
          isWithinInterval(date, {
            start: weekStart,
            end: todayDate
          })
        ) {
          weeklyCompleted += 1;
        }
      });
    });

    const potential = habits.length * Math.max(daysInRange, 1);
    const weeklyProgress = potential ? Math.round((weeklyCompleted / potential) * 100) : 0;

    return {
      completedToday,
      weeklyProgress,
      longestStreak,
      activeHabits: habits.length
    };
  }, [habits]);

  const weeklyTrend = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 6 }).map((_, index) => {
      const weekStart = startOfWeek(subWeeks(today, index), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      let completed = 0;
      habits.forEach((habit) => {
        Object.keys(habit.completions).forEach((key) => {
          const date = new Date(key);
          if (isWithinInterval(date, { start: weekStart, end: weekEnd })) {
            completed += 1;
          }
        });
      });
      const totalSlots = habits.length * 7;
      const percentage = totalSlots ? (completed / totalSlots) * 100 : 0;
      return {
        weekStart,
        percentage
      };
    }).reverse();
  }, [habits]);

  const handleCreate = (habit: Habit) => {
    setHabits((prev) => [...prev, recomputeStreak(habit)]);
  };

  const handleToggle = (habitId: string, date: Date) => {
    setHabits((prev) =>
      prev.map((habit) => (habit.id === habitId ? toggleCompletion(habit, date) : habit))
    );
  };

  const handleDelete = (habitId: string) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== habitId));
  };

  const handleLoadDemo = () => {
    setHabits(buildDemoHabits().map(recomputeStreak));
  };

  if (!hydrated) {
    return null;
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="glass-card relative overflow-hidden p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/30 via-transparent to-brand-500/10" />
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.4em] text-white/40">Habit Horizon</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">
              Design your lifestyle with an intelligent habit tracker
            </h1>
            <p className="mt-3 text-sm text-white/60">
              Build unstoppable routines, visualize streaks, and celebrate progress. Track check-ins across
              the week and unlock your longest streak yet.
            </p>
          </div>
          <div className="glass-card flex flex-col gap-3 rounded-2xl bg-white/10 p-4 text-sm text-white/70 md:w-72">
            <div className="flex items-center justify-between">
              <span>Active habits</span>
              <span className="text-xl font-semibold text-white">{habits.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Streak champion</span>
              <span className="text-xl font-semibold text-white">{stats.longestStreak} days</span>
            </div>
            <p className="text-xs text-white/50">
              Tip: click on any day card to toggle completion. Streaks update instantly.
            </p>
          </div>
        </div>
      </header>

      <MetricsOverview stats={stats} />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="flex flex-col gap-6">
          <FilterBar
            habits={habits}
            selectedTag={selectedTag}
            onSelectTag={setSelectedTag}
            search={search}
            onSearch={setSearch}
          />

          {filteredHabits.length === 0 ? (
            <EmptyState onCreateDemo={handleLoadDemo} />
          ) : (
            <div className="flex flex-col gap-4">
              {filteredHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <HabitForm onCreate={handleCreate} nextIndex={habits.length} />
          <ProgressChart data={weeklyTrend} />
        </div>
      </div>
    </main>
  );
}
