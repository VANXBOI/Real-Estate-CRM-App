import { useEffect, useState } from 'react';
import TopBar from '../components/layout/TopBar';
import { leadsApi, dealsApi, propertiesApi } from '../services/api';
import { Users, Building2, Handshake, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const monthlyData = [
  { month: 'Aug', leads: 18, deals: 4 },
  { month: 'Sep', leads: 26, deals: 7 },
  { month: 'Oct', leads: 21, deals: 5 },
  { month: 'Nov', leads: 34, deals: 9 },
  { month: 'Dec', leads: 29, deals: 8 },
  { month: 'Jan', leads: 40, deals: 12 },
];

export default function Dashboard() {
  const [stats, setStats] = useState({ leads: 0, properties: 0, deals: 0 });

  useEffect(() => {
    Promise.all([leadsApi.getAll(), propertiesApi.getAll(), dealsApi.getAll()])
      .then(([l, p, d]) => setStats({ leads: l.data.length, properties: p.data.length, deals: d.data.length }))
      .catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Leads',      value: stats.leads,      icon: Users,      color: '#3b5bdb', bg: '#eff2ff' },
    { label: 'Properties',       value: stats.properties, icon: Building2,  color: '#0891b2', bg: '#ecfeff' },
    { label: 'Active Deals',     value: stats.deals,      icon: Handshake,  color: '#059669', bg: '#ecfdf5' },
    { label: 'Revenue (est.)',   value: '₹48L',           icon: TrendingUp, color: '#d97706', bg: '#fffbeb' },
  ];

  return (
    <div>
      <TopBar title="Dashboard" />
      <div style={{ padding: '28px 32px' }}>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 28 }}>
          {cards.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="card" style={{ display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ width:48, height:48, borderRadius:12, background:bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon size={22} color={color} />
              </div>
              <div>
                <p style={{ fontSize:13, color:'var(--text-muted)' }}>{label}</p>
                <p style={{ fontSize:26, fontWeight:700, color:'var(--text-primary)', lineHeight:1.2 }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="card">
          <h2 style={{ fontSize:16, fontWeight:600, marginBottom:20 }}>Leads vs Deals — Last 6 Months</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyData} barGap={4}>
              <XAxis dataKey="month" tick={{ fontSize:13 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius:8, border:'1px solid #e8ecf4', fontSize:13 }} />
              <Bar dataKey="leads" fill="#3b5bdb" radius={[4,4,0,0]} name="Leads" />
              <Bar dataKey="deals" fill="#93c5fd" radius={[4,4,0,0]} name="Deals" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
