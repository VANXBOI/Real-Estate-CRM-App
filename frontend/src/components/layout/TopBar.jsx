import { Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function TopBar({ title }) {
  const { user } = useAuth();

  return (
    <header style={{
      height: 60,
      background: 'var(--card)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <h1 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', position: 'relative', padding: 4,
        }}>
          <Bell size={19} />
          <span style={{
            position: 'absolute', top: 2, right: 2,
            width: 8, height: 8, background: '#ef4444',
            borderRadius: '50%', border: '1.5px solid white',
          }} />
        </button>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Welcome, <strong>{user?.name}</strong>
        </span>
      </div>
    </header>
  );
}
