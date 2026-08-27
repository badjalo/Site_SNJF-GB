import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const NAV = [
  { label: 'Dashboard',       path: '/admin',                icon: '📊' },
  { label: 'Notícias',        path: '/admin/noticias',       icon: '📰' },
  { label: 'Membros',         path: '/admin/membros',        icon: '👥' },
  { label: 'Contactos',       path: '/admin/contactos',      icon: '✉️' },
  { label: 'Configurações',   path: '/admin/configuracoes',  icon: '⚙️' },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('snj_admin_token');
    if (!token) { navigate('/admin/login'); return; }
    api.adminStats().then(setStats).catch(() => {});
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('snj_admin_token');
    navigate('/admin/login');
  };

  const isActive = (path) => path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);

  const S = {
    sidebar: {
      position: 'fixed', top: 0, left: 0, bottom: 0, width: 240,
      background: '#060A15', borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column', zIndex: 100,
      fontFamily: '"Inter", sans-serif',
      transition: 'transform 0.3s ease',
    },
    main: {
      marginLeft: 240, minHeight: '100vh', flex: 1, minWidth: 0,
      background: '#0D1627', fontFamily: '"Inter", sans-serif',
    },
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={S.sidebar}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', border: '2px solid #FCD116', overflow: 'hidden', flexShrink: 0 }}>
              <img src="/logo.png" alt="SNJF-GB" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ color: '#FCD116', fontWeight: 800, fontSize: 15, fontFamily: '"Playfair Display", serif' }}>SNJF-GB</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin Panel</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {NAV.map(({ label, path, icon }) => (
            <Link
              key={path}
              to={path}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '11px 14px', borderRadius: 10, marginBottom: 4,
                textDecoration: 'none', fontSize: 14, fontWeight: isActive(path) ? 700 : 500,
                color: isActive(path) ? '#FCD116' : 'rgba(255,255,255,0.6)',
                background: isActive(path) ? 'rgba(252,209,22,0.08)' : 'transparent',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!isActive(path)) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#fff'; } }}
              onMouseLeave={e => { if (!isActive(path)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; } }}
            >
              <span style={{ fontSize: 16 }}>{icon}</span>
              {label}
              {label === 'Membros' && stats.membrosPendentes > 0 && (
                <span style={{ marginLeft: 'auto', background: '#FCD116', color: '#000', fontSize: 10, fontWeight: 800, borderRadius: 20, padding: '2px 7px' }}>{stats.membrosPendentes}</span>
              )}
              {label === 'Contactos' && stats.contactosNaoLidos > 0 && (
                <span style={{ marginLeft: 'auto', background: '#CE1126', color: '#fff', fontSize: 10, fontWeight: 800, borderRadius: 20, padding: '2px 7px' }}>{stats.contactosNaoLidos}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link
            to="/"
            target="_blank"
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, textDecoration: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 4 }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <span>🌐</span> Ver Site Público
          </Link>
          <button
            id="admin-logout-btn"
            onClick={logout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 10, background: 'none', border: 'none',
              cursor: 'pointer', color: 'rgba(255,100,100,0.7)', fontSize: 13, textAlign: 'left',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ff6b7a'; e.currentTarget.style.background = 'rgba(206,17,38,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,100,100,0.7)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <span>🚪</span> Terminar Sessão
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={S.main}>
        {children}
      </main>
    </div>
  );
}
