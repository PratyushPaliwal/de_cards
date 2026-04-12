import { useState } from "react";
import { WordTypeBadge, GrammarDetails } from "./WordTypeBadge";
import { getStatus, getStatusLabel } from "../hooks/useFlashcards";

const STATUS_DOT = {
  new:      "bg-slate-400",
  learning: "bg-amber-400",
  familiar: "bg-blue-400",
  mastered: "bg-sage-500",
};

export function Flashcard({ word, card, groupId, wordIndex, onGotIt, onDidntGetIt, current, total }) {
  const [flipped, setFlipped] = useState(false);
  const [animating, setAnimating] = useState(false);

  const status = getStatus(card);

  function handleFlip() {
    if (!flipped && !animating) {
      setAnimating(true);
      setFlipped(true);
      setTimeout(() => setAnimating(false), 350);
    }
  }

  function handleAnswer(gotIt) {
    setFlipped(false);
    setAnimating(false);
    if (gotIt) onGotIt();
    else onDidntGetIt();
  }

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      {/* Progress indicator */}
      <div className="w-full flex items-center justify-between mb-4 text-sm text-ink-700/60">
        <span className="font-mono">{current} / {total}</span>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${STATUS_DOT[status]}`} />
          <span>{getStatusLabel(status)}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-cream-200 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-ink-900/30 rounded-full transition-all duration-300"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div
        className={`w-full min-h-[280px] bg-cream-50 border-2 border-ink-900 rounded-2xl
                   shadow-card-lg cursor-pointer select-none
                   transition-all duration-150 active:scale-[0.99]
                   ${!flipped ? "hover:shadow-card hover:translate-x-0.5 hover:translate-y-0.5" : ""}
                   ${flipped ? "animate-flip-in" : ""}`}
        onClick={handleFlip}
      >
        {!flipped ? (
          /* ── FRONT ── */
          <div className="p-8 flex flex-col items-center justify-center min-h-[280px] text-center">
            <WordTypeBadge type={word.type} gender={word.gender} />
            <h2 className="font-display text-4xl font-bold text-ink-900 mt-4 leading-tight">
              {word.german}
            </h2>
            <p className="text-ink-700/40 text-sm mt-6 font-medium tracking-wide uppercase">
              tap to reveal
            </p>
          </div>
        ) : (
          /* ── BACK ── */
          <div className="p-8 flex flex-col min-h-[280px]">
            <div className="flex items-start justify-between gap-2 mb-1">
              <WordTypeBadge type={word.type} gender={word.gender} />
            </div>

            <h2 className="font-display text-3xl font-bold text-ink-900 mt-2">
              {word.german}
            </h2>

            <p className="text-2xl font-medium text-sage-600 mt-2">
              {word.english}
            </p>

            <GrammarDetails word={word} />

            {word.example && (
              <div className="mt-4 pt-4 border-t border-ink-900/10">
                <p className="text-xs font-mono text-ink-700/40 uppercase tracking-wide mb-1">
                  example
                </p>
                <p className="text-ink-800 italic leading-relaxed">
                  "{word.example}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Answer buttons (only when flipped) */}
      {flipped && (
        <div className="flex gap-4 mt-6 w-full animate-slide-up">
          <button
            onClick={() => handleAnswer(false)}
            className="flex-1 py-4 bg-cream-50 border-2 border-ink-900 rounded-xl
                       shadow-card hover:shadow-card-hover hover:translate-x-0.5 hover:translate-y-0.5
                       font-semibold text-ink-900 transition-all duration-150 active:scale-[0.98]
                       flex items-center justify-center gap-2"
          >
            <span className="text-xl">✗</span>
            <span>Didn't know it</span>
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="flex-1 py-4 bg-sage-500 border-2 border-ink-900 rounded-xl
                       shadow-card hover:shadow-card-hover hover:translate-x-0.5 hover:translate-y-0.5
                       font-semibold text-white transition-all duration-150 active:scale-[0.98]
                       flex items-center justify-center gap-2"
          >
            <span className="text-xl">✓</span>
            <span>Got it!</span>
          </button>
        </div>
      )}

      {!flipped && (
        <p className="text-xs text-ink-700/40 mt-4 font-mono">
          tap card to flip
        </p>
      )}
    </div>
  );
}
