import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
    <div className={`text-3xl p-3 rounded-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value ?? '—'}</p>
    </div>
  </div>
);

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [leads,   setLeads]   = useState([]);

  useEffect(() => {
    api.get('/deals/reports/summary').then(r => setSummary(r.data)).catch(() => {});
    api.get('/leads').then(r => setLeads(r.data)).catch(() => {});
  }, []);

  // Count leads by status for the bar chart
  const leadChartData = ['New', 'Contacted', 'Qualified', 'Closed', 'Lost'].map(status => ({
    status,
    count: leads.filter(l => l.status === status).length
  }));

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name} 👋</h2>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Leads"     value={leads.length}            icon="🎯" color="bg-blue-50" />
        <StatCard label="Closed Deals"    value={summary?.closed_deals}   icon="🤝" color="bg-green-50" />
        <StatCard label="Total Revenue"   value={summary?.total_revenue ? `₹${Number(summary.total_revenue).toLocaleString('en-IN')}` : '₹0'} icon="💰" color="bg-yellow-50" />
        <StatCard label="Close Rate"      value={summary?.close_rate_pct ? `${summary.close_rate_pct}%` : '0%'} icon="📈" color="bg-purple-50" />
      </div>

      {/* Lead Status Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-700 mb-4">Leads by Status</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={leadChartData} barSize={36}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="status" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
