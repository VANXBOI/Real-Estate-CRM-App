import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', background:'linear-gradient(135deg,#1a2a6c 0%,#3b5bdb 100%)' }}>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'60px 80px', color:'white' }}>
        <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:52, lineHeight:1.1, marginBottom:20 }}>
          Your Real Estate<br/>Operations Hub
        </h1>
        <p style={{ fontSize:16, opacity:0.7, maxWidth:380, lineHeight:1.7 }}>
          Manage leads, close deals, and track your team — all in one place.
        </p>
        <div style={{ display:'flex', gap:40, marginTop:48 }}>
          {[['500+','Leads tracked'],['98%','Uptime'],['3x','Faster closings']].map(([num,label]) => (
            <div key={label}>
              <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:32 }}>{num}</div>
              <div style={{ fontSize:13, opacity:0.55, marginTop:4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ width:460, background:'white', display:'flex', flexDirection:'column', justifyContent:'center', padding:'60px 48px' }}>
        <div style={{ marginBottom:36 }}>
          <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:26, color:'#1a2a6c' }}>
            Prop<span style={{ color:'#3b5bdb' }}>CRM</span>
          </span>
          <h2 style={{ fontSize:22, fontWeight:600, marginTop:20, color:'#111827' }}>Sign in to your account</h2>
          <p style={{ fontSize:14, color:'#6b7280', marginTop:6 }}>Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:8, padding:'10px 14px', marginBottom:16, fontSize:13, color:'#991b1b' }}>{error}</div>
          )}
          {[
            { label:'Email address', key:'email',    type:'email',    placeholder:'you@company.com' },
            { label:'Password',      key:'password', type:'password', placeholder:'••••••••' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key} style={{ marginBottom:18 }}>
              <label style={{ display:'block', fontSize:13, fontWeight:500, color:'#374151', marginBottom:6 }}>{label}</label>
              <input
                type={type} placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                required
                style={{ width:'100%', padding:'10px 14px', fontSize:14, border:'1.5px solid #e5e7eb', borderRadius:8, outline:'none', fontFamily:'inherit' }}
                onFocus={e => e.target.style.borderColor='#3b5bdb'}
                onBlur={e  => e.target.style.borderColor='#e5e7eb'}
              />
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ width:'100%', padding:12, marginTop:8, background:loading?'#93c5fd':'#3b5bdb', color:'white', border:'none', borderRadius:8, fontSize:15, fontWeight:600, cursor:loading?'not-allowed':'pointer', fontFamily:'inherit' }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p style={{ marginTop:24, fontSize:12, color:'#9ca3af', textAlign:'center' }}>Demo: admin@crm.com / admin123</p>
      </div>
    </div>
  );
}
