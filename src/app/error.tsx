"use client";
import { useEffect } from "react";
import { Flame, RefreshCw } from "lucide-react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-8">
      <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center mb-6">
        <Flame className="w-8 h-8 text-red-600" />
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h1>
      <p className="text-muted-foreground mb-8 max-w-sm text-sm">{error.message || "An unexpected error occurred."}</p>
      <button onClick={reset}
        className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition">
        <RefreshCw size={16} /> Try Again
      </button>
    </div>
  );
}
