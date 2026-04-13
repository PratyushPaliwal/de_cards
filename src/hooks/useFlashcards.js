import { useState, useEffect, useCallback, useRef } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

// ─────────────────────────────────────────────────────────────
//  SM2 Algorithm
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
  easiness = Math.max(1.3, easiness + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;
  return { repetitions, easiness, interval, nextReview };
}

// ─────────────────────────────────────────────────────────────
//  Status helpers
// ─────────────────────────────────────────────────────────────
export function getStatus(card) {
  if (!card.repetitions || card.repetitions === 0) return "new";
  if (card.repetitions <= 2) return "learning";
  if (card.repetitions <= 4) return "familiar";
  return "mastered";
}

export function getStatusLabel(status) {
  return { new: "New", learning: "Learning", familiar: "Familiar", mastered: "Mastered" }[status] || "New";
}

// ─────────────────────────────────────────────────────────────
//  localStorage helpers
// ─────────────────────────────────────────────────────────────
const LS_KEY = "wortschatz_progress";

function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem(LS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
}

function saveToLocalStorage(progress) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(progress)); } catch {}
}

// ─────────────────────────────────────────────────────────────
//  Firestore helpers
// ─────────────────────────────────────────────────────────────
function progressRef(uid) {
  return doc(db, "users", uid, "progress", "cards");
}

async function loadFromFirestore(uid) {
  try {
    const snap = await getDoc(progressRef(uid));
    return snap.exists() ? snap.data() : {};
  } catch { return {}; }
}

async function saveToFirestore(uid, progress) {
  try {
    await setDoc(progressRef(uid), progress, { merge: true });
  } catch (err) { console.error("Firestore save error:", err); }
}

// ─────────────────────────────────────────────────────────────
//  Main hook
// ─────────────────────────────────────────────────────────────
export function useFlashcards(wordGroups, user) {
  const [progress, setProgress] = useState({});
  const [syncing, setSyncing] = useState(false);
  const saveTimer = useRef(null);

  // Load progress when user changes
  useEffect(() => {
    async function load() {
      setSyncing(true);
      if (user) {
        const firestoreProgress = await loadFromFirestore(user.uid);
        const localProgress = loadFromLocalStorage();
        const merged = { ...localProgress, ...firestoreProgress };
        setProgress(merged);
        if (Object.keys(localProgress).length > 0) {
          await saveToFirestore(user.uid, merged);
          localStorage.removeItem(LS_KEY);
        }
      } else {
        setProgress(loadFromLocalStorage());
      }
      setSyncing(false);
    }
    load();
  }, [user]);

  // Debounced save
  useEffect(() => {
    if (Object.keys(progress).length === 0) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (user) saveToFirestore(user.uid, progress);
      else saveToLocalStorage(progress);
    }, 300);
    return () => clearTimeout(saveTimer.current);
  }, [progress, user]);

  // Update leaderboard
  useEffect(() => {
    if (!user || Object.keys(progress).length === 0) return;
    const stats = wordGroups.reduce(
      (acc, group) => {
        group.words.forEach((_, i) => {
          const card = progress[`${group.id}_${i}`] || {};
          const status = getStatus(card);
          acc[status] = (acc[status] || 0) + 1;
          acc.total += 1;
        });
        return acc;
      },
      { new: 0, learning: 0, familiar: 0, mastered: 0, total: 0 }
    );
    setDoc(
      doc(db, "leaderboard", user.uid),
      {
        displayName: user.displayName,
        photoURL: user.photoURL,
        mastered: stats.mastered,
        familiar: stats.familiar,
        learning: stats.learning,
        total: stats.total,
        lastActive: Date.now(),
      },
      { merge: true }
    ).catch(() => {});
  }, [progress, user, wordGroups]);

  const getCard = useCallback(
    (groupId, wordIndex) => {
      const key = `${groupId}_${wordIndex}`;
      return progress[key] || { repetitions: 0, easiness: 2.5, interval: 1, nextReview: 0 };
    },
    [progress]
  );

  const recordAnswer = useCallback((groupId, wordIndex, gotIt) => {
    const key = `${groupId}_${wordIndex}`;
    setProgress((prev) => {
      const card = prev[key] || { repetitions: 0, easiness: 2.5, interval: 1, nextReview: 0 };
      return { ...prev, [key]: sm2(card, gotIt ? 4 : 1) };
    });
  }, []);

  const resetGroup = useCallback((groupId, wordCount) => {
    setProgress((prev) => {
      const next = { ...prev };
      for (let i = 0; i < wordCount; i++) delete next[`${groupId}_${i}`];
      return next;
    });
  }, []);

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

  const getDueWords = useCallback(
    (groupId, words) => {
      const now = Date.now();
      const indexed = words.map((w, i) => ({ word: w, index: i, card: getCard(groupId, i) }));
      const due = indexed.filter((w) => w.card.nextReview <= now);
      due.sort((a, b) => {
        if (a.card.repetitions === 0 && b.card.repetitions !== 0) return -1;
        if (b.card.repetitions === 0 && a.card.repetitions !== 0) return 1;
        return a.card.nextReview - b.card.nextReview;
      });
      return due;
    },
    [getCard]
  );

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

  return { getCard, recordAnswer, resetGroup, getGroupStats, getDueWords, getOverallStats, syncing };
}
