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
    'Coffee & Tea',
    'Meeting Rooms',
    'Standing Desks',
    'Phone Booths',
    '24/7 Access',
    'Parking',
    'Printing Services',
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
    setSelectedAmenities(['High-Speed Wi-Fi', 'Coffee & Tea']);
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

  const handleSaveWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name,
      description,
      address,
      city,
      country,
      amenities: selectedAmenities,
      imageUrl: imageUrl || undefined,
    };

    try {
      if (editingWorkspace) {
        await workspacesApi.update(editingWorkspace.id, payload);
      } else {
        await workspacesApi.create(payload);
      }
      setIsModalOpen(false);
      await fetchOwnerWorkspaces();
    } catch (err: any) {
      setError(err.message || 'Failed to save workspace');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete workspace "${name}"?`)) return;

    try {
      await workspacesApi.delete(id);
      await fetchOwnerWorkspaces();
    } catch (err: any) {
      alert(err.message || 'Failed to delete workspace');
    }
  };

  const handleViewBookings = async (workspace: Workspace) => {
    setSelectedWorkspaceForBookings(workspace);
    setLoadingBookings(true);
    try {
      const data = await bookingsApi.getWorkspaceBookings(workspace.id);
      setWorkspaceBookings(data);
    } catch (err: any) {
      alert(err.message || 'Failed to fetch bookings');
    } finally {
      setLoadingBookings(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-3" />
        <p className="text-sm text-slate-400">Loading your owner dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white">Owner Workspace Hub</h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish, edit, and monitor your listed workspaces and customer reservations
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Space</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Workspaces List */}
      {workspaces.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No spaces listed yet</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            You haven't added any workspaces yet. Create your first listing to start accepting bookings!
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg"
          >
            Create Your First Workspace
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((w) => (
            <div
              key={w.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="h-44 w-full bg-slate-800 relative">
                  <img
                    src={
                      w.imageUrl ||
                      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={w.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/90 text-white">
                      Active
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-white">{w.name}</h3>
                  <div className="flex items-center text-xs text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-indigo-400" />
                    <span>
                      {w.address}, {w.city}, {w.country}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {w.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {w.amenities?.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-850 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleViewBookings(w)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Reservations</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(w)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition"
                    title="Edit workspace"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(w.id, w.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                    title="Delete workspace"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Workspace Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h2 className="text-xl font-bold text-white">
                {editingWorkspace ? 'Edit Workspace' : 'Add New Workspace'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWorkspace} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Workspace Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Skyline Executive Suites"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your space atmosphere, seating, quiet zones..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Dubai"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. UAE"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Downtown Boulevard, Floor 12"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Amenities checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Select Amenities
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableAmenities.map((amenity) => {
                    const isChecked = selectedAmenities.includes(amenity);
                    return (
                      <button
                        type="button"
                        key={amenity}
                        onClick={() => toggleAmenity(amenity)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium text-left flex items-center justify-between border transition ${
                          isChecked
                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <span>{amenity}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-md transition"
                >
                  {saving ? 'Saving...' : editingWorkspace ? 'Save Changes' : 'Publish Space'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Workspace Bookings Viewer Modal */}
      {selectedWorkspaceForBookings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Reservations for {selectedWorkspaceForBookings.name}
                </h2>
                <p className="text-xs text-slate-400">
                  {selectedWorkspaceForBookings.address}, {selectedWorkspaceForBookings.city}
                </p>
              </div>
              <button
                onClick={() => setSelectedWorkspaceForBookings(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingBookings ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                Loading reservations...
              </div>
            ) : workspaceBookings.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                No customer bookings yet for this workspace.
              </div>
            ) : (
              <div className="space-y-3">
                {workspaceBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">
                          {b.customerName}
                        </span>
                        <span className="text-xs text-slate-400">
                          ({b.customerEmail})
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-300 mt-2">
                        <div className="flex items-center gap-1 text-indigo-300">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{b.bookingDate}</span>
                        </div>
                        <div className="flex items-center gap-1 text-indigo-300">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {b.startTime} - {b.endTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                          <Users className="w-3.5 h-3.5" />
                          <span>{b.seats} seats</span>
                        </div>
                      </div>
                      {b.notes && (
                        <p className="text-xs text-slate-400 italic mt-1.5">
                          "{b.notes}"
                        </p>
                      )}
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
