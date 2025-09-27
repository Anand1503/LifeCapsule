import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Activity,
  FileText
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { fetchDashboardSummary } from '../../services/dashboardService';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalQueries: 0, // Note: Queries not tracked backend-side, keep 0 or mock
    avgEntryLength: 0,
    moodTrend: 'neutral'
  });

  const [chartData, setChartData] = useState({
    entriesOverTime: [],
    moodDistribution: [],
    activityData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardSummary();

        // Map stats
        setStats({
          totalEntries: data.total_entries,
          totalQueries: data.assistant_queries,
          avgEntryLength: data.avg_entry_length,
          moodTrend: data.mood_trend
        });

        // Map chart data
        const entriesOverTime = data.entries_over_time.map(item => ({
          date: item.date,
          entries: parseInt(item.entries)
        }));

        const moodDistribution = [
          { name: 'Positive', value: data.mood_distribution.positive, color: '#10b981' },
          { name: 'Neutral', value: data.mood_distribution.neutral, color: '#6b7280' },
          { name: 'Negative', value: data.mood_distribution.negative, color: '#ef4444' },
        ];

        const activityData = Object.entries(data.weekly_activity).map(([day, count]) => ({
          day,
          entries: count,
          queries: 0 // Since not tracked
        }));

        setChartData({
          entriesOverTime,
          moodDistribution,
          activityData
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to empty data
        setStats({
          totalEntries: 0,
          totalQueries: 0,
          avgEntryLength: 0,
          moodTrend: 'neutral'
        });
        setChartData({
          entriesOverTime: [],
          moodDistribution: [],
          activityData: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-black">{value}</p>
          {trend && (
            <p className={`text-sm flex items-center mt-1 ${
              trend === 'positive' ? 'text-green-600' : trend === 'negative' ? 'text-red-600' : 'text-gray-600'
            }`}>
              <TrendingUp size={16} className="mr-1" />
              {trend === 'positive' ? 'Positive' : trend === 'negative' ? 'Negative' : 'Neutral'}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon size={24} className={`text-${color}-600`} />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2 flex items-center">
          <BarChart3 className="mr-3" size={32} />
          Dashboard
        </h1>
        <p className="text-gray-600">
          Overview of your diary activity and insights.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Entries"
          value={stats.totalEntries}
          icon={BookOpen}
          trend={stats.moodTrend === 'positive' ? 'up' : 'down'}
          color="green"
        />
        <StatCard
          title="Assistant Queries"
          value={stats.totalQueries}
          icon={MessageSquare}
          color="blue"
        />
        <StatCard
          title="Avg Entry Length"
          value={`${stats.avgEntryLength} words`}
          icon={FileText}
          color="purple"
        />
        <StatCard
          title="Mood Trend"
          value={stats.moodTrend.charAt(0).toUpperCase() + stats.moodTrend.slice(1)}
          icon={Activity}
          color="orange"
        />
      </div>

      {stats.totalEntries === 0 ? (
        <div className="text-center py-12">
          <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No data available yet</h3>
          <p className="text-gray-500">Start writing your diary today!</p>
        </div>
      ) : (
        /* Charts Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Entries Over Time */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-black mb-4">Entries Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.entriesOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="entries"
                stroke="#374151"
                strokeWidth={3}
                dot={{ fill: '#374151', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#374151', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Mood Distribution */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-black mb-4">Mood Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.moodDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.moodDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Weekly Activity */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-black mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" tick={{ fontSize: 12 }} />
              <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="entries" fill="#374151" name="Entries" />
              <Bar dataKey="queries" fill="#10b981" name="Queries" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;
