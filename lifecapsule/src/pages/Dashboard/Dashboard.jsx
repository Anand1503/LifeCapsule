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
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalQueries: 0,
    avgEntryLength: 0,
    moodTrend: 'neutral'
  });

  const [chartData, setChartData] = useState({
    entriesOverTime: [],
    moodDistribution: [],
    activityData: []
  });

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalEntries: 24,
        totalQueries: 8,
        avgEntryLength: 342,
        moodTrend: 'positive'
      });

      setChartData({
        entriesOverTime: [
          { date: '2024-01-01', entries: 2 },
          { date: '2024-01-02', entries: 1 },
          { date: '2024-01-03', entries: 3 },
          { date: '2024-01-04', entries: 2 },
          { date: '2024-01-05', entries: 4 },
          { date: '2024-01-06', entries: 3 },
          { date: '2024-01-07', entries: 2 },
        ],
        moodDistribution: [
          { name: 'Happy', value: 45, color: '#10b981' },
          { name: 'Neutral', value: 30, color: '#6b7280' },
          { name: 'Reflective', value: 15, color: '#3b82f6' },
          { name: 'Thoughtful', value: 10, color: '#8b5cf6' },
        ],
        activityData: [
          { day: 'Mon', entries: 3, queries: 1 },
          { day: 'Tue', entries: 2, queries: 0 },
          { day: 'Wed', entries: 4, queries: 2 },
          { day: 'Thu', entries: 3, queries: 1 },
          { day: 'Fri', entries: 5, queries: 2 },
          { day: 'Sat', entries: 4, queries: 1 },
          { day: 'Sun', entries: 3, queries: 1 },
        ]
      });
    }, 1000);
  }, []);

  const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm flex items-center mt-1 ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp size={16} className="mr-1" />
              {trend === 'up' ? 'Increasing' : 'Decreasing'}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon size={24} className={`text-${color}-600`} />
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
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
          trend="up"
          color="green"
        />
        <StatCard
          title="Assistant Queries"
          value={stats.totalQueries}
          icon={MessageSquare}
          trend="up"
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
          value={stats.moodTrend}
          icon={Activity}
          color="orange"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Entries Over Time */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Entries Over Time</h3>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mood Distribution</h3>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
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
    </motion.div>
  );
};

export default Dashboard;
