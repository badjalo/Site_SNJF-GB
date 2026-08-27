import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

const C = {
  green: '#007A33',
  gold: '#FCD116',
  red: '#CE1126',
  dark: '#0A0F1E',
  muted: 'rgba(255,255,255,0.5)',
};

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: `radial-gradient(circle at top, #141E33 0%, ${C.dark} 70%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      color: '#fff',
      fontFamily: '"Inter", sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background patterns */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        opacity: 0.8
      }} />

      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '480px',
        textAlign: 'center',
        background: 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px',
        padding: '48px 32px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)'
      }}>
        {/* Animated icon container */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(252, 209, 22, 0.08)',
          border: `2px solid ${C.gold}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 28px',
          boxShadow: '0 0 30px rgba(252, 209, 22, 0.2)'
        }}>
          <ShieldAlert size={40} color={C.gold} />
        </div>

        <h1 style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: '72px',
          fontWeight: 900,
          margin: '0 0 12px',
          color: C.gold,
          lineHeight: 1
        }}>
          404
        </h1>

        <h2 style={{
          fontSize: '20px',
          fontWeight: 700,
          margin: '0 0 16px',
          letterSpacing: '-0.2px'
        }}>
          Página não encontrada
        </h2>

        <p style={{
          color: C.muted,
          fontSize: '14px',
          lineHeight: '1.6',
          margin: '0 0 32px'
        }}>
          O link que tentou aceder pode estar quebrado ou a página ter sido removida. Verifique o URL ou regresse à página inicial.
        </p>

        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 28px',
            background: `linear-gradient(135deg, ${C.green}, #005E28)`,
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '50px',
            fontWeight: 700,
            fontSize: '14px',
            border: '1px solid rgba(0,122,51,0.4)',
            boxShadow: '0 8px 24px rgba(0,122,51,0.3)',
            transition: 'all 0.25s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,122,51,0.5)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,122,51,0.3)';
          }}
        >
          <Home size={16} />
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
}
