import React from 'react';
import type { User } from '../types';
import { Building2, Calendar, Shield, Sparkles, UserCircle, LogOut, LogIn, Briefcase } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  onQuickLogin: (email: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  onQuickLogin,
}) => {
  const isOwner = currentUser?.roles?.includes('owner');
  const isAdmin = currentUser?.roles?.includes('admin');

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('explore')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                SpaceBook
              </span>
              <span className="block text-xs text-indigo-400 font-medium">
                Workspace Hub
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                activeTab === 'explore'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Explore Spaces
            </button>

            {currentUser && (
              <button
                onClick={() => setActiveTab('my-bookings')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  activeTab === 'my-bookings'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Calendar className="w-4 h-4" />
                My Bookings
              </button>
            )}

            {isOwner && (
              <button
                onClick={() => setActiveTab('owner-dashboard')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  activeTab === 'owner-dashboard'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Owner Hub
              </button>
            )}

            {currentUser && !isOwner && (
              <button
                onClick={() => setActiveTab('become-owner')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  activeTab === 'become-owner'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                Become an Owner
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin-dashboard')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  activeTab === 'admin-dashboard'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Shield className="w-4 h-4 text-rose-300" />
                Admin Panel
              </button>
            )}
          </nav>

          {/* User Auth and Demo Switcher */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700">
                  <UserCircle className="w-5 h-5 text-indigo-400" />
                  <span className="text-sm font-medium text-slate-200">
                    {currentUser.name}
                  </span>
                  <div className="flex gap-1 ml-1">
                    {currentUser.roles.map((r) => (
                      <span
                        key={r}
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                          r === 'admin'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : r === 'owner'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  title="Log out"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Quick Demo Switcher for fast testing */}
                <div className="relative group">
                  <button className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 transition flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Quick Demo Logins</span>
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-56 p-2 bg-slate-800 rounded-xl border border-slate-700 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                    <p className="text-[11px] text-slate-400 px-2 py-1 font-semibold uppercase">
                      One-Click Test Accounts:
                    </p>
                    <button
                      onClick={() => onQuickLogin('sarath@example.com')}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-700/80 rounded-lg flex items-center justify-between"
                    >
                      <span>Owner (Sarath)</span>
                      <span className="text-[10px] px-1 rounded bg-amber-500/20 text-amber-300">
                        Owner
                      </span>
                    </button>
                    <button
                      onClick={() => onQuickLogin('sarath5@example.com')}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-700/80 rounded-lg flex items-center justify-between"
                    >
                      <span>Admin (Sarath5)</span>
                      <span className="text-[10px] px-1 rounded bg-rose-500/20 text-rose-300">
                        Admin
                      </span>
                    </button>
                    <button
                      onClick={() => onQuickLogin('sarath4@example.com')}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-700/80 rounded-lg flex items-center justify-between"
                    >
                      <span>Customer (Sarath4)</span>
                      <span className="text-[10px] px-1 rounded bg-indigo-500/20 text-indigo-300">
                        Customer
                      </span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>

                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-3.5 py-1.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm transition"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
