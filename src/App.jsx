import { useState } from "react";
import wordGroups from "./data/wordGroups";
import { useFlashcards } from "./hooks/useFlashcards";
import { DeckCard } from "./components/DeckCard";
import { StudySession } from "./components/StudySession";

// ─────────────────────────────────────────────────────────────
//  Home Screen — shows all decks + overall stats
// ─────────────────────────────────────────────────────────────
function HomeScreen({ wordGroups, getGroupStats, getDueWords, onStartStudy }) {
  const overall = wordGroups.reduce(
    (acc, group) => {
      const s = getGroupStats(group.id, group.words);
      acc.mastered += s.mastered;
      acc.total += group.words.length;
      return acc;
    },
    { mastered: 0, total: 0 }
  );

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-end gap-3 mb-1">
          <h1 className="font-display text-5xl font-bold text-ink-900 leading-none">
            Wortschatz
          </h1>
          <span className="text-3xl mb-1">🇩🇪</span>
        </div>
        <p className="text-ink-700/60 text-lg mt-2">
          German vocabulary, one deck at a time.
        </p>

        {/* Overall mastered counter */}
        <div className="mt-6 bg-ink-900 text-cream-50 rounded-2xl px-6 py-4 flex items-center justify-between border-2 border-ink-900 shadow-card">
          <div>
            <p className="text-cream-200/60 text-sm font-medium">Total Mastered</p>
            <p className="font-display text-4xl font-bold mt-0.5">
              {overall.mastered}
              <span className="text-cream-200/40 text-2xl font-normal"> / {overall.total}</span>
            </p>
          </div>
          <div className="text-5xl">⚡</div>
        </div>
      </div>

      {/* Deck grid */}
      <div className="flex flex-col gap-4">
        <h2 className="font-display font-semibold text-ink-900 text-xl">Your Decks</h2>
        {wordGroups.map((group) => {
          const stats = getGroupStats(group.id, group.words);
          return (
            <DeckCard
              key={group.id}
              group={group}
              stats={stats}
              onClick={() => onStartStudy(group)}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 bg-cream-100 border border-ink-900/10 rounded-xl p-4 text-sm text-ink-700/60">
        <p className="font-semibold text-ink-800 mb-2">Progress Legend</p>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-slate-400 rounded-full" /> New</div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-amber-400 rounded-full" /> Learning</div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-blue-400 rounded-full" /> Familiar</div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-sage-500 rounded-full" /> Mastered</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Root App
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [activeGroup, setActiveGroup] = useState(null);
  const { getCard, recordAnswer, resetGroup, getGroupStats, getDueWords, getOverallStats } =
    useFlashcards(wordGroups);

  if (activeGroup) {
    return (
      <div className="min-h-screen bg-cream-100 font-sans">
        <div className="max-w-lg mx-auto px-4 py-10">
          <StudySession
            group={activeGroup}
            getDueWords={getDueWords}
            getCard={getCard}
            recordAnswer={recordAnswer}
            onBack={() => setActiveGroup(null)}
            onComplete={() => setActiveGroup(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 font-sans">
      <HomeScreen
        wordGroups={wordGroups}
        getGroupStats={getGroupStats}
        getDueWords={getDueWords}
        onStartStudy={setActiveGroup}
      />
    </div>
  );
}
