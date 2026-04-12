import { getGroupStats } from "../hooks/useFlashcards";

function ProgressBar({ stats, total }) {
  const masteredPct = Math.round((stats.mastered / total) * 100);
  const familiarPct = Math.round((stats.familiar / total) * 100);
  const learningPct = Math.round((stats.learning / total) * 100);

  return (
    <div className="w-full h-2 bg-cream-200 rounded-full overflow-hidden flex mt-3">
      <div
        className="h-full bg-sage-500 transition-all duration-500"
        style={{ width: `${masteredPct}%` }}
      />
      <div
        className="h-full bg-blue-400 transition-all duration-500"
        style={{ width: `${familiarPct}%` }}
      />
      <div
        className="h-full bg-amber-400 transition-all duration-500"
        style={{ width: `${learningPct}%` }}
      />
    </div>
  );
}

export function DeckCard({ group, stats, onClick }) {
  const total = group.words.length;
  const masteredPct = Math.round((stats.mastered / total) * 100);

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-cream-50 border-2 border-ink-900 rounded-2xl p-5
                 shadow-card hover:shadow-card-hover hover:translate-x-0.5 hover:translate-y-0.5
                 transition-all duration-150 active:scale-[0.98] group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{group.emoji}</span>
          <div>
            <h3 className="font-display font-semibold text-ink-900 text-lg leading-tight">
              {group.name}
            </h3>
            <p className="text-sm text-ink-700/60 mt-0.5">
              {total} words
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-2xl font-display font-bold text-sage-500">
            {masteredPct}%
          </span>
          <p className="text-xs text-ink-700/50 leading-none">mastered</p>
        </div>
      </div>

      <ProgressBar stats={stats} total={total} />

      <div className="flex gap-3 mt-2.5 text-xs text-ink-700/60">
        <span>🟡 {stats.learning} learning</span>
        <span>🔵 {stats.familiar} familiar</span>
        <span>🟢 {stats.mastered} mastered</span>
      </div>

      {stats.dueNow > 0 && (
        <div className="mt-3 inline-flex items-center gap-1.5 bg-amber-100 border border-amber-300
                        text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
          {stats.dueNow} due for review
        </div>
      )}
    </button>
  );
}
