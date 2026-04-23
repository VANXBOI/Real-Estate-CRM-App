import { useEffect, useState } from 'react';
import api from '../services/api';

const STAGES = ['Negotiation','Agreement','Closed','Cancelled'];
const STAGE_COLORS = {
  Negotiation: 'bg-yellow-50 border-yellow-200',
  Agreement:   'bg-blue-50 border-blue-200',
  Closed:      'bg-green-50 border-green-200',
  Cancelled:   'bg-gray-50 border-gray-200',
};
const STAGE_HEADER = {
  Negotiation: 'bg-yellow-100 text-yellow-800',
  Agreement:   'bg-blue-100 text-blue-800',
  Closed:      'bg-green-100 text-green-800',
  Cancelled:   'bg-gray-100 text-gray-600',
};
const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
const Field = ({ label, children }) => (
  <div><label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>{children}</div>
);
const EMPTY = { title:'', client_id:'', property_id:'', deal_value:'', commission_pct:'2', notes:'' };

export default function DealsPage() {
  const [kanban,     setKanban]    = useState({ Negotiation:[], Agreement:[], Closed:[], Cancelled:[] });
  const [clients,    setClients]   = useState([]);
  const [properties, setProps]     = useState([]);
  const [showForm,   setShowForm]  = useState(false);
  const [form,       setForm]      = useState(EMPTY);
  const [saving,     setSaving]    = useState(false);
  const [summary,    setSummary]   = useState(null);

  const load = async () => {
    const [d, c, p, s] = await Promise.all([
      api.get('/deals').catch(()=>({ data:{ kanban:{Negotiation:[],Agreement:[],Closed:[],Cancelled:[]}, list:[] } })),
      api.get('/clients').catch(()=>({ data:[] })),
      api.get('/properties').catch(()=>({ data:[] })),
      api.get('/deals/reports/summary').catch(()=>({ data:null })),
    ]);
    setKanban(d.data.kanban);
    setClients(c.data);
    setProps(p.data);
    setSummary(s.data);
  };
  useEffect(()=>{ load(); },[]);

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.post('/deals', form);
      setShowForm(false); setForm(EMPTY); load();
    } catch(err){ alert(err.response?.data?.error||'Failed'); } finally{ setSaving(false); }
  };

  const moveStage = async (id, stage) => {
    await api.put(`/deals/${id}/stage`, { stage }).catch(()=>{});
    load();
  };

  const fmt = (n) => n ? `₹${Number(n).toLocaleString('en-IN')}` : '—';

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Deals Pipeline</h2>
        <button onClick={()=>setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg">+ New Deal</button>
      </div>

      {/* Summary bar */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label:'Total Deals',     value: summary.total_deals },
            { label:'Closed',          value: summary.closed_deals },
            { label:'Revenue',         value: fmt(summary.total_revenue) },
            { label:'Close Rate',      value: summary.close_rate_pct ? `${summary.close_rate_pct}%` : '0%' },
          ].map(s=>(
            <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-xl font-bold text-gray-800 mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Kanban board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAGES.map(stage => (
          <div key={stage} className={`rounded-xl border p-4 ${STAGE_COLORS[stage]}`}>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 ${STAGE_HEADER[stage]}`}>
              {stage} <span className="font-normal opacity-70">({kanban[stage]?.length||0})</span>
            </div>

            <div className="space-y-3 min-h-[120px]">
              {(kanban[stage]||[]).map(deal=>(
                <div key={deal.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <p className="font-semibold text-sm text-gray-800 mb-1">{deal.title||'Untitled Deal'}</p>
                  <p className="text-xs text-gray-500 mb-0.5">👤 {deal.client_name||'—'}</p>
                  <p className="text-xs text-gray-500 mb-2">🏠 {deal.property_title||'—'}</p>
                  <p className="text-sm font-bold text-gray-900 mb-3">{fmt(deal.deal_value)}</p>
                  {deal.commission_amt && (
                    <p className="text-xs text-green-600 mb-3">Commission: {fmt(deal.commission_amt)}</p>
                  )}

                  {/* Move stage buttons */}
                  <div className="flex gap-1 flex-wrap">
                    {STAGES.filter(s=>s!==stage).map(s=>(
                      <button key={s} onClick={()=>moveStage(deal.id,s)}
                        className="text-xs px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition">
                        → {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {(kanban[stage]||[]).length===0 && (
                <p className="text-xs text-center text-gray-400 py-6">No deals here</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Deal modal */}
      {showForm&&(
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-lg">New Deal</h3>
              <button onClick={()=>setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Field label="Deal Title *"><input required className={inputCls} value={form.title} onChange={e=>set('title',e.target.value)}/></Field>
              <Field label="Client">
                <select className={inputCls} value={form.client_id} onChange={e=>set('client_id',e.target.value)}>
                  <option value="">Select client...</option>
                  {clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Property">
                <select className={inputCls} value={form.property_id} onChange={e=>set('property_id',e.target.value)}>
                  <option value="">Select property...</option>
                  {properties.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Deal Value (₹)"><input type="number" className={inputCls} value={form.deal_value} onChange={e=>set('deal_value',e.target.value)}/></Field>
                <Field label="Commission %"><input type="number" step="0.1" className={inputCls} value={form.commission_pct} onChange={e=>set('commission_pct',e.target.value)}/></Field>
              </div>
              <Field label="Notes"><textarea rows={2} className={inputCls} value={form.notes} onChange={e=>set('notes',e.target.value)}/></Field>
              <div className="flex gap-3">
                <button type="button" onClick={()=>setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm disabled:opacity-60">
                  {saving?'Creating...':'Create Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
