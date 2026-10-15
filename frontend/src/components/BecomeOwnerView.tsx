import React, { useEffect, useState } from 'react';
import { ownerApplicationsApi } from '../api';
import type { OwnerApplication } from '../types';
import { Sparkles, CheckCircle2, Clock, XCircle, Send, AlertCircle } from 'lucide-react';

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
      setSuccessMsg('Application submitted successfully! Our administrators will review it shortly.');
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
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-3" />
        <p className="text-sm text-slate-400">Checking your application status...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SpaceBook Partner Program</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          Become a Workspace Host
        </h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Monetize your empty desks, conference rooms, and creative studios. Join hundreds of space owners on SpaceBook.
        </p>
      </div>

      {/* Application Status Banner if already applied */}
      {application && (
        <div
          className={`p-6 rounded-2xl border ${
            application.status === 'pending'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
              : application.status === 'approved'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
          }`}
        >
          <div className="flex items-start gap-4">
            {application.status === 'pending' && (
              <Clock className="w-7 h-7 text-amber-400 shrink-0 mt-0.5" />
            )}
            {application.status === 'approved' && (
              <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0 mt-0.5" />
            )}
            {application.status === 'rejected' && (
              <XCircle className="w-7 h-7 text-rose-400 shrink-0 mt-0.5" />
            )}

            <div className="space-y-1">
              <h3 className="text-lg font-bold">
                {application.status === 'pending' && 'Application Under Review'}
                {application.status === 'approved' && 'Application Approved!'}
                {application.status === 'rejected' && 'Application Needs Updates'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {application.status === 'pending' &&
                  `Your application for "${application.businessName}" was submitted on ${new Date(
                    application.createdAt,
                  ).toLocaleDateString()}. Our team is actively reviewing it.`}
                {application.status === 'approved' &&
                  'Congratulations! You have been granted Host/Owner access. You can now publish spaces in the Owner Hub.'}
                {application.status === 'rejected' &&
                  `Reason for rejection: ${
                    application.rejectionReason || 'Did not meet requirements'
                  }. You can submit a revised application below.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Show Application Form if no application or if rejected */}
      {(!application || application.status === 'rejected') && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-2">
            Submit Host Application
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Please tell us about your company and workspace facilities.
          </p>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-300 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Business or Company Name
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Nexus Coworking LLC"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Business Description
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your facilities, seating capacity, target community..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Why do you want to list on SpaceBook?
              </label>
              <textarea
                required
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Looking to connect with remote tech workers and fill unused desk capacity"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Application for Review
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
