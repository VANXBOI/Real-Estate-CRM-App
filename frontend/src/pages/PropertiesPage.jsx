import { useEffect, useState } from 'react';
import api from '../services/api';

const TYPE_COLORS = {
  residential: 'bg-blue-100 text-blue-700',
  commercial:  'bg-orange-100 text-orange-700',
  plot:        'bg-green-100 text-green-700',
  villa:       'bg-purple-100 text-purple-700',
};
const STATUS_COLORS = {
  Available:           'bg-green-100 text-green-700',
  Sold:                'bg-gray-100 text-gray-600',
  Rented:              'bg-yellow-100 text-yellow-700',
  'Under Negotiation': 'bg-red-100 text-red-700',
};
const EMPTY = { title:'', type:'residential', location:'', price:'', size_sqft:'', bedrooms:'', bathrooms:'', amenities:'' };
const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
const Field = ({ label, children }) => (
  <div><label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>{children}</div>
);

export default function PropertiesPage() {
  const [properties,   setProperties]  = useState([]);
  const [showForm,     setShowForm]    = useState(false);
  const [form,         setForm]        = useState(EMPTY);
  const [saving,       setSaving]      = useState(false);
  const [filterType,   setFilterType]  = useState('All');
  const [filterStatus, setFilterStatus]= useState('All');
  const [editId,       setEditId]      = useState(null);

  const load = () => api.get('/properties').then(r => setProperties(r.data)).catch(()=>{});
  useEffect(()=>{ load(); },[]);

  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const openNew = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const openEdit = (p) => {
    setForm({ title:p.title, type:p.type, location:p.location, price:p.price,
              size_sqft:p.size_sqft, bedrooms:p.bedrooms, bathrooms:p.bathrooms,
              amenities:p.amenities||'', status:p.status });
    setEditId(p.id); setShowForm(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      editId ? await api.put(`/properties/${editId}`, form) : await api.post('/properties', form);
      setShowForm(false); load();
    } catch(err){ alert(err.response?.data?.error||'Failed'); } finally { setSaving(false); }
  };
  const handleDelete = async (id) => {
    if(!window.confirm('Delete this property?')) return;
    await api.delete(`/properties/${id}`); load();
  };

  const filtered = properties.filter(p =>
    (filterType==='All'||p.type===filterType) && (filterStatus==='All'||p.status===filterStatus)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Properties</h2>
        <button onClick={openNew} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg">+ Add Property</button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['All','residential','commercial','plot','villa'].map(t=>(
          <button key={t} onClick={()=>setFilterType(t)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium border transition ${filterType===t?'bg-blue-600 text-white border-blue-600':'bg-white text-gray-600 border-gray-200 hover:border-blue-400'}`}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
        <div className="w-px bg-gray-200 mx-1"/>
        {['All','Available','Sold','Rented','Under Negotiation'].map(s=>(
          <button key={s} onClick={()=>setFilterStatus(s)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium border transition ${filterStatus===s?'bg-gray-800 text-white border-gray-800':'bg-white text-gray-600 border-gray-200'}`}>
            {s}
          </button>
        ))}
      </div>

      {filtered.length===0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🏠</p><p className="font-medium">No properties found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(p=>(
            <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">{p.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">📍 {p.location||'—'}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-2 shrink-0 ${STATUS_COLORS[p.status]}`}>{p.status}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[p.type]}`}>{p.type}</span>
              <p className="text-xl font-bold text-gray-900 my-3">₹{Number(p.price||0).toLocaleString('en-IN')}</p>
              <div className="flex gap-4 text-xs text-gray-500 mb-4">
                {p.bedrooms&&<span>🛏 {p.bedrooms} bed</span>}
                {p.bathrooms&&<span>🚿 {p.bathrooms} bath</span>}
                {p.size_sqft&&<span>📐 {Number(p.size_sqft).toLocaleString()} sqft</span>}
              </div>
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button onClick={()=>openEdit(p)} className="flex-1 text-xs text-blue-600 hover:bg-blue-50 py-1.5 rounded-lg font-medium">Edit</button>
                <button onClick={()=>handleDelete(p.id)} className="flex-1 text-xs text-red-500 hover:bg-red-50 py-1.5 rounded-lg font-medium">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm&&(
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-y-auto max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-lg">{editId?'Edit Property':'Add Property'}</h3>
              <button onClick={()=>setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Field label="Title *"><input required className={inputCls} value={form.title} onChange={e=>set('title',e.target.value)}/></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Type">
                  <select className={inputCls} value={form.type} onChange={e=>set('type',e.target.value)}>
                    {['residential','commercial','plot','villa'].map(t=><option key={t}>{t}</option>)}
                  </select>
                </Field>
                {editId&&<Field label="Status">
                  <select className={inputCls} value={form.status} onChange={e=>set('status',e.target.value)}>
                    {['Available','Sold','Rented','Under Negotiation'].map(s=><option key={s}>{s}</option>)}
                  </select>
                </Field>}
              </div>
              <Field label="Location"><input className={inputCls} value={form.location} onChange={e=>set('location',e.target.value)}/></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Price (₹)"><input type="number" className={inputCls} value={form.price} onChange={e=>set('price',e.target.value)}/></Field>
                <Field label="Size (sqft)"><input type="number" className={inputCls} value={form.size_sqft} onChange={e=>set('size_sqft',e.target.value)}/></Field>
                <Field label="Bedrooms"><input type="number" min="0" className={inputCls} value={form.bedrooms} onChange={e=>set('bedrooms',e.target.value)}/></Field>
                <Field label="Bathrooms"><input type="number" min="0" className={inputCls} value={form.bathrooms} onChange={e=>set('bathrooms',e.target.value)}/></Field>
              </div>
              <Field label="Amenities"><textarea rows={2} className={inputCls} placeholder="e.g. Parking, Gym" value={form.amenities} onChange={e=>set('amenities',e.target.value)}/></Field>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={()=>setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium disabled:opacity-60">
                  {saving?'Saving...':editId?'Update':'Add Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
