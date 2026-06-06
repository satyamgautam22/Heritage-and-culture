// pages/SearchResults.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../component/SearchBar";
import DestinationCard from "../component/DestinationCard";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

const CATEGORIES  = ["Heritage", "Beach", "Hill Station", "Wildlife", "Religious", "Adventure", "City"];
const PRICE_RANGES = ["Low", "Medium", "High"];
const RATINGS     = [4, 3, 2];

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults]           = useState([]);
  const [pagination, setPagination]     = useState({});
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState("");

  // Read filters from URL
  const search     = searchParams.get("search")     || "";
  const category   = searchParams.get("category")   || "";
  const rating     = searchParams.get("rating")     || "";
  const priceRange = searchParams.get("priceRange") || "";
  const page       = parseInt(searchParams.get("page") || "1");

  // ── Fetch results whenever URL params change ──────────
  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({ search, category, rating, priceRange, page, limit: 9 });
        const res    = await fetch(`/api/destinations/search?${params}`);
        const json   = await res.json();
        if (json.success) {
          setResults(json.data);
          setPagination(json.pagination);
        }
      } catch (err) {
        setError("Failed to load results. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [search, category, rating, priceRange, page]);

  // ── Update a single filter param ──────────────────────
  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set("page", "1"); // reset to page 1 on filter change
    setSearchParams(next);
  };

  const goToPage = (p) => updateFilter("page", p);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ── Search bar header ── */}
      <div className="bg-white border-b border-stone-200 px-4 py-5">
        <SearchBar initialValue={search} />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">

        {/* ── Sidebar filters ── */}
        <aside className="w-60 shrink-0 hidden lg:block">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 sticky top-6">
            <div className="flex items-center gap-2 mb-5 text-stone-700 font-bold">
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </div>

            {/* Category */}
            <FilterGroup label="Category">
              {CATEGORIES.map((c) => (
                <FilterChip
                  key={c} label={c}
                  active={category === c}
                  onClick={() => updateFilter("category", category === c ? "" : c)}
                />
              ))}
            </FilterGroup>

            {/* Price Range */}
            <FilterGroup label="Price Range">
              {PRICE_RANGES.map((p) => (
                <FilterChip
                  key={p} label={p}
                  active={priceRange === p}
                  onClick={() => updateFilter("priceRange", priceRange === p ? "" : p)}
                />
              ))}
            </FilterGroup>

            {/* Rating */}
            <FilterGroup label="Min Rating">
              {RATINGS.map((r) => (
                <FilterChip
                  key={r} label={`${r}★ & above`}
                  active={rating === String(r)}
                  onClick={() => updateFilter("rating", rating === String(r) ? "" : r)}
                />
              ))}
            </FilterGroup>
          </div>
        </aside>

        {/* ── Results grid ── */}
        <main className="flex-1">
          {/* Result count */}
          <p className="text-stone-500 text-sm mb-5">
            {isLoading ? "Searching…" : `${pagination.total ?? 0} destinations found`}
            {search && <span className="font-medium text-stone-700"> for "{search}"</span>}
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-5 text-sm">{error}</div>
          )}

          {/* Skeleton / Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-stone-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {results.map((dest) => (
                <DestinationCard key={dest._id} destination={dest} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-stone-400">
              <p className="text-4xl mb-3">🗺️</p>
              <p className="font-semibold text-stone-600">No destinations found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="text-sm text-stone-600">
                Page <strong>{page}</strong> of <strong>{pagination.totalPages}</strong>
              </span>

              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= pagination.totalPages}
                className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ── Small reusable filter components ──────────────────────

function FilterGroup({ label, children }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors
        ${active
          ? "bg-amber-500 border-amber-500 text-white"
          : "border-stone-200 text-stone-600 hover:border-amber-400 hover:text-amber-600"
        }`}
    >
      {label}
    </button>
  );
}