import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, Building2, Handshake,
  UserCircle, BarChart3, LogOut
} from 'lucide-react';

const links = [
  { to: '/',           icon: LayoutDashboard, label: 'Dashboard'   },
  { to: '/leads',      icon: Users,           label: 'Leads'       },
  { to: '/properties', icon: Building2,       label: 'Properties'  },
  { to: '/deals',      icon: Handshake,       label: 'Deals'       },
  { to: '/clients',    icon: UserCircle,      label: 'Clients'     },
  { to: '/reports',    icon: BarChart3,       label: 'Reports'     },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside style={{
      width: 'var(--sidebar-w)',
      minHeight: '100vh',
      background: 'var(--brand-dark)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0, left: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <span style={{ fontFamily: "'DM Serif Display', serif", color: '#fff', fontSize: 22 }}>
          Prop<span style={{ color: '#93c5fd' }}>CRM</span>
        </span>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, marginTop: 3 }}>Real Estate Platform</p>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 8,
              marginBottom: 2,
              color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
              background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: isActive ? 600 : 400,
              transition: 'all 0.15s',
            })}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div style={{ padding: '16px 16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: '#3b5bdb', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 14,
          }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>{user?.name}</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, textTransform: 'capitalize' }}>{user?.role}</p>
          </div>
        </div>
        <button onClick={logout} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          color: 'rgba(255,255,255,0.5)', background: 'none',
          border: 'none', cursor: 'pointer', fontSize: 13, padding: '4px 0',
        }}>
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </aside>
  );
}
