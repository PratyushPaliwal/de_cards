# Wortschatz 🇩🇪

A German vocabulary flashcard app with spaced repetition — inspired by Magoosh GRE Flashcards.

**Live app:** https://decards.app

---

## Features

- 📚 Words grouped by topic (Travel, Household, Cooking, etc.)
- 🔄 Spaced repetition using the SM2 algorithm (same as Anki)
- 📖 Dictionary-style word info: noun genders, verb conjugations, adjective comparatives
- 📊 Progress tracking: New → Learning → Familiar → Mastered
- 🔐 Google Sign-In with cross-device progress sync via Firebase
- 📱 Works on mobile and desktop

---

## Adding New Word Groups

Open `src/data/wordGroups.js` — this is the **only file you need to edit**.

Copy this template and paste it inside the `wordGroups` array:

```js
{
  id: "your_group_id",      // unique, lowercase, underscores only
  name: "Your Group Name",
  emoji: "🎯",
  words: [
    {
      german: "das Wort",
      english: "the word",
      type: "noun",           // noun | verb | adjective | adverb | phrase
      gender: "n",            // m | f | n  (nouns only)
      plural: "die Wörter",   // optional
      example: "Das ist ein neues Wort.",
    },
    {
      german: "lernen",
      english: "to learn",
      type: "verb",
      auxiliary: "haben",     // haben | sein
      past: "gelernt",
      example: "Ich lerne täglich neue Wörter.",
    },
    {
      german: "schön",
      english: "beautiful",
      type: "adjective",
      comparative: "schöner",
      superlative: "am schönsten",
      example: "Das Wetter ist heute sehr schön.",
    },
  ],
},
```

### Word type fields

| Type | Extra fields |
|------|-------------|
| `noun` | `gender` (m/f/n), `plural` |
| `verb` | `auxiliary` (haben/sein), `past` (past participle) |
| `adjective` | `comparative`, `superlative` |
| `adverb` | — |
| `phrase` | — |

---

## Running Locally

```bash
npm install
npm start
```

---

## Tech Stack

- React 18
- Tailwind CSS
- Firebase Auth (Google Sign-In)
- Firestore (cross-device progress sync)
- SM2 Spaced Repetition Algorithm

---

## How Spaced Repetition Works

After you flip a card you choose **Got it** or **Didn't know it**. The SM2 algorithm then schedules when to show that card again:

- **Got it** → shown again in a few days, interval grows each time you get it right
- **Didn't know it** → shown again tomorrow, interval resets

Words graduate through four stages:

1. **New** — never studied
2. **Learning** — seen 1–2 times correctly
3. **Familiar** — seen 3–4 times correctly
4. **Mastered** — seen 5+ times correctly

---

## Contributing

The word list is the heart of this project. If you spot a mistake in a word, gender, example sentence, or want to suggest a new group, feel free to open a pull request or an issue.

---

## License

MIT — free to use, fork, and adapt.