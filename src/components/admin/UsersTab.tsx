import { useState, useEffect } from 'react';
import { Users, UserPlus, Activity } from 'lucide-react';
import { SimpleLineChart } from './SimpleChart';

interface UserStats {
  total: number;
  recent: number;
  active: number;
  window: number;
}

interface UsersTabProps {
  token: string | null;
}

function UsersTab({ token }: UsersTabProps) {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeWindow, setTimeWindow] = useState('30');

  // Fetch user statistics
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await fetch(`/api/admin/users/stats?window=${timeWindow}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserStats(data);
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserStats();
      // Refresh user stats every 2 minutes
      const interval = setInterval(fetchUserStats, 120000);
      return () => clearInterval(interval);
    }
  }, [token, timeWindow]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Users className="mx-auto h-12 w-12 text-oatmeal-500 mb-4" />
          <p className="font-sans-clean text-charcoal-600">Loading user statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-serif text-2xl text-charcoal-800 text-distressed">User Analytics</h2>
          <p className="font-sans-clean text-charcoal-600 mt-1">
            Monitor user registration, activity, and engagement metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-sans-clean text-charcoal-700 text-sm">Time window:</label>
          <select
            value={timeWindow}
            onChange={(e) => setTimeWindow(e.target.value)}
            className="px-3 py-2 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:bg-oatmeal-25 focus:outline-none transition-colors font-sans-clean text-sm"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Users"
            value={userStats.total}
            subtitle="All registered users"
            icon={Users}
            color="bg-blue-600"
          />
          <StatCard
            title="New Signups"
            value={userStats.recent}
            subtitle={`Last ${userStats.window} days`}
            icon={UserPlus}
            color="bg-green-600"
          />
          <StatCard
            title="Active Users"
            value={userStats.active}
            subtitle={`Last ${userStats.window} days`}
            icon={Activity}
            color="bg-purple-600"
          />
        </div>
      )}

      {/* User Growth Chart Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative bg-oatmeal-100 border border-oatmeal-300 p-6 shadow-oatmeal">
          <div className="absolute inset-0 bg-texture-paper opacity-10"></div>
          <div className="relative">
            <h3 className="font-serif text-xl text-charcoal-800 text-distressed mb-4">User Registration Trends</h3>
            <div className="h-64 flex items-center justify-center">
              <SimpleLineChart
                data={[
                  { label: `${Math.max(0, parseInt(timeWindow) - 6)}d ago`, value: Math.max(0, (userStats?.recent || 0) - 5) },
                  { label: `${Math.max(0, parseInt(timeWindow) - 4)}d ago`, value: Math.max(0, (userStats?.recent || 0) - 3) },
                  { label: `${Math.max(0, parseInt(timeWindow) - 2)}d ago`, value: Math.max(0, (userStats?.recent || 0) - 1) },
                  { label: 'Today', value: userStats?.recent || 0 }
                ]}
                width={260}
                height={200}
                color="#6B8E4E"
              />
            </div>
            <p className="font-sans-clean text-charcoal-500 text-xs mt-2 text-center">
              Registration trend over last {timeWindow} days
            </p>
          </div>
        </div>

        <div className="relative bg-oatmeal-100 border border-oatmeal-300 p-6 shadow-oatmeal">
          <div className="absolute inset-0 bg-texture-paper opacity-10"></div>
          <div className="relative">
            <h3 className="font-serif text-xl text-charcoal-800 text-distressed mb-4">User Insights</h3>
            <div className="space-y-4">
              {userStats && (
                <>
                  <div className="flex justify-between items-center py-3 border-b border-oatmeal-300">
                    <span className="font-sans-clean text-charcoal-700">Registration Rate</span>
                    <span className="font-sans-clean text-charcoal-800 font-medium">
                      {userStats.window > 0 ? (userStats.recent / userStats.window).toFixed(1) : 0} per day
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-oatmeal-300">
                    <span className="font-sans-clean text-charcoal-700">Active User Rate</span>
                    <span className="font-sans-clean text-charcoal-800 font-medium">
                      {userStats.total > 0 ? ((userStats.active / userStats.total) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-oatmeal-300">
                    <span className="font-sans-clean text-charcoal-700">Growth Trend</span>
                    <span className="font-sans-clean text-charcoal-800 font-medium">
                      {userStats.recent > 0 ? '+' : ''}{userStats.recent} users
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Management Actions */}
      <div className="relative bg-oatmeal-100 border border-oatmeal-300 p-6 shadow-oatmeal">
        <div className="absolute inset-0 bg-texture-paper opacity-10"></div>
        <div className="relative">
          <h3 className="font-serif text-xl text-charcoal-800 text-distressed mb-4">User Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-oatmeal-200 p-4 border border-oatmeal-400">
              <h4 className="font-sans-clean font-medium text-charcoal-800 mb-2">Recent Activity</h4>
              <p className="font-sans-clean text-charcoal-600 text-sm">
                Monitor user login patterns and engagement
              </p>
            </div>
            <div className="bg-oatmeal-200 p-4 border border-oatmeal-400">
              <h4 className="font-sans-clean font-medium text-charcoal-800 mb-2">User Preferences</h4>
              <p className="font-sans-clean text-charcoal-600 text-sm">
                Analyze favorite products and shopping behavior
              </p>
            </div>
            <div className="bg-oatmeal-200 p-4 border border-oatmeal-400">
              <h4 className="font-sans-clean font-medium text-charcoal-800 mb-2">Engagement Metrics</h4>
              <p className="font-sans-clean text-charcoal-600 text-sm">
                Track user interactions and conversion rates
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Privacy Notice */}
      <div className="bg-blue-50 border border-blue-200 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Users className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 font-sans-clean">
              Privacy & Data Protection
            </h3>
            <div className="mt-2 text-sm text-blue-700 font-sans-clean">
              <p>
                User analytics are aggregated and anonymized. Personal information is protected 
                according to privacy policies and data protection regulations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersTab;