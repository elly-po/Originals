import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Search, 
  Heart, 
  Eye, 
  ShoppingCart,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { SimpleBarChart } from './SimpleChart';

interface AnalyticsData {
  users: {
    total: number;
    signups7d: number;
    signups30d: number;
    activeUsers7d: number;
  };
  products: {
    active: number;
    sold7d: number;
    sold30d: number;
    total: number;
  };
  categories: Array<{
    category: string;
    count: number;
  }>;
  searches: Array<{
    term: string;
    count: number;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    views: number;
    favorites: number;
    status: string;
  }>;
  activity: {
    events7d: number;
    uniqueUsers7d: number;
  };
}

interface AnalyticsTabProps {
  token: string | null;
}

function AnalyticsTab({ token }: AnalyticsTabProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/admin/metrics', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAnalyticsData(data);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAnalytics();
      // Refresh analytics every 2 minutes
      const interval = setInterval(fetchAnalytics, 120000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const MetricCard = ({ title, value, subtitle, icon: Icon, color, trend }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: any;
    color: string;
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <div className="relative bg-oatmeal-100 border border-oatmeal-300 p-6 shadow-oatmeal">
      <div className="absolute inset-0 bg-texture-paper opacity-10"></div>
      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-sans-clean text-charcoal-600 text-sm font-medium">{title}</p>
            <div className="flex items-center gap-2">
              <p className="font-serif text-3xl font-bold text-charcoal-800 mt-2">{value}</p>
              {trend && (
                <div className={`flex items-center ${
                  trend === 'up' ? 'text-green-600' : 
                  trend === 'down' ? 'text-red-600' : 'text-charcoal-500'
                }`}>
                  <TrendingUp 
                    size={16} 
                    className={trend === 'down' ? 'rotate-180' : ''} 
                  />
                </div>
              )}
            </div>
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-oatmeal-500 mb-4" />
          <p className="font-sans-clean text-charcoal-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="mx-auto h-12 w-12 text-oatmeal-400 mb-4" />
        <p className="font-sans-clean text-charcoal-600">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-serif text-2xl text-charcoal-800 text-distressed">Business Analytics</h2>
          <p className="font-sans-clean text-charcoal-600 mt-1">
            Track performance metrics, user behavior, and business insights
          </p>
        </div>
        <div className="text-right">
          <p className="font-sans-clean text-charcoal-500 text-sm">Last updated</p>
          <p className="font-sans-clean text-charcoal-700 text-sm font-medium">
            {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Events (7d)"
          value={analyticsData.activity.events7d}
          subtitle="User interactions"
          icon={Activity}
          color="bg-blue-600"
          trend="up"
        />
        <MetricCard
          title="Active Users (7d)"
          value={analyticsData.activity.uniqueUsers7d}
          subtitle="Unique visitors"
          icon={Eye}
          color="bg-green-600"
          trend="up"
        />
        <MetricCard
          title="Sales (7d)"
          value={analyticsData.products.sold7d}
          subtitle="Products sold"
          icon={ShoppingCart}
          color="bg-purple-600"
          trend="neutral"
        />
        <MetricCard
          title="Active Products"
          value={analyticsData.products.active}
          subtitle={`${analyticsData.products.total} total`}
          icon={BarChart3}
          color="bg-orange-600"
          trend="neutral"
        />
      </div>

      {/* Activity Chart */}
      <div className="relative bg-oatmeal-100 border border-oatmeal-300 p-6 shadow-oatmeal mb-6">
        <div className="absolute inset-0 bg-texture-paper opacity-10"></div>
        <div className="relative">
          <h3 className="font-serif text-xl text-charcoal-800 text-distressed mb-4 flex items-center gap-2">
            <Activity size={20} />
            Weekly Activity Overview
          </h3>
          <div className="flex justify-center">
            <SimpleBarChart
              data={[
                { label: 'Users', value: analyticsData.activity.uniqueUsers7d, color: '#6B8E4E' },
                { label: 'Events', value: Math.floor(analyticsData.activity.events7d / 10), color: '#8B7355' },
                { label: 'Sales', value: analyticsData.products.sold7d, color: '#A0522D' },
                { label: 'Active', value: analyticsData.products.active, color: '#556B2F' }
              ]}
              width={350}
              height={200}
            />
          </div>
          <p className="font-sans-clean text-charcoal-500 text-xs mt-2 text-center">
            Key metrics comparison (Events scaled down 10x for visibility)
          </p>
        </div>
      </div>

      {/* Charts and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Search Terms */}
        <div className="relative bg-oatmeal-100 border border-oatmeal-300 p-6 shadow-oatmeal">
          <div className="absolute inset-0 bg-texture-paper opacity-10"></div>
          <div className="relative">
            <h3 className="font-serif text-xl text-charcoal-800 text-distressed mb-4 flex items-center gap-2">
              <Search size={20} />
              Top Search Terms
            </h3>
            <div className="space-y-3">
              {analyticsData.searches.length > 0 ? (
                analyticsData.searches.slice(0, 10).map((search, index) => (
                  <div key={search.term} className="flex justify-between items-center py-2 border-b border-oatmeal-300 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-oatmeal-600 text-oatmeal-100 rounded-full flex items-center justify-center text-xs font-sans-clean">
                        {index + 1}
                      </span>
                      <span className="font-sans-clean text-charcoal-700">{search.term}</span>
                    </div>
                    <span className="font-sans-clean text-charcoal-600 text-sm">{search.count} searches</span>
                  </div>
                ))
              ) : (
                <p className="font-sans-clean text-charcoal-500 italic">No search data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="relative bg-oatmeal-100 border border-oatmeal-300 p-6 shadow-oatmeal">
          <div className="absolute inset-0 bg-texture-paper opacity-10"></div>
          <div className="relative">
            <h3 className="font-serif text-xl text-charcoal-800 text-distressed mb-4 flex items-center gap-2">
              <PieChart size={20} />
              Product Categories
            </h3>
            <div className="space-y-3">
              {analyticsData.categories.length > 0 ? (
                analyticsData.categories.slice(0, 8).map((category) => {
                  const percentage = (category.count / analyticsData.products.total * 100).toFixed(1);
                  return (
                    <div key={category.category} className="flex justify-between items-center py-2">
                      <span className="font-sans-clean text-charcoal-700 capitalize">
                        {category.category.replace('-', ' ')}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-oatmeal-300 rounded-full h-2">
                          <div 
                            className="bg-oatmeal-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="font-sans-clean text-charcoal-600 text-sm w-12 text-right">
                          {category.count}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="font-sans-clean text-charcoal-500 italic">No category data available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Products */}
      <div className="relative bg-oatmeal-100 border border-oatmeal-300 p-6 shadow-oatmeal">
        <div className="absolute inset-0 bg-texture-paper opacity-10"></div>
        <div className="relative">
          <h3 className="font-serif text-xl text-charcoal-800 text-distressed mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Top Performing Products
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-oatmeal-300">
                  <th className="text-left py-3 px-4 font-sans-clean text-charcoal-700 text-sm font-medium">Product</th>
                  <th className="text-left py-3 px-4 font-sans-clean text-charcoal-700 text-sm font-medium">Views</th>
                  <th className="text-left py-3 px-4 font-sans-clean text-charcoal-700 text-sm font-medium">Favorites</th>
                  <th className="text-left py-3 px-4 font-sans-clean text-charcoal-700 text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.topProducts.length > 0 ? (
                  analyticsData.topProducts.map((product) => (
                    <tr key={product.id} className="border-b border-oatmeal-200 hover:bg-oatmeal-50">
                      <td className="py-3 px-4 font-sans-clean text-charcoal-800">{product.name}</td>
                      <td className="py-3 px-4 font-sans-clean text-charcoal-600">
                        <span className="flex items-center gap-1">
                          <Eye size={14} />
                          {product.views}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans-clean text-charcoal-600">
                        <span className="flex items-center gap-1">
                          <Heart size={14} />
                          {product.favorites}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium font-sans-clean ${
                          product.status === 'active' ? 'bg-green-100 text-green-800' :
                          product.status === 'sold' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center font-sans-clean text-charcoal-500 italic">
                      No product performance data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative bg-oatmeal-100 border border-oatmeal-300 p-6 shadow-oatmeal">
          <div className="absolute inset-0 bg-texture-paper opacity-10"></div>
          <div className="relative">
            <h3 className="font-serif text-xl text-charcoal-800 text-distressed mb-4">User Engagement</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-oatmeal-300">
                <span className="font-sans-clean text-charcoal-700">Daily Active Users</span>
                <span className="font-sans-clean text-charcoal-800 font-medium">
                  {(analyticsData.activity.uniqueUsers7d / 7).toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-oatmeal-300">
                <span className="font-sans-clean text-charcoal-700">Events per User</span>
                <span className="font-sans-clean text-charcoal-800 font-medium">
                  {analyticsData.activity.uniqueUsers7d > 0 
                    ? (analyticsData.activity.events7d / analyticsData.activity.uniqueUsers7d).toFixed(1)
                    : '0'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-sans-clean text-charcoal-700">New User Rate</span>
                <span className="font-sans-clean text-charcoal-800 font-medium">
                  {analyticsData.users.total > 0 
                    ? ((analyticsData.users.signups7d / analyticsData.users.total) * 100).toFixed(1)
                    : '0'
                  }%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative bg-oatmeal-100 border border-oatmeal-300 p-6 shadow-oatmeal">
          <div className="absolute inset-0 bg-texture-paper opacity-10"></div>
          <div className="relative">
            <h3 className="font-serif text-xl text-charcoal-800 text-distressed mb-4">Business Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-oatmeal-300">
                <span className="font-sans-clean text-charcoal-700">Conversion Rate</span>
                <span className="font-sans-clean text-charcoal-800 font-medium">
                  {analyticsData.activity.uniqueUsers7d > 0 
                    ? ((analyticsData.products.sold7d / analyticsData.activity.uniqueUsers7d) * 100).toFixed(1)
                    : '0'
                  }%
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-oatmeal-300">
                <span className="font-sans-clean text-charcoal-700">Inventory Turnover</span>
                <span className="font-sans-clean text-charcoal-800 font-medium">
                  {analyticsData.products.active > 0 
                    ? ((analyticsData.products.sold30d / analyticsData.products.active) * 100).toFixed(1)
                    : '0'
                  }%
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-sans-clean text-charcoal-700">Active Product Ratio</span>
                <span className="font-sans-clean text-charcoal-800 font-medium">
                  {analyticsData.products.total > 0 
                    ? ((analyticsData.products.active / analyticsData.products.total) * 100).toFixed(1)
                    : '0'
                  }%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsTab;