import { useState, useRef, useEffect } from "react";

export function UserMenu({ user, syncing, onLogOut }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-cream-50 border-2 border-ink-900
                   rounded-xl px-3 py-2 shadow-card hover:shadow-card-hover
                   hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="w-7 h-7 rounded-full border border-ink-900/20"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-sage-500 flex items-center justify-center text-white text-sm font-bold">
            {user.displayName?.[0] || "?"}
          </div>
        )}
        <span className="text-sm font-medium text-ink-900 hidden sm:block max-w-[100px] truncate">
          {user.displayName?.split(" ")[0]}
        </span>
        {syncing && (
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Syncing..." />
        )}
        <svg className="w-3 h-3 text-ink-700/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-cream-50 border-2 border-ink-900
                        rounded-xl shadow-card-lg z-50 overflow-hidden animate-slide-up">
          <div className="px-4 py-3 border-b border-ink-900/10">
            <p className="font-semibold text-ink-900 text-sm truncate">{user.displayName}</p>
            <p className="text-xs text-ink-700/50 truncate">{user.email}</p>
          </div>
          <button
            onClick={() => { setOpen(false); onLogOut(); }}
            className="w-full text-left px-4 py-3 text-sm text-ink-900 hover:bg-cream-200
                       transition-colors flex items-center gap-2"
          >
            <span>👋</span> Sign out
          </button>
        </div>
      )}
    </div>
  );
}
