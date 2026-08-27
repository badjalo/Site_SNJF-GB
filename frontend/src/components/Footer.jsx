import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

const C = {
  dark: '#0A0F1E',
  green: '#007A33',
  gold: '#FCD116',
  red: '#CE1126',
  border: 'rgba(255,255,255,0.07)',
  muted: 'rgba(255,255,255,0.45)',
};

export default function Footer() {
  const { config } = useConfig();
  const year = new Date().getFullYear();

  return (
    <footer id="main-footer" style={{ background: C.dark, color: '#fff', fontFamily: '"Inter", sans-serif' }}>
      {/* Flag top ribbon */}
      <div style={{ height: 3, display: 'flex' }}>
        <div style={{ flex: 1, background: C.red }} />
        <div style={{ flex: 1, background: C.gold }} />
        <div style={{ flex: 1, background: C.green }} />
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 48, marginBottom: 56 }}>

          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${C.gold}`, background: '#fff', flexShrink: 0 }}>
                <img src="/logo.png" alt="SNJF-GB" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div>
                <div style={{ fontFamily: '"Playfair Display", serif', fontWeight: 800, fontSize: 18, color: C.gold }}>{config.site_sigla}</div>
                <div style={{ fontSize: 9, color: C.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{config.site_nome}</div>
              </div>
            </Link>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75, margin: '0 0 24px' }}>
              {config.site_descricao}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { href: config.redes_facebook, d: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z' },
                { href: config.redes_instagram, d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
                { href: config.redes_twitter, d: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' },
                { href: config.redes_youtube, d: 'M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.03 0 12 0 12s0 3.97.502 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.97 24 12 24 12s0-3.97-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
              ].filter(item => item.href).map(({ href, d }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.green; e.currentTarget.style.borderColor = C.green; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = C.muted; }}
                >
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d={d} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: C.gold, marginBottom: 20 }}>Navegação</div>
            {[['Início', '/'], ['Sobre Nós', '/sobre'], ['Notícias', '/noticias'], ['Membros', '/membros'], ['Contacto', '/contacto']].map(([name, path]) => (
              <Link key={name} to={path} style={{ display: 'block', color: C.muted, textDecoration: 'none', fontSize: 13.5, marginBottom: 12, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = C.muted}
              >{name}</Link>
            ))}
          </div>

          {/* Institutional */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: C.gold, marginBottom: 20 }}>Informação</div>
            {['Estatutos do Sindicato', 'Fundo de Solidariedade', 'Direitos dos Atletas', 'Parceiros Médicos', 'Política de Privacidade'].map(item => (
              <div key={item} style={{ color: C.muted, fontSize: 13.5, marginBottom: 12 }}>{item}</div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: C.gold, marginBottom: 20 }}>Contacto</div>
            {[
              { Icon: MapPin, text: config.site_endereco },
              { Icon: Phone, text: config.site_telefone },
              { Icon: Mail, text: config.site_email },
            ].filter(item => item.text).map(({ Icon, text }) => (
              <div key={text} style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'flex-start' }}>
                <Icon size={14} color={C.green} style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: C.muted }}>
            © {year} {config.site_sigla} — {config.site_nome}
          </span>
          <div style={{ display: 'flex', gap: 3 }}>
            {['', '', ''].map((_, i) => (
              <div key={i} style={{ width: 20, height: 3, borderRadius: 2, background: [C.red, C.gold, C.green][i] }} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
