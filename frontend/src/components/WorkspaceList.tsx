import React, { useState } from 'react';
import type { Workspace } from '../types';
import {
  MapPin,
  Star,
  Users,
  Wifi,
  Coffee,
  Heart,
  Sparkles,
  Building2,
  Zap,
  RotateCcw,
} from 'lucide-react';

interface WorkspaceListProps {
  workspaces: Workspace[];
  onSelectWorkspace: (workspace: Workspace) => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

// Category filter definitions
const CATEGORIES = [
  { id: 'all', label: 'All Spaces', icon: Building2 },
  { id: 'Creative Loft', label: 'Creative Lofts', icon: Sparkles },
  { id: 'Meeting Room', label: 'Meeting Rooms', icon: Users },
  { id: 'Private Office', label: 'Private Offices', icon: Building2 },
  { id: 'Dedicated Desk', label: 'Dedicated Desks', icon: Wifi },
  { id: 'Creative Studio', label: 'Photo & Studios', icon: Coffee },
];

export const WorkspaceList: React.FC<WorkspaceListProps> = ({
  workspaces,
  onSelectWorkspace,
  searchInputRef,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [instantBookOnly, setInstantBookOnly] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'rating'>('recommended');

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Distinct cities from workspaces
  const cities = ['All', ...Array.from(new Set(workspaces.map((w) => w.city).filter(Boolean)))];

  // Filtering
  const filtered = workspaces
    .filter((w) => {
      const query = search.toLowerCase();
      const matchesSearch =
        !search ||
        w.name.toLowerCase().includes(query) ||
        w.city.toLowerCase().includes(query) ||
        w.country.toLowerCase().includes(query) ||
        w.description.toLowerCase().includes(query) ||
        (w.amenities && w.amenities.some((a) => a.toLowerCase().includes(query)));

      const matchesCity = selectedCity === 'All' || w.city === selectedCity;
      const matchesCategory =
        selectedCategory === 'all' ||
        (w.spaceType && w.spaceType.toLowerCase().includes(selectedCategory.toLowerCase()));
      const matchesPrice = (w.pricePerHour || 45) <= maxPrice;
      const matchesInstant = !instantBookOnly || w.instantBook;

      return matchesSearch && matchesCity && matchesCategory && matchesPrice && matchesInstant;
    })
    .sort((a, b) => {
      if (sortBy === 'price_low') return (a.pricePerHour || 45) - (b.pricePerHour || 45);
      if (sortBy === 'price_high') return (b.pricePerHour || 45) - (a.pricePerHour || 45);
      if (sortBy === 'rating') return (b.rating || 4.9) - (a.rating || 4.9);
      return 0; // recommended order
    });

  return (
    <div className="space-y-8">
      {/* Editorial Hero Header (Clean Peerspace / Airbnb style) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Instant hourly workspace reservations</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Book professional spaces <br className="hidden sm:inline" />
            by the hour or day.
          </h1>

          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Quiet focus desks, high-tech boardrooms, photo studios, and offsite lofts in major cities.
            Verified Wi-Fi speeds, seamless keyless entry.
          </p>
        </div>

        {/* Integrated Floating Search Bar */}
        <div className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-2 sm:p-3 shadow-inner flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          {/* Location input */}
          <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-white rounded-xl border border-slate-200/80 shadow-sm">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by city, neighborhood, or amenities (e.g. London, Fiber Wi-Fi)..."
              className="w-full text-xs sm:text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-xs text-slate-400 hover:text-slate-600 px-1 font-medium"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick city dropdown / filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200/80 rounded-xl shadow-sm focus:outline-none cursor-pointer"
            >
              <option value="All">All Cities</option>
              {cities.filter((c) => c !== 'All').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="px-3 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200/80 rounded-xl shadow-sm focus:outline-none cursor-pointer"
            >
              <option value={100}>Any Price</option>
              <option value={45}>Up to $45/hr</option>
              <option value={60}>Up to $60/hr</option>
              <option value={80}>Up to $80/hr</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200/80 rounded-xl shadow-sm focus:outline-none cursor-pointer"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="rating">Top Rated (4.9+)</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Subtle decorative background detail */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-rose-50/50 to-transparent pointer-events-none hidden lg:block" />
      </div>

      {/* Category Pills Bar (Airbnb/Peerspace style) */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-rose-400' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 select-none bg-white border border-slate-200 px-3 py-2 rounded-full hover:bg-slate-50 transition">
            <Zap className={`w-3.5 h-3.5 ${instantBookOnly ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
            <span>Instant Book</span>
            <input
              type="checkbox"
              checked={instantBookOnly}
              onChange={(e) => setInstantBookOnly(e.target.checked)}
              className="rounded text-rose-500 focus:ring-rose-400 h-3.5 w-3.5"
            />
          </label>
        </div>
      </div>

      {/* Active Results Summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <p>
          Showing <span className="font-semibold text-slate-900">{filtered.length}</span> verified spaces
          {selectedCity !== 'All' ? ` in ${selectedCity}` : ''}
        </p>

        {(selectedCity !== 'All' || selectedCategory !== 'all' || search || instantBookOnly) && (
          <button
            onClick={() => {
              setSelectedCity('All');
              setSelectedCategory('all');
              setSearch('');
              setInstantBookOnly(false);
            }}
            className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-semibold"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Workspace Cards Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center bg-white border border-slate-200 rounded-3xl p-8 max-w-lg mx-auto shadow-sm">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Building2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No matching spaces found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try expanding your city filter or removing specific search keywords.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCity('All');
              setSelectedCategory('all');
              setInstantBookOnly(false);
            }}
            className="mt-5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-full shadow-sm transition"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((workspace) => {
            const isFav = favorites.has(workspace.id);
            const hourly = workspace.pricePerHour || 45;
            const rating = workspace.rating || 4.94;
            const reviews = workspace.reviewCount || 42;

            return (
              <div
                key={workspace.id}
                onClick={() => onSelectWorkspace(workspace)}
                className="group cursor-pointer flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-slate-300 hover:shadow-lg transition-all duration-200"
              >
                {/* Image Container with 4:3 Aspect Ratio */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={workspace.imageUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'}
                    alt={workspace.name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {workspace.isSuperhost && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-white/95 text-slate-900 shadow-sm backdrop-blur">
                        Superhost
                      </span>
                    )}
                    {workspace.instantBook && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full bg-amber-500/90 text-white shadow-sm backdrop-blur flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5 fill-current" />
                        Instant
                      </span>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(e, workspace.id)}
                    aria-label="Save to favorites"
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-sm backdrop-blur transition hover:scale-110 active:scale-95"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-700'
                      }`}
                    />
                  </button>

                  {/* Capacity Pill */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] font-semibold text-white bg-slate-950/75 backdrop-blur px-2.5 py-1 rounded-full">
                    <Users className="w-3 h-3 text-slate-300" />
                    <span>Up to {workspace.capacity || 12} people</span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Location & Rating Header */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                      <span className="font-medium truncate max-w-[180px]">
                        {workspace.city}, {workspace.country}
                      </span>
                      <div className="flex items-center gap-1 font-semibold text-slate-900 shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{rating.toFixed(2)}</span>
                        <span className="text-slate-400 font-normal">({reviews})</span>
                      </div>
                    </div>

                    {/* Workspace Title */}
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                      {workspace.name}
                    </h3>

                    {/* Description preview */}
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {workspace.description}
                    </p>

                    {/* Key Amenities */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {workspace.amenities?.slice(0, 3).map((item, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                        >
                          {item}
                        </span>
                      ))}
                      {workspace.amenities && workspace.amenities.length > 3 && (
                        <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-400 font-medium">
                          +{workspace.amenities.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & Booking Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-slate-900">${hourly}</span>
                        <span className="text-xs text-slate-500 font-normal">/ hour</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        ~${hourly * 7} full day rate
                      </span>
                    </div>

                    <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-900 text-white group-hover:bg-rose-600 transition-colors shadow-sm">
                      Check availability
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
