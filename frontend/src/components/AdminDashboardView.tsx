import React, { useEffect, useState } from 'react';
import type { OwnerApplication, Workspace } from '../types';
import { ownerApplicationsApi, workspacesApi } from '../api';
import {
  Shield,
  Check,
  X,
  AlertCircle,
  Clock,
  UserCheck,
  Building2,
} from 'lucide-react';

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
      <div className="flex flex-col items-center justify-center py-28">
        <div className="w-8 h-8 border-3 border-slate-300 border-t-slate-900 rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-500 font-medium">Loading platform console...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Platform Administration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Admin Operations & Curation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review host applications, inspect platform listings, and manage approvals
          </p>
        </div>

        <button
          onClick={fetchData}
          className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-full border border-slate-200 transition shadow-sm self-start sm:self-auto"
        >
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-600">Pending Host Applications</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{applications.length}</p>
          <span className="text-[11px] text-amber-600 font-medium mt-1 block">
            {applications.length > 0 ? 'Requires administrative review' : 'All caught up!'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-600">Active Workspaces</span>
            <Building2 className="w-4 h-4 text-slate-700" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{workspaces.length}</p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
            Published on live marketplace
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-600">Platform Security</span>
            <Shield className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">100%</p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            JWT RBAC Access Control Active
          </span>
        </div>
      </div>

      {/* Pending Applications Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span>Pending Host Submissions</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            {applications.length}
          </span>
        </h2>

        {applications.length === 0 ? (
          <div className="py-12 text-center bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900">No applications pending review</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              When new hosts submit an onboarding application, their details will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {app.businessName}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      Pending
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    Applicant:{' '}
                    <span className="font-semibold text-slate-700">
                      {app.applicant?.name || 'Applicant'}
                    </span>{' '}
                    ({app.applicant?.email || 'email'})
                  </p>

                  <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mt-2 space-y-1">
                    <p>
                      <strong className="text-slate-800">Space Portfolio:</strong> {app.description}
                    </p>
                    <p>
                      <strong className="text-slate-800">Reason:</strong> {app.reason}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleApprove(app.id)}
                    disabled={processingId === app.id}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-full shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve Host</span>
                  </button>

                  <button
                    onClick={() => setRejectingAppId(app.id)}
                    disabled={processingId === app.id}
                    className="px-4 py-2 bg-white hover:bg-rose-50 text-rose-600 text-xs font-semibold rounded-full border border-rose-200 transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectingAppId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">
              Decline Host Application
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Provide feedback for the applicant explaining why their listing cannot be approved at this time.
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Does not meet minimum photographic resolution guidelines..."
              className="w-full mt-4 text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
            />

            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => setRejectingAppId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-full shadow-sm transition"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
