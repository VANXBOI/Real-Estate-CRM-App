import { useEffect, useState } from 'react';
import api from '../services/api';

const STATUS_COLORS = {
  New:        'bg-blue-100 text-blue-700',
  Contacted:  'bg-yellow-100 text-yellow-700',
  Qualified:  'bg-purple-100 text-purple-700',
  Closed:     'bg-green-100 text-green-700',
  Lost:       'bg-red-100 text-red-700',
};

const EMPTY_FORM = { name: '', phone: '', email: '', budget: '', source: 'website', preferences: '' };

export default function LeadsPage() {
  const [leads,       setLeads]       = useState([]);
  const [showForm,    setShowForm]    = useState(false);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [saving,      setSaving]      = useState(false);
  const [filterStatus, setFilter]     = useState('All');

  const fetchLeads = () => api.get('/leads').then(r => setLeads(r.data)).catch(() => {});

  useEffect(() => { fetchLeads(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/leads', form);
      setForm(EMPTY_FORM);
      setShowForm(false);
      fetchLeads();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save lead');
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id, status) => {
    const lead = leads.find(l => l.id === id);
    await api.put(`/leads/${id}`, { ...lead, status });
    fetchLeads();
  };

  const filtered = filterStatus === 'All' ? leads : leads.filter(l => l.status === filterStatus);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Leads</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          + Add Lead
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['All', 'New', 'Contacted', 'Qualified', 'Closed', 'Lost'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors
              ${filterStatus === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              {['Name', 'Phone', 'Email', 'Budget', 'Source', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">No leads found</td></tr>
            ) : filtered.map(lead => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{lead.name}</td>
                <td className="px-4 py-3 text-gray-600">{lead.phone || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{lead.email || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{lead.budget ? `₹${Number(lead.budget).toLocaleString('en-IN')}` : '—'}</td>
                <td className="px-4 py-3 text-gray-600 capitalize">{lead.source || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status]}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={lead.status}
                    onChange={e => updateStatus(lead.id, e.target.value)}
                    className="text-xs border border-gray-300 rounded px-2 py-1 text-gray-600"
                  >
                    {['New', 'Contacted', 'Qualified', 'Closed', 'Lost'].map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Lead Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Lead</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Full Name *</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Phone</label>
                  <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Budget (₹)</label>
                  <input type="number" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Source</label>
                <select value={form.source} onChange={e => setForm({...form, source: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1">
                  {['website','ads','referral','call','walk-in','other'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Preferences</label>
                <textarea value={form.preferences} onChange={e => setForm({...form, preferences: e.target.value})}
                  rows={2} placeholder="e.g. 3BHK, South Delhi, near metro"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-60">
                  {saving ? 'Saving...' : 'Save Lead'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-300 text-gray-600 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
