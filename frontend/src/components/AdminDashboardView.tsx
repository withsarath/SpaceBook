import React, { useEffect, useState } from 'react';
import type { OwnerApplication, Workspace } from '../types';
import { ownerApplicationsApi, workspacesApi } from '../api';
import { Shield, Check, X, Building, AlertCircle, Clock, UserCheck, MessageSquare } from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const [applications, setApplications] = useState<OwnerApplication[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reject modal state
  const [rejectingAppId, setRejectingAppId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [apps, ws] = await Promise.all([
        ownerApplicationsApi.getPending(),
        workspacesApi.getAll(),
      ]);
      setApplications(apps);
      setWorkspaces(ws);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await ownerApplicationsApi.approve(id);
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to approve application');
    } finally {
      setProcessingId(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingAppId) return;
    setProcessingId(rejectingAppId);
    try {
      await ownerApplicationsApi.reject(rejectingAppId, rejectReason || 'Does not meet listing criteria');
      setRejectingAppId(null);
      setRejectReason('');
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to reject application');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mb-3" />
        <p className="text-sm text-slate-400">Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-rose-400" />
            <h1 className="text-2xl font-bold text-white">Administrator Panel</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Review host applications, verify new workspace owners, and oversee network listings
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-white">
              {applications.length}
            </span>
            <p className="text-xs text-slate-400">Pending Host Applications</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-white">
              {workspaces.length}
            </span>
            <p className="text-xs text-slate-400">Active Listed Workspaces</p>
          </div>
        </div>
      </div>

      {/* Pending Applications Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>Pending Owner Applications</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300">
            {applications.length}
          </span>
        </h2>

        {applications.length === 0 ? (
          <div className="p-10 rounded-2xl bg-slate-900/50 border border-slate-800 text-center">
            <UserCheck className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">All caught up!</p>
            <p className="text-xs text-slate-400 mt-1">
              There are no pending owner applications waiting for review.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {applications.map((appItem: any) => {
              // The API returns { application, applicant }
              const app = appItem.application || appItem;
              const applicant = appItem.applicant;

              return (
                <div
                  key={app.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">
                        {app.businessName}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium">
                        Pending Review
                      </span>
                    </div>

                    {applicant && (
                      <p className="text-xs text-indigo-300">
                        Applicant: <strong className="text-white">{applicant.name}</strong> ({applicant.email})
                      </p>
                    )}

                    <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                      <strong className="text-slate-400">Description:</strong> {app.description}
                    </p>

                    <p className="text-xs text-slate-400 italic max-w-xl">
                      <strong>Reason:</strong> "{app.reason}"
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleApprove(app.id)}
                      disabled={processingId === app.id}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow transition"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve Owner</span>
                    </button>

                    <button
                      onClick={() => {
                        setRejectingAppId(app.id);
                        setRejectReason('');
                      }}
                      disabled={processingId === app.id}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Rejection Reason Modal */}
      {rejectingAppId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-400 mb-3">
              <MessageSquare className="w-5 h-5" />
              <h3 className="text-lg font-bold text-white">Reject Application</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Please provide a reason to help the applicant understand what is required.
            </p>

            <textarea
              rows={3}
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Please provide a verified business registration and more complete description of amenities."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 resize-none"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectingAppId(null)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={processingId === rejectingAppId}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow"
              >
                {processingId === rejectingAppId ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
