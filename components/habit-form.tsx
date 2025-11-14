"use client";

import { useState } from "react";
import type { Habit, Frequency } from "@/lib/types";
import { createId, generatePalette } from "@/lib/utils";

interface HabitFormProps {
  onCreate: (habit: Habit) => void;
  nextIndex: number;
}

export function HabitForm({ onCreate, nextIndex }: HabitFormProps) {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [tags, setTags] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      return;
    }

    const newHabit: Habit = {
      id: createId(),
      name: name.trim(),
      goal: goal.trim() || "Show up",
      frequency: frequency as Frequency,
      color: generatePalette(nextIndex),
      createdAt: new Date().toISOString(),
      completions: {},
      streak: 0,
      bestStreak: 0,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    };

    onCreate(newHabit);
    setName("");
    setGoal("");
    setTags("");
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card flex flex-col gap-4 p-6">
      <div>
        <h2 className="text-xl font-semibold">Create a new habit</h2>
        <p className="text-sm text-white/60">
          Keep it specific and achievable. Consistency beats intensity.
        </p>
      </div>

      <label className="flex flex-col gap-2 text-sm font-medium text-white/80">
        Habit name
        <input
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-base text-white outline-none transition focus:border-brand-400 focus:bg-white/10"
          placeholder="Drink 8 cups of water"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-white/80">
        Daily goal
        <input
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-base text-white outline-none transition focus:border-brand-400 focus:bg-white/10"
          placeholder="8 cups"
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-white/80">
        Frequency
        <select
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-base text-white outline-none transition focus:border-brand-400 focus:bg-white/10"
          value={frequency}
          onChange={(event) => setFrequency(event.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="custom">Custom cadence</option>
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-white/80">
        Tags
        <input
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-base text-white outline-none transition focus:border-brand-400 focus:bg-white/10"
          placeholder="health, energy"
          value={tags}
          onChange={(event) => setTags(event.target.value)}
        />
        <span className="text-xs text-white/50">Comma separated, optional.</span>
      </label>

      <div className="mt-2 flex gap-3">
        <button type="submit" className="button-primary">
          Add habit
        </button>
      </div>
    </form>
  );
}
