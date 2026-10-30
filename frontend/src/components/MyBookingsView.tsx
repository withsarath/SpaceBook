import React, { useEffect, useState } from 'react';
import type { Booking } from '../types';
import { bookingsApi } from '../api';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

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
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');

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
    if (!window.confirm('Are you sure you want to cancel this reservation? Full refund applies for cancellations 24h prior.')) return;

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

  const filtered = bookings.filter((b) => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28">
        <div className="w-8 h-8 border-3 border-slate-300 border-t-slate-900 rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-500 font-medium">Loading your reservations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            My Space Reservations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your workspace bookings, access instructions, and guest passes
          </p>
        </div>

        <button
          onClick={onBrowseSpaces}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-full shadow-sm transition inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>Find more spaces</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Tabs */}
      {bookings.length > 0 && (
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === 'confirmed'
                ? 'bg-emerald-700 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Confirmed ({bookings.filter((b) => b.status === 'confirmed').length})
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === 'cancelled'
                ? 'bg-slate-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Cancelled ({bookings.filter((b) => b.status === 'cancelled').length})
          </button>
        </div>
      )}

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="py-20 text-center bg-white border border-slate-200 rounded-3xl p-8 max-w-lg mx-auto shadow-sm">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No reservations yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You don't have any upcoming space reservations. Browse our curated workspaces to reserve desks, studios, or conference rooms.
          </p>
          <button
            onClick={onBrowseSpaces}
            className="mt-5 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-full shadow-sm transition"
          >
            Explore Spaces
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-xs text-slate-500 py-8 text-center">No reservations matching filter.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => {
            const isConfirmed = b.status === 'confirmed';

            return (
              <div
                key={b.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-5 justify-between items-start md:items-center"
              >
                {/* Left details */}
                <div className="flex gap-4 items-start">
                  <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 hidden sm:block">
                    <img
                      src={
                        b.workspaceImageUrl ||
                        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80'
                      }
                      alt={b.workspaceName || 'Workspace'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                          isConfirmed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {b.status}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Ref #{b.id.slice(0, 8)}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {b.workspaceName || 'Workspace Reservation'}
                    </h3>

                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {b.workspaceAddress ? `${b.workspaceAddress}, ` : ''}
                      {b.workspaceCity || 'City'}, {b.workspaceCountry || 'Country'}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 pt-1">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-rose-500" />
                        {new Date(b.bookingDate).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {b.startTime} – {b.endTime}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {b.seats} attendee{b.seats > 1 ? 's' : ''}
                      </span>
                    </div>

                    {b.notes && (
                      <p className="text-[11px] text-slate-500 italic mt-1">
                        Notes: "{b.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex md:flex-col items-center md:items-end gap-2 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {isConfirmed && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      disabled={cancellingId === b.id}
                      className="px-3.5 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-full transition"
                    >
                      {cancellingId === b.id ? 'Cancelling...' : 'Cancel Reservation'}
                    </button>
                  )}

                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Keypad access active
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
