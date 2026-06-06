// components/SearchBar.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, MapPin } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import SuggestionDropdown from "./SuggestionDropdown";

export default function SearchBar({ initialValue = "" }) {
  const [query, setQuery]           = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading]   = useState(false);
  const [isOpen, setIsOpen]         = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1); // keyboard nav

  const debouncedQuery = useDebounce(query, 350);
  const navigate        = useNavigate();
  const containerRef    = useRef(null);

  // ── Fetch suggestions ──────────────────────────────────
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const controller = new AbortController(); // cancel stale requests

    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/destinations/suggest?keyword=${encodeURIComponent(debouncedQuery)}`,
          { signal: controller.signal }
        );
        const json = await res.json();
        if (json.success) {
          setSuggestions(json.data);
          setIsOpen(json.data.length > 0);
        }
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
    return () => controller.abort();
  }, [debouncedQuery]);

  // ── Close on outside click ─────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Keyboard navigation ────────────────────────────────
  const handleKeyDown = (e) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown")  setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    if (e.key === "ArrowUp")    setActiveIndex((i) => Math.max(i - 1, -1));
    if (e.key === "Escape")     setIsOpen(false);
    if (e.key === "Enter") {
      if (activeIndex >= 0) handleSelect(suggestions[activeIndex]);
      else handleSearch();
    }
  };

  // ── Suggestion selected ────────────────────────────────
  const handleSelect = useCallback((suggestion) => {
    const label = suggestion.name;
    setQuery(label);
    setIsOpen(false);
    setActiveIndex(-1);
    navigate(`/search?search=${encodeURIComponent(label)}`);
  }, [navigate]);

  // ── Search button clicked ──────────────────────────────
  const handleSearch = () => {
    if (!query.trim()) return;
    setIsOpen(false);
    navigate(`/search?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      {/* Input row */}
      <div className="flex items-center bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden transition-shadow focus-within:shadow-2xl">
        <MapPin className="ml-4 text-amber-500 shrink-0" size={20} />

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder="Search destinations, cities, states…"
          className="flex-1 px-3 py-4 text-stone-800 placeholder-stone-400 bg-transparent outline-none text-base"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          role="combobox"
        />

        {/* Loading spinner */}
        {isLoading && (
          <Loader2 className="mr-3 text-stone-400 animate-spin shrink-0" size={18} />
        )}

        <button
          onClick={handleSearch}
          className="m-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors shrink-0"
        >
          Search
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <SuggestionDropdown
          suggestions={suggestions}
          keyword={query}
          activeIndex={activeIndex}
          onSelect={handleSelect}
          onHover={setActiveIndex}
        />
      )}
    </div>
  );
}