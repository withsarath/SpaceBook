import React, { useState, useRef, useEffect } from 'react';
import type { User } from '../types';
import {
  Building2,
  Calendar,
  Shield,
  Sparkles,
  LogOut,
  Briefcase,
  Search,
  ChevronDown,
  Layers,
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  onQuickLogin: (email: string) => void;
  onSearchClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  onQuickLogin,
  onSearchClick,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);

  const isOwner = currentUser?.roles?.includes('owner');
  const isAdmin = currentUser?.roles?.includes('admin');

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (demoRef.current && !demoRef.current.contains(event.target as Node)) {
        setDemoMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
            onClick={() => setActiveTab('explore')}
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
              <Layers className="w-5 h-5 text-rose-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Space<span className="text-rose-500">Book</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-600 -mt-0.5">
                Workspace Collective
              </span>
            </div>
          </div>

          {/* Peerspace/Airbnb Style Search Pill (Desktop) */}
          <button
            onClick={() => {
              setActiveTab('explore');
              onSearchClick?.();
            }}
            className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 bg-white text-left group"
          >
            <span className="text-xs font-semibold text-slate-900 pl-1">
              Any City
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-xs font-medium text-slate-600">
              Any Capacity
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-xs font-medium text-slate-600">
              Desks & Studios
            </span>
            <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white ml-2 group-hover:scale-105 transition-transform">
              <Search className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Right Navigation & User Controls */}
          <div className="flex items-center gap-3">
            {/* Host CTA */}
            {currentUser && !isOwner && (
              <button
                onClick={() => setActiveTab('become-owner')}
                className={`hidden sm:inline-flex text-xs font-semibold px-3.5 py-2 rounded-full transition ${
                  activeTab === 'become-owner'
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                List your space
              </button>
            )}

            {isOwner && (
              <button
                onClick={() => setActiveTab('owner-dashboard')}
                className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                  activeTab === 'owner-dashboard'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-rose-500" />
                <span>Host Dashboard</span>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin-dashboard')}
                className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                  activeTab === 'admin-dashboard'
                    ? 'bg-rose-50 text-rose-700 border-rose-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-rose-500" />
                <span>Admin Console</span>
              </button>
            )}

            {/* Quick Demo Switcher */}
            <div className="relative" ref={demoRef}>
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="text-xs font-medium px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200 transition flex items-center gap-1.5"
                title="Switch demo account for testing"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden sm:inline">Demo Switcher</span>
                <span className="sm:hidden">Demo</span>
                <ChevronDown className="w-3 h-3 text-slate-600" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 p-2 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Role Profile
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Instant one-click authentication
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onQuickLogin('sarath@example.com');
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-50 flex items-center justify-between group transition"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        Sarath (Space Owner)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Manage listings & bookings
                      </p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      Owner
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      onQuickLogin('sarath5@example.com');
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-50 flex items-center justify-between group transition"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        Sarath (Platform Admin)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Review host applications
                      </p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      Admin
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      onQuickLogin('sarath4@example.com');
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-50 flex items-center justify-between group transition"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        Sarath (Guest / Customer)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Browse & reserve spaces
                      </p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Customer
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* User Pill / Login */}
            {currentUser ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:shadow-sm transition bg-white"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
                    {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {currentUser.email}
                      </p>
                      <div className="flex gap-1 mt-1.5">
                        {currentUser.roles.map((r) => (
                          <span
                            key={r}
                            className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-100 text-slate-700"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setActiveTab('explore');
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Building2 className="w-4 h-4 text-slate-400" />
                        Explore Spaces
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('my-bookings');
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4 text-slate-400" />
                        My Reservations
                      </button>

                      {isOwner && (
                        <button
                          onClick={() => {
                            setActiveTab('owner-dashboard');
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          Host Dashboard
                        </button>
                      )}

                      {isAdmin && (
                        <button
                          onClick={() => {
                            setActiveTab('admin-dashboard');
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Shield className="w-4 h-4 text-slate-400" />
                          Admin Console
                        </button>
                      )}

                      {!isOwner && (
                        <button
                          onClick={() => {
                            setActiveTab('become-owner');
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          List your space
                        </button>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-1 mt-1">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-full hover:bg-slate-100 transition"
                >
                  Log in
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-full shadow-sm transition"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
