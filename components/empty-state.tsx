"use client";

import { PartyPopper } from "lucide-react";

interface EmptyStateProps {
  onCreateDemo: () => void;
}

export function EmptyState({ onCreateDemo }: EmptyStateProps) {
  return (
    <div className="glass-card flex flex-col items-center gap-6 p-10 text-center">
      <PartyPopper className="h-10 w-10 text-brand-400" />
      <div>
        <h2 className="text-2xl font-semibold">Start your first streak</h2>
        <p className="mt-2 text-sm text-white/60">
          Build momentum by drafting your first habit. Not sure where to start? Load
          curated examples to see the tracker in action.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <button className="button-primary" onClick={onCreateDemo}>
          Load demo habits
        </button>
      </div>
    </div>
  );
}
