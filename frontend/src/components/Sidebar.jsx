import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/',           label: 'Dashboard',   icon: '📊' },
  { to: '/leads',      label: 'Leads',       icon: '🎯' },
  { to: '/properties', label: 'Properties',  icon: '🏠' },
  { to: '/clients',    label: 'Clients',     icon: '👥' },
  { to: '/deals',      label: 'Deals',       icon: '🤝' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-200">
        <h1 className="text-lg font-bold text-blue-600">🏢 RealEstate CRM</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
               ${isActive
                 ? 'bg-blue-50 text-blue-700'
                 : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
            }
          >
            <span>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="px-4 py-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-1">Logged in as</p>
        <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
        <p className="text-xs text-blue-600 capitalize mb-3">{user?.role}</p>
        <button
          onClick={handleLogout}
          className="w-full text-sm text-red-500 hover:text-red-700 text-left"
        >
          Sign out →
        </button>
      </div>
    </aside>
  );
}
