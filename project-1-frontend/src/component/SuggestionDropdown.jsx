// components/SuggestionDropdown.jsx
import { MapPin, Landmark } from "lucide-react";

// Highlights the matching portion of text
function HighlightMatch({ text, keyword }) {
  if (!keyword) return <span>{text}</span>;
  const regex  = new RegExp(`(${keyword.trim()})`, "gi");
  const parts  = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-amber-100 text-amber-700 font-semibold rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

export default function SuggestionDropdown({ suggestions, keyword, activeIndex, onSelect, onHover }) {
  if (!suggestions.length) return null;

  return (
    <ul
      role="listbox"
      className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden"
    >
      {suggestions.map((s, i) => (
        <li
          key={i}
          role="option"
          aria-selected={i === activeIndex}
          onMouseEnter={() => onHover(i)}
          onMouseDown={() => onSelect(s)} // mousedown fires before blur
          className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors
            ${i === activeIndex ? "bg-amber-50" : "hover:bg-stone-50"}
            ${i !== 0 ? "border-t border-stone-100" : ""}
          `}
        >
          <div className={`p-1.5 rounded-lg ${i === activeIndex ? "bg-amber-100" : "bg-stone-100"}`}>
            <MapPin size={16} className={i === activeIndex ? "text-amber-600" : "text-stone-500"} />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-stone-800 text-sm font-medium truncate">
              <HighlightMatch text={s.name} keyword={keyword} />
            </p>
            <p className="text-stone-400 text-xs truncate">
              {s.location.city}, {s.location.state}
            </p>
          </div>

          <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full shrink-0">
            {s.category}
          </span>
        </li>
      ))}

      {/* No results fallback — shown by parent only when isOpen + 0 results */}
    </ul>
  );
}