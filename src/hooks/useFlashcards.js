import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
//  SM2 Spaced Repetition Algorithm
//  quality: 5 = perfect, 4 = correct, 3 = correct with effort,
//           2 = incorrect but remembered, 1 = incorrect, 0 = total blank
// ─────────────────────────────────────────────────────────────
function sm2(card, quality) {
  let { repetitions = 0, easiness = 2.5, interval = 1 } = card;

  if (quality >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easiness);
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easiness = Math.max(
    1.3,
    easiness + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  );

  const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;

  return { repetitions, easiness, interval, nextReview };
}

// ─────────────────────────────────────────────────────────────
//  Status levels (like Magoosh)
// ─────────────────────────────────────────────────────────────
export function getStatus(card) {
  if (!card.repetitions || card.repetitions === 0) return "new";
  if (card.repetitions <= 2) return "learning";
  if (card.repetitions <= 4) return "familiar";
  return "mastered";
}

export function getStatusLabel(status) {
  const labels = {
    new: "New",
    learning: "Learning",
    familiar: "Familiar",
    mastered: "Mastered",
  };
  return labels[status] || "New";
}

export function getStatusColor(status) {
  const colors = {
    new: "bg-slate-200 text-slate-700",
    learning: "bg-amber-100 text-amber-800",
    familiar: "bg-blue-100 text-blue-800",
    mastered: "bg-sage-100 text-sage-800",
  };
  return colors[status] || colors.new;
}

// ─────────────────────────────────────────────────────────────
//  Main hook
// ─────────────────────────────────────────────────────────────
const STORAGE_KEY = "wortschatz_progress";

export function useFlashcards(wordGroups) {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persist to localStorage whenever progress changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {}
  }, [progress]);

  // Get card progress for a specific word
  const getCard = useCallback(
    (groupId, wordIndex) => {
      const key = `${groupId}_${wordIndex}`;
      return progress[key] || { repetitions: 0, easiness: 2.5, interval: 1, nextReview: 0 };
    },
    [progress]
  );

  // Record an answer: gotIt = true/false
  const recordAnswer = useCallback((groupId, wordIndex, gotIt) => {
    const key = `${groupId}_${wordIndex}`;
    setProgress((prev) => {
      const card = prev[key] || { repetitions: 0, easiness: 2.5, interval: 1, nextReview: 0 };
      const quality = gotIt ? 4 : 1;
      const updated = sm2(card, quality);
      return { ...prev, [key]: updated };
    });
  }, []);

  // Reset all progress for a group
  const resetGroup = useCallback((groupId, wordCount) => {
    setProgress((prev) => {
      const next = { ...prev };
      for (let i = 0; i < wordCount; i++) {
        delete next[`${groupId}_${i}`];
      }
      return next;
    });
  }, []);

  // Stats for a group
  const getGroupStats = useCallback(
    (groupId, words) => {
      const stats = { new: 0, learning: 0, familiar: 0, mastered: 0, dueNow: 0 };
      words.forEach((_, i) => {
        const card = getCard(groupId, i);
        const status = getStatus(card);
        stats[status] = (stats[status] || 0) + 1;
        if (card.nextReview <= Date.now()) stats.dueNow += 1;
      });
      return stats;
    },
    [getCard]
  );

  // Get words due for review in a group (prioritise due cards, then new)
  const getDueWords = useCallback(
    (groupId, words) => {
      const now = Date.now();
      const indexed = words.map((w, i) => ({ word: w, index: i, card: getCard(groupId, i) }));
      const due = indexed.filter((w) => w.card.nextReview <= now);
      // Sort: new first, then by nextReview ascending
      due.sort((a, b) => {
        if (a.card.repetitions === 0 && b.card.repetitions !== 0) return -1;
        if (b.card.repetitions === 0 && a.card.repetitions !== 0) return 1;
        return a.card.nextReview - b.card.nextReview;
      });
      return due;
    },
    [getCard]
  );

  // Overall stats across all groups
  const getOverallStats = useCallback(() => {
    const stats = { new: 0, learning: 0, familiar: 0, mastered: 0, total: 0 };
    wordGroups.forEach((group) => {
      group.words.forEach((_, i) => {
        const card = getCard(group.id, i);
        const status = getStatus(card);
        stats[status] = (stats[status] || 0) + 1;
        stats.total += 1;
      });
    });
    return stats;
  }, [wordGroups, getCard]);

  return { getCard, recordAnswer, resetGroup, getGroupStats, getDueWords, getOverallStats };
}
