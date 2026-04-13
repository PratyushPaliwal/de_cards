import { useState } from "react";
import wordGroups from "./data/wordGroups";
import { useAuth } from "./hooks/useAuth";
import { useFlashcards } from "./hooks/useFlashcards";
import { DeckCard } from "./components/DeckCard";
import { StudySession } from "./components/StudySession";
import { LoginScreen } from "./components/LoginScreen";
import { UserMenu } from "./components/UserMenu";

// ─────────────────────────────────────────────────────────────
//  Home Screen
// ─────────────────────────────────────────────────────────────
function HomeScreen({ user, syncing, wordGroups, getGroupStats, onStartStudy, onLogOut }) {
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
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-end gap-3">
            <h1 className="font-display text-5xl font-bold text-ink-900 leading-none">
              Wortschatz
            </h1>
            <span className="text-3xl mb-1">🇩🇪</span>
          </div>
          <p className="text-ink-700/60 text-base mt-2">
            Hallo, {user.displayName?.split(" ")[0]}! 👋
          </p>
        </div>
        <UserMenu user={user} syncing={syncing} onLogOut={onLogOut} />
      </div>

      {/* Overall mastered counter */}
      <div className="bg-ink-900 text-cream-50 rounded-2xl px-6 py-5 flex items-center
                      justify-between border-2 border-ink-900 shadow-card mb-8">
        <div>
          <p className="text-cream-200/60 text-sm font-medium">Total Mastered</p>
          <p className="font-display text-4xl font-bold mt-0.5">
            {overall.mastered}
            <span className="text-cream-200/40 text-2xl font-normal"> / {overall.total}</span>
          </p>
        </div>
        <div className="text-5xl">⚡</div>
      </div>

      {/* Deck list */}
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

      {/* Footer */}
      <footer className="text-center text-xs text-ink-700/30 mt-10 font-mono">
        © {new Date().getFullYear()} Pratyush Paliwal · Wortschatz by decards.app
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Loading screen
// ─────────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center gap-4">
      <div className="font-display text-4xl font-bold text-ink-900">Wortschatz 🇩🇪</div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-ink-900/30 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Root App
// ─────────────────────────────────────────────────────────────
export default function App() {
  const { user, loading, signIn, logOut } = useAuth();
  const [activeGroup, setActiveGroup] = useState(null);
  const { getCard, recordAnswer, resetGroup, getGroupStats, getDueWords, syncing } =
    useFlashcards(wordGroups, user);

  if (loading) return <LoadingScreen />;
  if (!user) return <LoginScreen onSignIn={signIn} />;

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
        user={user}
        syncing={syncing}
        wordGroups={wordGroups}
        getGroupStats={getGroupStats}
        onStartStudy={setActiveGroup}
        onLogOut={logOut}
      />
    </div>
  );
}
