import React, { useEffect, useState } from 'react';
import type { Booking } from '../types';
import { bookingsApi } from '../api';
import { Calendar, Clock, MapPin, Users, AlertCircle, CheckCircle2, Ban } from 'lucide-react';

interface MyBookingsViewProps {
  onBrowseSpaces: () => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  onBrowseSpaces,
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingsApi.getMyBookings();
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    setCancellingId(id);
    try {
      await bookingsApi.cancel(id);
      await fetchBookings();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-3" />
        <p className="text-sm text-slate-400">Loading your space bookings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white">My Space Bookings</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage and view your upcoming and past reservations
          </p>
        </div>
        <button
          onClick={onBrowseSpaces}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition"
        >
          Book Another Space
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No bookings yet</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            You don't have any workspace reservations yet. Find a space that inspires you!
          </p>
          <button
            onClick={onBrowseSpaces}
            className="mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-xl shadow transition"
          >
            Explore Workspaces
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => {
            const isCancelled = booking.status === 'cancelled';
            return (
              <div
                key={booking.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between transition ${
                  isCancelled
                    ? 'bg-slate-900/40 border-slate-800/60 opacity-75'
                    : 'bg-slate-900/80 border-slate-800 shadow-lg shadow-black/20'
                }`}
              >
                <div>
                  {/* Status & Date Tag */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        isCancelled
                          ? 'bg-slate-800 text-slate-400 border border-slate-700'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {isCancelled ? (
                        <>
                          <Ban className="w-3.5 h-3.5" />
                          Cancelled
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Confirmed
                        </>
                      )}
                    </span>

                    <span className="text-xs text-slate-400 font-medium">
                      Booked {new Date(booking.createdAt || '').toLocaleDateString()}
                    </span>
                  </div>

                  {/* Workspace Info */}
                  <div className="flex gap-4 items-start">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                      <img
                        src={
                          booking.workspaceImageUrl ||
                          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80'
                        }
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {booking.workspaceName}
                      </h3>
                      <div className="flex items-center text-xs text-slate-400 mt-1">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-indigo-400 shrink-0" />
                        <span>
                          {booking.workspaceCity}, {booking.workspaceCountry}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Booking details table/grid */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>{booking.bookingDate}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-300">
                      <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>
                        {booking.startTime} - {booking.endTime}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-300">
                      <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>{booking.seats} {booking.seats === 1 ? 'Seat' : 'Seats'}</span>
                    </div>

                    {booking.notes && (
                      <div className="col-span-2 text-slate-400 italic text-[11px] pt-1 border-t border-slate-700/40">
                        Note: "{booking.notes}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Cancel action */}
                {!isCancelled && (
                  <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() => handleCancel(booking.id)}
                      disabled={cancellingId === booking.id}
                      className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                    >
                      {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Reservation'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
