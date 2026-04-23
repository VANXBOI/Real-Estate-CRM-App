import { useEffect, useState } from 'react';
import api from '../services/api';

const TYPE_COLORS = { buyer:'bg-blue-100 text-blue-700', seller:'bg-orange-100 text-orange-700', both:'bg-purple-100 text-purple-700' };
const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
const Field = ({ label, children }) => (
  <div><label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>{children}</div>
);
const EMPTY = { name:'', phone:'', email:'', type:'buyer', notes:'' };

export default function ClientsPage() {
  const [clients,  setClients]  = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [editId,   setEditId]   = useState(null);
  const [selected, setSelected] = useState(null); // for interaction log
  const [interactionForm, setInteractionForm] = useState({ type:'call', notes:'' });

  const load = () => api.get('/clients').then(r => setClients(r.data)).catch(()=>{});
  useEffect(()=>{ load(); },[]);

  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const openEdit = (c) => { setForm({name:c.name,phone:c.phone,email:c.email,type:c.type,notes:c.notes||''}); setEditId(c.id); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      editId ? await api.put(`/clients/${editId}`, form) : await api.post('/clients', form);
      setShowForm(false); setEditId(null); setForm(EMPTY); load();
    } catch(err){ alert(err.response?.data?.error||'Failed'); } finally{ setSaving(false); }
  };

  const logInteraction = async () => {
    if (!selected) return;
    await api.post(`/clients/${selected.id}/interactions`, interactionForm);
    setInteractionForm({ type:'call', notes:'' });
    alert('Interaction logged!');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Clients</h2>
        <button onClick={()=>{ setForm(EMPTY); setEditId(null); setShowForm(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg">+ Add Client</button>
      </div>

      {clients.length===0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">👥</p><p className="font-medium">No clients yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {clients.map(c=>(
            <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800">{c.name}</h3>
                  <p className="text-xs text-gray-500">{c.email||'—'}</p>
                  <p className="text-xs text-gray-500">{c.phone||'—'}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[c.type]||'bg-gray-100 text-gray-600'}`}>{c.type}</span>
              </div>
              {c.notes && <p className="text-xs text-gray-400 mt-2 line-clamp-2">{c.notes}</p>}
              <div className="flex gap-2 pt-3 border-t border-gray-100 mt-3">
                <button onClick={()=>openEdit(c)} className="flex-1 text-xs text-blue-600 hover:bg-blue-50 py-1.5 rounded-lg font-medium">Edit</button>
                <button onClick={()=>setSelected(c===selected?null:c)} className="flex-1 text-xs text-purple-600 hover:bg-purple-50 py-1.5 rounded-lg font-medium">Log Activity</button>
              </div>

              {selected?.id===c.id && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                  <select value={interactionForm.type} onChange={e=>setInteractionForm(f=>({...f,type:e.target.value}))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs">
                    {['call','email','sms','meeting','note'].map(t=><option key={t}>{t}</option>)}
                  </select>
                  <textarea rows={2} placeholder="Notes..." value={interactionForm.notes}
                    onChange={e=>setInteractionForm(f=>({...f,notes:e.target.value}))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs"/>
                  <button onClick={logInteraction} className="w-full bg-purple-600 text-white text-xs py-1.5 rounded-lg font-medium hover:bg-purple-700">Save Interaction</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm&&(
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-lg">{editId?'Edit Client':'Add Client'}</h3>
              <button onClick={()=>setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Field label="Name *"><input required className={inputCls} value={form.name} onChange={e=>set('name',e.target.value)}/></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Phone"><input className={inputCls} value={form.phone} onChange={e=>set('phone',e.target.value)}/></Field>
                <Field label="Email"><input type="email" className={inputCls} value={form.email} onChange={e=>set('email',e.target.value)}/></Field>
              </div>
              <Field label="Type">
                <select className={inputCls} value={form.type} onChange={e=>set('type',e.target.value)}>
                  {['buyer','seller','both'].map(t=><option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Notes"><textarea rows={2} className={inputCls} value={form.notes} onChange={e=>set('notes',e.target.value)}/></Field>
              <div className="flex gap-3">
                <button type="button" onClick={()=>setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm disabled:opacity-60">
                  {saving?'Saving...':editId?'Update':'Add Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
