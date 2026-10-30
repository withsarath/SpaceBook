import { useEffect, useState, useRef } from 'react';
import type { User, Workspace } from './types';
import { authApi, workspacesApi, setToken, getToken } from './api';
import { enrichWorkspace, CURATED_FALLBACK_SPACES } from './utils/workspaceHelpers';
import { Navbar } from './components/Navbar';
import { WorkspaceList } from './components/WorkspaceList';
import { WorkspaceModal } from './components/WorkspaceModal';
import { AuthModal } from './components/AuthModal';
import { MyBookingsView } from './components/MyBookingsView';
import { BecomeOwnerView } from './components/BecomeOwnerView';
import { OwnerDashboardView } from './components/OwnerDashboardView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { Layers, Globe } from 'lucide-react';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('explore');
  const [workspaces, setWorkspaces] = useState<Workspace[]>(CURATED_FALLBACK_SPACES);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(true);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // 1. Initial data loading on app load
  useEffect(() => {
    const initApp = async () => {
      // Check if user is already logged in with stored token
      const token = getToken();
      if (token) {
        try {
          const profile = await authApi.getMe();
          setCurrentUser(profile);
        } catch (err) {
          console.warn('Session expired or invalid token:', err);
          setToken(null);
        }
      }

      // Load workspaces
      await loadWorkspaces();
      setLoading(false);
    };

    initApp();
  }, []);

  const loadWorkspaces = async () => {
    try {
      const data = await workspacesApi.getAll();
      if (data && data.length > 0) {
        const enriched = data.map(enrichWorkspace);
        setWorkspaces(enriched);
      } else {
        // Fallback to curated realistic spaces if DB hasn't been seeded yet
        setWorkspaces(CURATED_FALLBACK_SPACES);
      }
    } catch (err) {
      console.warn('Backend unavailable, using curated spaces:', err);
      setWorkspaces(CURATED_FALLBACK_SPACES);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout errors
    } finally {
      setToken(null);
      setCurrentUser(null);
      setActiveTab('explore');
    }
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleQuickLogin = async (email: string) => {
    try {
      const res = await authApi.login(email, 'password123');
      setToken(res.accessToken);
      const user: User = {
        id: res.id,
        name: res.name,
        email: res.email,
        phone: res.phone,
        roles: res.roles || ['customer'],
      };
      setCurrentUser(user);

      // Helpful tab switch based on role
      if (user.roles.includes('admin')) {
        setActiveTab('admin-dashboard');
      } else if (user.roles.includes('owner')) {
        setActiveTab('owner-dashboard');
      } else {
        setActiveTab('explore');
      }
    } catch (err: any) {
      alert(`Could not sign in with demo account: ${err.message}`);
    }
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.roles.includes('admin')) {
      setActiveTab('admin-dashboard');
    } else if (user.roles.includes('owner')) {
      setActiveTab('owner-dashboard');
    }
  };

  const handleBookingSuccess = () => {
    setActiveTab('my-bookings');
  };

  const handleSearchFocus = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onQuickLogin={handleQuickLogin}
        onSearchClick={handleSearchFocus}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-36">
            <div className="w-10 h-10 border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4" />
            <p className="text-xs text-slate-500 font-semibold tracking-wide">
              Loading SpaceBook...
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'explore' && (
              <WorkspaceList
                workspaces={workspaces}
                onSelectWorkspace={(workspace) => setSelectedWorkspace(workspace)}
                searchInputRef={searchInputRef}
              />
            )}

            {activeTab === 'my-bookings' && (
              <MyBookingsView onBrowseSpaces={() => setActiveTab('explore')} />
            )}

            {activeTab === 'owner-dashboard' && <OwnerDashboardView />}

            {activeTab === 'become-owner' && (
              <BecomeOwnerView
                onSuccess={async () => {
                  const updated = await authApi.getMe();
                  setCurrentUser(updated);
                }}
              />
            )}

            {activeTab === 'admin-dashboard' && <AdminDashboardView />}
          </>
        )}
      </main>

      {/* Workspace Reservation Modal */}
      <WorkspaceModal
        workspace={selectedWorkspace}
        currentUser={currentUser}
        onClose={() => setSelectedWorkspace(null)}
        onBookingSuccess={handleBookingSuccess}
        onRequireAuth={() => {
          setSelectedWorkspace(null);
          handleOpenAuth('login');
        }}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Real Marketplace Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-12 text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100 text-xs">
            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-3">
                Explore Spaces
              </h4>
              <ul className="space-y-2">
                <li><button onClick={() => setActiveTab('explore')} className="hover:text-slate-900">Meeting Rooms in London</button></li>
                <li><button onClick={() => setActiveTab('explore')} className="hover:text-slate-900">Creative Studios in SF</button></li>
                <li><button onClick={() => setActiveTab('explore')} className="hover:text-slate-900">Quiet Focus Desks in Berlin</button></li>
                <li><button onClick={() => setActiveTab('explore')} className="hover:text-slate-900">Photo & Film Spaces</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-3">
                Hosting
              </h4>
              <ul className="space-y-2">
                <li><button onClick={() => setActiveTab('become-owner')} className="hover:text-slate-900">List Your Workspace</button></li>
                <li><a href="#" className="hover:text-slate-900">Host Protection Guarantee</a></li>
                <li><a href="#" className="hover:text-slate-900">Community Guidelines</a></li>
                <li><a href="#" className="hover:text-slate-900">Host Resources</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-3">
                SpaceBook
              </h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-slate-900">About Us</a></li>
                <li><a href="#" className="hover:text-slate-900">Newsroom</a></li>
                <li><a href="#" className="hover:text-slate-900">Careers</a></li>
                <li><a href="#" className="hover:text-slate-900">Trust & Safety</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-3">
                Support
              </h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-slate-900">Help Center</a></li>
                <li><a href="#" className="hover:text-slate-900">Cancellation Options</a></li>
                <li><a href="#" className="hover:text-slate-900">Report a Space</a></li>
                <li><a href="#" className="hover:text-slate-900">Accessibility</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                <Layers className="w-3.5 h-3.5 text-rose-500" />
              </div>
              <span className="font-bold text-slate-800">SpaceBook, Inc.</span>
              <span>&copy; {new Date().getFullYear()}</span>
              <span className="text-slate-300">·</span>
              <a href="#" className="hover:underline">Privacy</a>
              <span className="text-slate-300">·</span>
              <a href="#" className="hover:underline">Terms</a>
              <span className="text-slate-300">·</span>
              <a href="#" className="hover:underline">Sitemap</a>
            </div>

            <div className="flex items-center gap-4 font-semibold text-slate-700">
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> English (US)
              </span>
              <span>$ USD</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
