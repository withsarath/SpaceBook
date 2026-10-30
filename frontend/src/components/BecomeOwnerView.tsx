import React, { useEffect, useState } from 'react';
import { ownerApplicationsApi } from '../api';
import type { OwnerApplication } from '../types';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  DollarSign,
  ShieldCheck,
  Calendar,
  ArrowRight,
} from 'lucide-react';

interface BecomeOwnerViewProps {
  onSuccess: () => void;
}

export const BecomeOwnerView: React.FC<BecomeOwnerViewProps> = ({
  onSuccess,
}) => {
  const [application, setApplication] = useState<OwnerApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const data = await ownerApplicationsApi.getMyApplication();
      setApplication(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      await ownerApplicationsApi.apply({
        businessName,
        description,
        reason,
      });
      setSuccessMsg('Application submitted! Our host curation team will review your application within 24 hours.');
      await fetchStatus();
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28">
        <div className="w-8 h-8 border-3 border-slate-300 border-t-slate-900 rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-500 font-medium">Checking host status...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Editorial Host Hero */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Host Partner Program</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Turn your empty desks and lofts into steady monthly income.
          </h1>

          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Join thousands of hosts welcoming creators, startups, and remote teams. Set your own hours, pricing, and rules.
          </p>
        </div>

        {/* Value Pillars */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-rose-500 shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Guaranteed Payouts</h4>
              <p className="text-[11px] text-slate-500">Direct deposits processed weekly with automated invoicing.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-rose-500 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Verified Guests</h4>
              <p className="text-[11px] text-slate-500">Every attendee is identity-verified before reserving.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-rose-500 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Total Flexibility</h4>
              <p className="text-[11px] text-slate-500">Block blackout dates and set custom hourly or day rates.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Application Status or Application Form */}
      {application ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="text-center max-w-md mx-auto space-y-4">
            {application.status === 'pending' && (
              <>
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-600 border border-amber-200">
                  <Clock className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    Application Under Review
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">
                    Thanks for applying, {application.businessName}!
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Our curation team is reviewing your workspace portfolio. You will receive an email notification as soon as your host status is verified.
                  </p>
                </div>
              </>
            )}

            {application.status === 'approved' && (
              <>
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Host Verified
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">
                    Congratulations! You are an approved SpaceBook host.
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    You have full access to the Host Hub. Start adding your properties and publishing your available booking slots.
                  </p>
                </div>
              </>
            )}

            {application.status === 'rejected' && (
              <>
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto text-rose-600 border border-rose-200">
                  <XCircle className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    Application Declined
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">
                    Application Status Update
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Reason: {application.rejectionReason || 'Does not currently meet host verification criteria.'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Apply to Become a Verified Host
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Tell us about your spaces and company. Review takes under 24 hours.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2 text-emerald-800 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Business / Property Name
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Skyline Workspace Collective LLC"
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Overview of Your Spaces
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the type of spaces you manage (e.g. 5 meeting rooms, 2 creative daylight lofts in central London)..."
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Why do you want to partner with SpaceBook?
                </label>
                <textarea
                  rows={2}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Looking to monetize surplus boardroom capacity on weekdays..."
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2"
              >
                {submitting ? 'Submitting Application...' : 'Submit Host Application'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
