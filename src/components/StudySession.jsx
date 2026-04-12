import { useState, useCallback } from "react";
import { Flashcard } from "./Flashcard";

export function StudySession({ group, getDueWords, getCard, recordAnswer, onBack, onComplete }) {
  const buildQueue = useCallback(() => {
    return getDueWords(group.id, group.words);
  }, [group, getDueWords]);

  const [queue, setQueue] = useState(() => buildQueue());
  const [currentIdx, setCurrentIdx] = useState(0);
  const [sessionStats, setSessionStats] = useState({ got: 0, missed: 0 });
  const [done, setDone] = useState(false);

  if (queue.length === 0 && !done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <span className="text-6xl mb-4">🎉</span>
        <h2 className="font-display text-3xl font-bold text-ink-900 mb-2">
          All caught up!
        </h2>
        <p className="text-ink-700/60 mb-8 max-w-sm">
          No words are due for review right now. Come back later or study the full deck.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="px-6 py-3 border-2 border-ink-900 rounded-xl font-semibold
                       bg-cream-50 shadow-card hover:shadow-card-hover hover:translate-x-0.5
                       hover:translate-y-0.5 transition-all duration-150"
          >
            ← Back to Decks
          </button>
          <button
            onClick={() => {
              // Study all words regardless of due date
              const all = group.words.map((word, index) => ({
                word, index, card: getCard(group.id, index),
              }));
              setQueue(all);
            }}
            className="px-6 py-3 border-2 border-ink-900 rounded-xl font-semibold
                       bg-ink-900 text-cream-50 shadow-card hover:shadow-card-hover
                       hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150"
          >
            Study All Anyway
          </button>
        </div>
      </div>
    );
  }

  if (done) {
    const total = sessionStats.got + sessionStats.missed;
    const pct = total > 0 ? Math.round((sessionStats.got / total) * 100) : 0;

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <span className="text-6xl mb-4">{pct >= 80 ? "🏆" : pct >= 50 ? "💪" : "📚"}</span>
        <h2 className="font-display text-3xl font-bold text-ink-900 mb-2">
          Session Complete!
        </h2>
        <div className="bg-cream-100 border-2 border-ink-900 rounded-2xl p-6 mb-8 shadow-card w-full max-w-xs">
          <div className="flex justify-around">
            <div>
              <p className="text-4xl font-display font-bold text-sage-500">{sessionStats.got}</p>
              <p className="text-sm text-ink-700/60 mt-1">Got it</p>
            </div>
            <div className="w-px bg-ink-900/10" />
            <div>
              <p className="text-4xl font-display font-bold text-ink-900">{sessionStats.missed}</p>
              <p className="text-sm text-ink-700/60 mt-1">Missed</p>
            </div>
            <div className="w-px bg-ink-900/10" />
            <div>
              <p className="text-4xl font-display font-bold text-amber-600">{pct}%</p>
              <p className="text-sm text-ink-700/60 mt-1">Score</p>
            </div>
          </div>
        </div>
        <button
          onClick={onBack}
          className="px-8 py-3 bg-ink-900 text-cream-50 border-2 border-ink-900 rounded-xl
                     font-semibold shadow-card hover:shadow-card-hover hover:translate-x-0.5
                     hover:translate-y-0.5 transition-all duration-150"
        >
          ← Back to Decks
        </button>
      </div>
    );
  }

  const current = queue[currentIdx];
  if (!current) return null;

  function handleAnswer(gotIt) {
    recordAnswer(group.id, current.index, gotIt);
    setSessionStats((s) => ({
      got: s.got + (gotIt ? 1 : 0),
      missed: s.missed + (gotIt ? 0 : 1),
    }));

    const nextIdx = currentIdx + 1;
    if (nextIdx >= queue.length) {
      setDone(true);
    } else {
      setCurrentIdx(nextIdx);
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onBack}
          className="text-ink-700/60 hover:text-ink-900 transition-colors font-medium flex items-center gap-1"
        >
          ← Back
        </button>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xl">{group.emoji}</span>
          <h1 className="font-display font-semibold text-ink-900">{group.name}</h1>
        </div>
      </div>

      <Flashcard
        word={current.word}
        card={current.card}
        groupId={group.id}
        wordIndex={current.index}
        onGotIt={() => handleAnswer(true)}
        onDidntGetIt={() => handleAnswer(false)}
        current={currentIdx + 1}
        total={queue.length}
      />
    </div>
  );
}
