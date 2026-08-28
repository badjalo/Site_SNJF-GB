import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, ChevronRight } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

const navLinks = [
  { name: 'Início',    path: '/' },
  { name: 'Sobre Nós', path: '/sobre' },
  { name: 'Notícias',  path: '/noticias' },
  { name: 'Membros',   path: '/membros' },
  { name: 'Contacto',  path: '/contacto' },
];

export default function Navbar() {
  const { config } = useConfig();
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  const active = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const isHome = location.pathname === '/';
  const isSolid = scrolled || !isHome;

  return (
    <>
      <header
        id="main-navbar"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          transition: 'all 0.35s ease',
          ...(isSolid
            ? { background: 'rgba(6,10,21,0.96)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '10px 0' }
            : { background: 'transparent', padding: '18px 0' }
          ),
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* ── Logo ── */}
          <Link
            to="/"
            onClick={() => setOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none',
              cursor: 'pointer', transition: 'transform 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ width: 46, height: 46, borderRadius: '50%', overflow: 'hidden', border: '2px solid #FCD116', background: '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/logo.png" alt="SNJF-GB" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ fontFamily: '"Playfair Display", serif', fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1 }}>
                {config.site_sigla}
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 }}>
                {config.site_nome}
              </div>
            </div>
          </Link>

          {/* ── Desktop Links ── */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden-mobile">
            {navLinks.map(({ name, path }) => (
              <Link
                key={name}
                id={`nav-${name.toLowerCase().replace(/\s/g, '-')}`}
                to={path}
                style={{
                  padding: '7px 16px',
                  borderRadius: 8,
                  fontSize: 13.5,
                  fontWeight: active(path) ? 700 : 500,
                  color: active(path) ? '#FCD116' : 'rgba(255,255,255,0.75)',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  letterSpacing: '0.01em',
                  background: active(path) ? 'rgba(252,209,22,0.07)' : 'transparent',
                }}
                onMouseEnter={e => {
                  if (!active(path)) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }
                }}
                onMouseLeave={e => {
                  if (!active(path)) { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.background = 'transparent'; }
                }}
              >
                {name}
              </Link>
            ))}
            <Link
              to="/membros"
              id="nav-cta"
              style={{
                marginLeft: 12, padding: '9px 22px', borderRadius: 50,
                background: 'linear-gradient(135deg, #007A33, #005E28)',
                color: '#fff', fontSize: 13, fontWeight: 700,
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
                border: '1px solid rgba(0,122,51,0.4)',
                boxShadow: '0 4px 16px rgba(0,122,51,0.3)',
                transition: 'all 0.25s',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,122,51,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,122,51,0.3)'; e.currentTarget.style.transform = 'none'; }}
            >
              <Shield size={14} color="#FCD116" />
              Aderir
            </Link>
          </nav>

          {/* ── Mobile Hamburger ── */}
          <button
            onClick={() => setOpen(!open)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', padding: 6, display: 'none' }}
            className="show-mobile"
            aria-label="Abrir menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* ── Mobile Menu Drawer ── */}
      {open && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 49,
          background: 'rgba(6,10,21,0.98)', backdropFilter: 'blur(30px)',
          display: 'flex', flexDirection: 'column', paddingTop: 90, paddingLeft: 24, paddingRight: 24,
        }}>
          <div style={{ flex: 1 }}>
            {navLinks.map(({ name, path }, i) => (
              <Link
                key={name}
                to={path}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '18px 0',
                  borderBottom: i < navLinks.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  color: active(path) ? '#FCD116' : '#fff',
                  fontFamily: '"Playfair Display", serif', fontSize: 24, fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                {name}
                <ChevronRight size={20} color={active(path) ? '#FCD116' : 'rgba(255,255,255,0.3)'} />
              </Link>
            ))}
          </div>
          <div style={{ paddingBottom: 40 }}>
            <Link
              to="/membros"
              style={{
                display: 'block', textAlign: 'center', padding: '16px',
                background: 'linear-gradient(135deg, #007A33, #005E28)',
                color: '#fff', fontWeight: 700, fontSize: 15,
                borderRadius: 12, textDecoration: 'none',
                border: '1px solid rgba(0,122,51,0.4)',
              }}
            >
              Filiar-me no Sindicato
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: block !important; }
        }
        @media (min-width: 769px) {
          .show-mobile   { display: none !important; }
        }
      `}</style>
    </>
  );
}
