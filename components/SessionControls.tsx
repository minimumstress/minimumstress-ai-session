"use client";

import { Mic, Pause, Square } from "lucide-react";

type Props = {
  isStarted: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onEnd: () => void;
};

export default function SessionControls({
  isStarted,
  isPaused,
  onStart,
  onPause,
  onEnd,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button
        onClick={onStart}
        className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-4 font-semibold text-[#07111f] transition hover:scale-[1.02]"
      >
        <Mic className="h-4 w-4" />
        {!isStarted ? "Start Session" : "Resume"}
      </button>

      <button
        onClick={onPause}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-4 font-semibold text-white"
      >
        <Pause className="h-4 w-4" />
        {isPaused ? "Paused" : "Pause"}
      </button>

      <button
        onClick={onEnd}
        className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-400/10 px-6 py-4 font-semibold text-red-200"
      >
        <Square className="h-4 w-4" />
        End
      </button>
    </div>
  );
}