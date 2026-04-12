// Dictionary-style part-of-speech badge
const TYPE_STYLES = {
  noun:      { label: "n.",    bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200" },
  verb:      { label: "v.",    bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200" },
  adjective: { label: "adj.", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  adverb:    { label: "adv.", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  phrase:    { label: "phr.", bg: "bg-pink-50",   text: "text-pink-700",   border: "border-pink-200" },
};

const GENDER_STYLES = {
  m: { label: "masc.", bg: "bg-sky-50",    text: "text-sky-700",    border: "border-sky-200" },
  f: { label: "fem.",  bg: "bg-rose-50",   text: "text-rose-700",   border: "border-rose-200" },
  n: { label: "neut.", bg: "bg-teal-50",   text: "text-teal-700",   border: "border-teal-200" },
};

function Badge({ bg, text, border, label }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium border ${bg} ${text} ${border}`}
    >
      {label}
    </span>
  );
}

export function WordTypeBadge({ type, gender }) {
  const typeStyle = TYPE_STYLES[type];
  const genderStyle = gender ? GENDER_STYLES[gender] : null;

  return (
    <span className="inline-flex gap-1.5 flex-wrap">
      {typeStyle && <Badge {...typeStyle} />}
      {genderStyle && <Badge {...genderStyle} />}
    </span>
  );
}

// Compact grammar info shown on back of card
export function GrammarDetails({ word }) {
  const rows = [];

  if (word.plural) {
    rows.push({ label: "plural", value: word.plural });
  }
  if (word.auxiliary) {
    rows.push({ label: "perfect", value: `${word.auxiliary} + ${word.past}` });
  }
  if (word.past && !word.auxiliary) {
    rows.push({ label: "past part.", value: word.past });
  }
  if (word.comparative) {
    rows.push({ label: "compar.", value: word.comparative });
  }
  if (word.superlative) {
    rows.push({ label: "superl.", value: word.superlative });
  }

  if (rows.length === 0) return null;

  return (
    <div className="mt-3 border-t border-ink-900/10 pt-3 flex flex-wrap gap-x-4 gap-y-1">
      {rows.map(({ label, value }) => (
        <span key={label} className="text-xs text-ink-700/60">
          <span className="font-mono text-ink-700/40 mr-1">{label}</span>
          <span className="font-medium text-ink-800">{value}</span>
        </span>
      ))}
    </div>
  );
}
