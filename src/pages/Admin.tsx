import Layout from '../components/Layout';
import { Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from '../components/admin/AdminDashboard';

function Admin() {
  // Get authentication state from AuthContext
  const { isAuthenticated, isAdmin, logout } = useAuth();

  // Redirect if not admin
  if (isAuthenticated && !isAdmin) {
    return (
      <Layout>
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="font-serif text-2xl text-charcoal-800 mb-4">Access Denied</h1>
            <p className="font-sans-clean text-charcoal-600">You do not have admin privileges.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const handleLogout = () => {
    logout();
  };

  // Authentication screen
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="relative">
            <div className="absolute inset-0 bg-texture-paper opacity-10"></div>
            
            <div className="relative bg-oatmeal-100 border border-oatmeal-300 p-8 shadow-oatmeal">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-oatmeal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield size={28} className="text-oatmeal-100" />
                </div>
                <h1 className="font-serif text-2xl text-charcoal-800 text-distressed mb-2">
                  Admin Access Required
                </h1>
                <p className="font-sans-clean text-charcoal-600 text-sm">
                  Please sign in with your admin account to access the product management system.
                </p>
                <div className="mt-4">
                  <a href="/signin" className="font-sans-clean text-oatmeal-600 hover:text-oatmeal-700 underline">
                    Go to Sign In
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <AdminDashboard onLogout={handleLogout} />
    </Layout>
  );
}

export default Admin;