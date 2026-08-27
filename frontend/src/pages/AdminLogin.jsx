import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api.adminLogin(username, password);
      localStorage.setItem('snj_admin_token', data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #060A15 0%, #0D1B2A 50%, #060A15 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Inter", sans-serif',
    }}>
      {/* Background decoration */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(0,122,51,0.06)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 250, height: 250, borderRadius: '50%', background: 'rgba(252,209,22,0.04)', filter: 'blur(80px)' }} />
      </div>

      <div style={{
        width: '100%', maxWidth: 420, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 70, height: 70, borderRadius: '50%', background: '#fff',
            border: '3px solid #FCD116', margin: '0 auto 16px', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img src="/logo.png" alt="SNJF-GB" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
          </div>
          <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 800, fontFamily: '"Playfair Display", serif', marginBottom: 4 }}>
            Painel Administrativo
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>SNJF-GB — Área Restrita</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20, padding: '36px 32px', backdropFilter: 'blur(20px)',
        }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                background: 'rgba(206,17,38,0.12)', border: '1px solid rgba(206,17,38,0.3)',
                color: '#ff6b7a', borderRadius: 10, padding: '12px 16px', fontSize: 13,
                marginBottom: 20, textAlign: 'center',
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                Utilizador
              </label>
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                required
                style={{
                  width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#fff',
                  fontSize: 14, outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(252,209,22,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#fff',
                  fontSize: 14, outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(252,209,22,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>

            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px', borderRadius: 12,
                background: loading ? 'rgba(0,122,51,0.5)' : 'linear-gradient(135deg, #007A33, #005E28)',
                color: '#fff', fontSize: 15, fontWeight: 700, border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                boxShadow: '0 4px 20px rgba(0,122,51,0.35)',
              }}
            >
              {loading ? 'A entrar...' : 'Entrar no Painel'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>
          © {new Date().getFullYear()} SNJF-GB — Acesso restrito a administradores
        </p>
      </div>
    </div>
  );
}
