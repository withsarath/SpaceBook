import React, { useState } from 'react';
import type { Workspace } from '../types';
import { Search, MapPin, Building, Sparkles, ArrowRight } from 'lucide-react';

interface WorkspaceListProps {
  workspaces: Workspace[];
  onSelectWorkspace: (workspace: Workspace) => void;
}

export const WorkspaceList: React.FC<WorkspaceListProps> = ({
  workspaces,
  onSelectWorkspace,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedAmenity, setSelectedAmenity] = useState<string>('All');

  // Available unique cities
  const cities = ['All', ...Array.from(new Set(workspaces.map((w) => w.city)))];

  // Common amenities
  const commonAmenities = [
    'All',
    'High-Speed Wi-Fi',
    'Coffee & Tea',
    'Meeting Rooms',
    '24/7 Access',
    'Standing Desks',
  ];

  // Filter workspaces based on search, city, and amenity
  const filteredWorkspaces = workspaces.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.city.toLowerCase().includes(search.toLowerCase()) ||
      w.country.toLowerCase().includes(search.toLowerCase()) ||
      w.description.toLowerCase().includes(search.toLowerCase());

    const matchesCity = selectedCity === 'All' || w.city === selectedCity;

    const matchesAmenity =
      selectedAmenity === 'All' ||
      (w.amenities &&
        w.amenities.some((a) =>
          a.toLowerCase().includes(selectedAmenity.toLowerCase()),
        ));

    return matchesSearch && matchesCity && matchesAmenity;
  });

  return (
    <div className="space-y-10">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-900 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover inspiring places to get work done</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Work from anywhere, <br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              seamlessly reserved.
            </span>
          </h1>
          <p className="mt-3 text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
            Browse on-demand coworking desks, executive offices, and collaborative spaces.
            Book instantly with zero setup hassle.
          </p>

          {/* Search bar inside hero */}
          <div className="mt-8 max-w-xl">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 absolute left-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by city, space name, or amenities..."
                className="w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-xl"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* City Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 max-w-full">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Cities:
          </span>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                selectedCity === city
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Amenity Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 max-w-full">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Feature:
          </span>
          {commonAmenities.map((amenity) => (
            <button
              key={amenity}
              onClick={() => setSelectedAmenity(amenity)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                selectedAmenity === amenity
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700'
              }`}
            >
              {amenity}
            </button>
          ))}
        </div>
      </div>

      {/* Workspace Cards Grid */}
      {filteredWorkspaces.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/50 border border-slate-800 rounded-3xl">
          <Building className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No workspaces found</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or filters to see more results.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCity('All');
              setSelectedAmenity('All');
            }}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkspaces.map((workspace) => (
            <div
              key={workspace.id}
              onClick={() => onSelectWorkspace(workspace)}
              className="group bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-indigo-500/10 transition-all duration-200 cursor-pointer flex flex-col"
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                <img
                  src={
                    workspace.imageUrl ||
                    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={workspace.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white bg-slate-950/70 backdrop-blur px-2.5 py-1 rounded-full border border-white/10">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>
                    {workspace.city}, {workspace.country}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {workspace.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {workspace.description}
                  </p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {workspace.amenities?.slice(0, 3).map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/80 text-slate-300"
                      >
                        {item}
                      </span>
                    ))}
                    {workspace.amenities && workspace.amenities.length > 3 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-400">
                        +{workspace.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-indigo-400 font-medium">
                    Available Today
                  </span>
                  <div className="flex items-center gap-1 text-xs font-semibold text-white group-hover:text-indigo-400 transition-colors">
                    <span>Reserve</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
