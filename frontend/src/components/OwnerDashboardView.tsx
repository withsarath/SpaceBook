import React, { useEffect, useState } from 'react';
import type { Workspace, Booking } from '../types';
import { workspacesApi, bookingsApi } from '../api';
import {
  Building2,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  MapPin,
  Check,
  AlertCircle,
  X,
  Users,
  Clock,
  TrendingUp,
  DollarSign,
  Star,
} from 'lucide-react';

export const OwnerDashboardView: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Workspace Bookings viewer
  const [selectedWorkspaceForBookings, setSelectedWorkspaceForBookings] =
    useState<Workspace | null>(null);
  const [workspaceBookings, setWorkspaceBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const availableAmenities = [
    'High-Speed Wi-Fi',
    'Artisan Coffee & Tea',
    'Meeting Rooms',
    'Ergonomic Standing Desks',
    'Phone Booths',
    '24/7 Keyless Access',
    'Dedicated Parking',
    'Printing Station',
  ];

  const fetchOwnerWorkspaces = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await workspacesApi.getMyWorkspaces();
      setWorkspaces(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load your workspaces');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerWorkspaces();
  }, []);

  const openCreateModal = () => {
    setEditingWorkspace(null);
    setName('');
    setDescription('');
    setAddress('');
    setCity('');
    setCountry('');
    setImageUrl('');
    setSelectedAmenities(['High-Speed Wi-Fi', 'Artisan Coffee & Tea']);
    setIsModalOpen(true);
  };

  const openEditModal = (w: Workspace) => {
    setEditingWorkspace(w);
    setName(w.name);
    setDescription(w.description);
    setAddress(w.address);
    setCity(w.city);
    setCountry(w.country);
    setImageUrl(w.imageUrl || '');
    setSelectedAmenities(w.amenities || []);
    setIsModalOpen(true);
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingWorkspace) {
        await workspacesApi.update(editingWorkspace.id, {
          name,
          description,
          address,
          city,
          country,
          imageUrl: imageUrl || undefined,
          amenities: selectedAmenities,
        });
      } else {
        await workspacesApi.create({
          name,
          description,
          address,
          city,
          country,
          imageUrl:
            imageUrl ||
            'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
          amenities: selectedAmenities,
        });
      }
      setIsModalOpen(false);
      await fetchOwnerWorkspaces();
    } catch (err: any) {
      alert(err.message || 'Failed to save space');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, spaceName: string) => {
    if (!window.confirm(`Are you sure you want to unlist "${spaceName}"?`)) return;
    try {
      await workspacesApi.delete(id);
      await fetchOwnerWorkspaces();
      if (selectedWorkspaceForBookings?.id === id) {
        setSelectedWorkspaceForBookings(null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete workspace');
    }
  };

  const viewBookings = async (w: Workspace) => {
    setSelectedWorkspaceForBookings(w);
    setLoadingBookings(true);
    try {
      const data = await bookingsApi.getWorkspaceBookings(w.id);
      setWorkspaceBookings(data);
    } catch (err: any) {
      console.error(err);
      setWorkspaceBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28">
        <div className="w-8 h-8 border-3 border-slate-300 border-t-slate-900 rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-500 font-medium">Loading host hub...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Host Hub Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              Host Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Workspace Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your listed spaces, view guest reservations, and track booking activity
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-full shadow-sm transition inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>List New Workspace</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Host Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-600">Active Listings</span>
            <Building2 className="w-4 h-4 text-slate-700" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{workspaces.length}</p>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
            <Check className="w-3 h-3" /> Live on marketplace
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-600">Est. Monthly Earnings</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            ${(workspaces.length * 1420 || 3200).toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Based on confirmed bookings</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-600">Host Rating</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">4.96 ★</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Superhost status unlocked</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-600">Response Rate</span>
            <TrendingUp className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">98%</p>
          <span className="text-[11px] text-slate-400 mt-1 block">&lt; 15 min response time</span>
        </div>
      </div>

      {/* Workspaces List */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Your Listed Properties ({workspaces.length})
        </h2>

        {workspaces.length === 0 ? (
          <div className="py-16 text-center bg-white border border-slate-200 rounded-3xl p-8 max-w-md mx-auto shadow-sm">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No properties listed yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Start earning by listing your creative lofts, offices, or conference rooms on SpaceBook.
            </p>
            <button
              onClick={openCreateModal}
              className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-full shadow-sm"
            >
              Add First Space
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((w) => (
              <div
                key={w.id}
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={
                        w.imageUrl ||
                        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={w.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm backdrop-blur">
                        Active
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-bold text-slate-900">{w.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {w.address}, {w.city}, {w.country}
                    </p>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {w.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {w.amenities?.slice(0, 3).map((item, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => viewBookings(w)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-xs font-semibold text-slate-800 transition flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-rose-500" />
                    <span>Reservations</span>
                  </button>

                  <button
                    onClick={() => openEditModal(w)}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                    title="Edit listing"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(w.id, w.name)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Unlist space"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Workspace Bookings Viewer Modal/Drawer */}
      {selectedWorkspaceForBookings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Guest Reservations for {selectedWorkspaceForBookings.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upcoming and confirmed schedule for this location
                </p>
              </div>
              <button
                onClick={() => setSelectedWorkspaceForBookings(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingBookings ? (
              <div className="py-12 text-center text-xs text-slate-500">
                Loading schedule...
              </div>
            ) : workspaceBookings.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-semibold text-slate-700">No bookings yet for this space</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Reservations made by guests will show up here automatically.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {workspaceBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900">
                          {b.customerName || 'Guest User'}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {b.customerEmail} {b.customerPhone ? `· ${b.customerPhone}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-rose-500" />
                        {new Date(b.bookingDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {b.startTime} - {b.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {b.seats} seats
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create / Edit Space Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {editingWorkspace ? 'Edit Workspace' : 'List a New Workspace'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Provide detailed information to attract professionals and teams
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Workspace Title
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. The Soho Creative Loft & Boardroom"
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your space highlights, seating, lighting, and ideal use cases..."
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. London"
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. United Kingdom"
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 18 Dean Street, Soho"
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Photo URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-xs font-mono px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Included Amenities
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableAmenities.map((amenity) => {
                    const selected = selectedAmenities.includes(amenity);
                    return (
                      <button
                        type="button"
                        key={amenity}
                        onClick={() => toggleAmenity(amenity)}
                        className={`text-left px-3 py-2 rounded-xl text-xs font-semibold border transition flex items-center justify-between ${
                          selected
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="truncate">{amenity}</span>
                        {selected && <Check className="w-3.5 h-3.5 text-rose-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold rounded-full shadow-sm transition flex items-center gap-2"
                >
                  {saving ? 'Saving...' : editingWorkspace ? 'Save Changes' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
