import React, { useState } from 'react';
import type { Workspace, User } from '../types';
import { X, MapPin, Calendar, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { bookingsApi } from '../api';

interface WorkspaceModalProps {
  workspace: Workspace | null;
  currentUser: User | null;
  onClose: () => void;
  onBookingSuccess: () => void;
  onRequireAuth: () => void;
}

export const WorkspaceModal: React.FC<WorkspaceModalProps> = ({
  workspace,
  currentUser,
  onClose,
  onBookingSuccess,
  onRequireAuth,
}) => {
  const [bookingDate, setBookingDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [seats, setSeats] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!workspace) return null;

  const handlePreset = (start: string, end: string) => {
    setStartTime(start);
    setEndTime(end);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      onRequireAuth();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await bookingsApi.create({
        workspaceId: workspace.id,
        bookingDate,
        startTime,
        endTime,
        seats,
        notes: notes || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        onBookingSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to complete booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100">
        {/* Header Image */}
        <div className="relative h-60 w-full overflow-hidden rounded-t-2xl bg-slate-800">
          <img
            src={
              workspace.imageUrl ||
              'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
            }
            alt={workspace.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/40" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-900/80 hover:bg-slate-900 p-2 rounded-full text-white backdrop-blur transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-600/90 text-white mb-2">
              Verified Space
            </span>
            <h2 className="text-2xl font-bold text-white drop-shadow-md">
              {workspace.name}
            </h2>
            <div className="flex items-center text-sm text-slate-300 mt-1 drop-shadow">
              <MapPin className="w-4 h-4 mr-1 text-indigo-400" />
              <span>
                {workspace.address}, {workspace.city}, {workspace.country}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">
              About This Workspace
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {workspace.description}
            </p>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Included Amenities
            </h3>
            <div className="flex flex-wrap gap-2">
              {workspace.amenities && workspace.amenities.length > 0 ? (
                workspace.amenities.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-indigo-300"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">
                  Standard amenities provided
                </span>
              )}
            </div>
          </div>

          <hr className="border-slate-800" />

          {/* Booking Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                Reserve Your Space
              </h3>
              <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                Instant Confirmation
              </span>
            </div>

            {success ? (
              <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center animate-in zoom-in-95">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
                <h4 className="text-lg font-bold text-emerald-300">
                  Space Booked Successfully!
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Your reservation is confirmed. Redirecting to your bookings...
                </p>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-rose-300 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date selection */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Number of Seats */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Seats / Desks
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={seats}
                        onChange={(e) => setSeats(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Time Slots & Presets */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      Time Slot
                    </label>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => handlePreset('09:00', '13:00')}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        Morning
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePreset('13:00', '17:00')}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        Afternoon
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePreset('09:00', '18:00')}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        Full Day
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Clock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="time"
                        required
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="relative">
                      <Clock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="time"
                        required
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Optional Notes */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Special Requests / Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g., Quiet corner desk, require high-speed LAN cable"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  {currentUser ? (
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Confirm & Book Workspace
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onRequireAuth}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-lg transition"
                    >
                      Sign In to Book This Space
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
