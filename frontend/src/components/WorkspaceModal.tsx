import React, { useState } from 'react';
import type { Workspace, User } from '../types';
import {
  X,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Star,
  ShieldCheck,
  Wifi,
  Zap,
  Info,
} from 'lucide-react';
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

  const hourlyRate = workspace.pricePerHour || 45;
  const rating = workspace.rating || 4.95;
  const reviews = workspace.reviewCount || 42;
  const host = workspace.hostName || 'Elena Rostova';

  // Calculate duration in hours
  const parseHour = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h + (m || 0) / 60;
  };
  const durationHours = Math.max(1, parseHour(endTime) - parseHour(startTime));
  const subtotal = Math.round(hourlyRate * durationHours * seats);
  const serviceFee = Math.round(subtotal * 0.1);
  const totalAmount = subtotal + serviceFee;

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

    if (parseHour(endTime) <= parseHour(startTime)) {
      setError('End time must be later than start time.');
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
      setError(err.message || 'Failed to complete reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-900 relative my-auto">
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white p-2 rounded-full text-slate-700 shadow-md transition hover:scale-105 active:scale-95"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Hero Banner */}
        <div className="relative h-72 sm:h-80 w-full overflow-hidden rounded-t-3xl bg-slate-100">
          <img
            src={
              workspace.imageUrl ||
              'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
            }
            alt={workspace.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

          {/* Hero text overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/95 text-slate-900 shadow-sm">
                {workspace.spaceType || 'Workspace'}
              </span>
              {workspace.isSuperhost && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-500 text-white shadow-sm flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Superhost
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-sm">
              {workspace.name}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-200 mt-1.5 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                {workspace.address}, {workspace.city}, {workspace.country}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {rating.toFixed(2)} ({reviews} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Area: 2 Columns */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Details & Amenities (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Host Card */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-base shadow-sm">
                  {host.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Hosted by {host}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {workspace.responseTime || 'Responds within 15 minutes'} · Superhost
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Space
                </span>
              </div>
            </div>

            {/* Space Highlights */}
            <div className="space-y-3 pb-6 border-b border-slate-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                  <Wifi className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Dedicated Fast Wi-Fi</h5>
                  <p className="text-xs text-slate-500">
                    Tested high-speed fiber connection with backup power for seamless video calls.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Instant Access</h5>
                  <p className="text-xs text-slate-500">
                    Self check-in via mobile key code provided immediately upon confirmation.
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                About this space
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {workspace.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Amenities & Perks
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {workspace.amenities && workspace.amenities.length > 0 ? (
                  workspace.amenities.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">Standard business amenities included.</p>
                )}
              </div>
            </div>

            {/* House Rules & Policies */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-500" />
                Booking & Cancellation Policy
              </p>
              <p>
                Free cancellation up to 24 hours before your reservation begins. High-volume events or commercial video shoots must be pre-approved by the host.
              </p>
            </div>
          </div>

          {/* Right Column: Sticky Booking Card & Calculator (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg sticky top-6">
              {/* Price Header */}
              <div className="flex items-baseline justify-between pb-4 border-b border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-slate-900">
                    ${hourlyRate}
                  </span>
                  <span className="text-xs text-slate-500 font-normal">/ hour</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-800">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{rating.toFixed(2)}</span>
                  <span className="text-slate-400 font-normal">({reviews})</span>
                </div>
              </div>

              {/* Status Message */}
              {success ? (
                <div className="my-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center animate-in zoom-in-95">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="font-bold text-sm">Reservation Confirmed!</p>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Your spot is booked. Redirecting to your reservations...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="mt-4 space-y-4">
                  {error && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-700 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Date Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        required
                        className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                      />
                    </div>
                  </div>

                  {/* Time Selectors */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Start Time
                      </label>
                      <select
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 cursor-pointer"
                      >
                        {Array.from({ length: 15 }, (_, i) => {
                          const hour = (i + 7).toString().padStart(2, '0');
                          return (
                            <option key={`${hour}:00`} value={`${hour}:00`}>
                              {hour}:00
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        End Time
                      </label>
                      <select
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 cursor-pointer"
                      >
                        {Array.from({ length: 15 }, (_, i) => {
                          const hour = (i + 8).toString().padStart(2, '0');
                          return (
                            <option key={`${hour}:00`} value={`${hour}:00`}>
                              {hour}:00
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  {/* Quick Shift Presets */}
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => handlePreset('09:00', '13:00')}
                      className="flex-1 py-1 text-[11px] font-semibold rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition"
                    >
                      Morning (4h)
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePreset('13:00', '17:00')}
                      className="flex-1 py-1 text-[11px] font-semibold rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition"
                    >
                      Afternoon (4h)
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePreset('09:00', '17:00')}
                      className="flex-1 py-1 text-[11px] font-semibold rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition"
                    >
                      Full Day (8h)
                    </button>
                  </div>

                  {/* Seats / Capacity */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Attendees
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={1}
                        max={workspace.capacity || 20}
                        value={seats}
                        onChange={(e) => setSeats(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-24 text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                      />
                      <span className="text-xs text-slate-500">
                        Max capacity: {workspace.capacity || 20} guests
                      </span>
                    </div>
                  </div>

                  {/* Notes / Special Requests */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Quiet setup, whiteboard markers needed..."
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
                    />
                  </div>

                  {/* Price Calculation Summary */}
                  <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>${hourlyRate} × {durationHours} hr{durationHours > 1 ? 's' : ''} {seats > 1 ? `× ${seats} seats` : ''}</span>
                      <span className="font-semibold text-slate-900">${subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SpaceBook platform fee</span>
                      <span className="font-semibold text-slate-900">${serviceFee}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                      <span>Total (USD)</span>
                      <span className="text-rose-600">${totalAmount}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-rose-500 hover:bg-rose-600 active:scale-[0.99] disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-current" />
                        <span>{currentUser ? 'Reserve Instantly' : 'Sign In & Reserve'}</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-slate-400">
                    You won't be charged until booking confirmation
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
