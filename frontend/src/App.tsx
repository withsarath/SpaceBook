import { useEffect, useState } from 'react';
import type { User, Workspace } from './types';
import { authApi, workspacesApi, setToken, getToken } from './api';
import { Navbar } from './components/Navbar';
import { WorkspaceList } from './components/WorkspaceList';
import { WorkspaceModal } from './components/WorkspaceModal';
import { AuthModal } from './components/AuthModal';
import { MyBookingsView } from './components/MyBookingsView';
import { BecomeOwnerView } from './components/BecomeOwnerView';
import { OwnerDashboardView } from './components/OwnerDashboardView';
import { AdminDashboardView } from './components/AdminDashboardView';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('explore');
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(true);

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
      setWorkspaces(data);
    } catch (err) {
      console.error('Failed to load workspaces:', err);
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onQuickLogin={handleQuickLogin}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
            <p className="text-sm text-slate-400 font-medium">
              Initializing SpaceBook...
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'explore' && (
              <WorkspaceList
                workspaces={workspaces}
                onSelectWorkspace={(workspace) => setSelectedWorkspace(workspace)}
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

      {/* Workspace Booking & Detail Modal */}
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

      {/* Sign In / Register Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              S
            </div>
            <span className="font-semibold text-slate-300">SpaceBook Platform</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>

          <p className="flex items-center gap-1 text-slate-400">
            Engineered with simplicity & junior-friendly architecture
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
