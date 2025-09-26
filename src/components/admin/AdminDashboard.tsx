import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Package, 
  Users, 
  TrendingUp, 
  Settings,
  ShoppingBag,
  AlertCircle,
  CheckCircle,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import InventoryTab from './InventoryTab';
import ProductsTab from './ProductsTab';
import UsersTab from './UsersTab';
import AnalyticsTab from './AnalyticsTab';

interface AdminDashboardProps {
  onLogout: () => void;
}

function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    soldProducts7d: 0,
    totalUsers: 0,
    signups7d: 0,
    events7d: 0
  });

  // Fetch dashboard overview stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/metrics', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDashboardStats({
            totalProducts: data.products.total,
            activeProducts: data.products.active,
            soldProducts7d: data.products.sold7d,
            totalUsers: data.users.total,
            signups7d: data.users.signups7d,
            events7d: data.activity.events7d
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    if (token) {
      fetchStats();
      // Refresh stats every 30 seconds
      const interval = setInterval(fetchStats, 30000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  const StatCard = ({ title, value, subtitle, icon: Icon, color }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: any;
    color: string;
  }) => (
    <div className="relative bg-oatmeal-100 border border-oatmeal-300 p-6 shadow-oatmeal">
      <div className="absolute inset-0 bg-texture-paper opacity-10"></div>
      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-sans-clean text-charcoal-600 text-sm font-medium">{title}</p>
            <p className="font-serif text-3xl font-bold text-charcoal-800 mt-2">{value}</p>
            {subtitle && (
              <p className="font-sans-clean text-charcoal-500 text-xs mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center`}>
            <Icon size={24} className="text-oatmeal-100" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <StatCard
                title="Active Products"
                value={dashboardStats.activeProducts}
                subtitle={`${dashboardStats.totalProducts} total products`}
                icon={Package}
                color="bg-oatmeal-600"
              />
              <StatCard
                title="Sales (7 days)"
                value={dashboardStats.soldProducts7d}
                subtitle="Products sold"
                icon={DollarSign}
                color="bg-green-600"
              />
              <StatCard
                title="Total Users"
                value={dashboardStats.totalUsers}
                subtitle={`${dashboardStats.signups7d} new this week`}
                icon={Users}
                color="bg-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <div className="relative bg-oatmeal-100 border border-oatmeal-300 p-6 shadow-oatmeal">
                <div className="absolute inset-0 bg-texture-paper opacity-10"></div>
                <div className="relative">
                  <h3 className="font-serif text-xl text-charcoal-800 text-distressed mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveTab('products')}
                      className="w-full text-left bg-oatmeal-200 hover:bg-oatmeal-300 p-4 border border-oatmeal-400 transition-colors flex items-center gap-3"
                    >
                      <ShoppingBag size={20} className="text-oatmeal-700" />
                      <span className="font-sans-clean text-charcoal-700">Add New Product</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('inventory')}
                      className="w-full text-left bg-oatmeal-200 hover:bg-oatmeal-300 p-4 border border-oatmeal-400 transition-colors flex items-center gap-3"
                    >
                      <Package size={20} className="text-oatmeal-700" />
                      <span className="font-sans-clean text-charcoal-700">Manage Inventory</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className="w-full text-left bg-oatmeal-200 hover:bg-oatmeal-300 p-4 border border-oatmeal-400 transition-colors flex items-center gap-3"
                    >
                      <TrendingUp size={20} className="text-oatmeal-700" />
                      <span className="font-sans-clean text-charcoal-700">View Analytics</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative bg-oatmeal-100 border border-oatmeal-300 p-6 shadow-oatmeal">
                <div className="absolute inset-0 bg-texture-paper opacity-10"></div>
                <div className="relative">
                  <h3 className="font-serif text-xl text-charcoal-800 text-distressed mb-4">System Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="font-sans-clean text-charcoal-700">Inventory System</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="font-sans-clean text-charcoal-700">Analytics Tracking</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="font-sans-clean text-charcoal-700">User Management</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <AlertCircle size={16} className="text-yellow-600" />
                      <span className="font-sans-clean text-charcoal-700">Payment Gateway (Setup Required)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'inventory':
        return <InventoryTab token={token} />;
      case 'products':
        return <ProductsTab token={token} />;
      case 'users':
        return <UsersTab token={token} />;
      case 'analytics':
        return <AnalyticsTab token={token} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8 overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 bg-texture-paper opacity-10"></div>
        
        <div className="relative bg-oatmeal-100 border border-oatmeal-300 shadow-oatmeal">
          {/* Header */}
          <div className="border-b border-oatmeal-300 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-serif text-4xl text-charcoal-800 text-distressed">
                  Admin Dashboard
                </h1>
                <p className="font-sans-clean text-charcoal-600 mt-2">
                  Manage your Originals Store inventory, products, and analytics
                </p>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 bg-oatmeal-300 hover:bg-oatmeal-400 text-charcoal-700 font-sans-clean font-medium px-4 py-2 transition-colors"
              >
                <Settings size={16} />
                Logout
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-oatmeal-300">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 font-sans-clean font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'border-oatmeal-600 text-oatmeal-700'
                        : 'border-transparent text-charcoal-600 hover:text-charcoal-800 hover:border-oatmeal-300'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;