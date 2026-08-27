import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../services/api';

const StatCard = ({ icon, label, value, color, sub }) => (
  <div style={{
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16, padding: '24px 28px', position: 'relative', overflow: 'hidden',
  }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: '16px 16px 0 0' }} />
    <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{label}</div>
    <div style={{ color: '#fff', fontSize: 36, fontWeight: 800, lineHeight: 1 }}>{value ?? '—'}</div>
    {sub && <div style={{ color: color, fontSize: 12, marginTop: 8, fontWeight: 600 }}>{sub}</div>}
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.adminStats(), api.adminGetNoticias()])
      .then(([s, n]) => { setStats(s); setNoticias(n.slice(0, 5)); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const hdr = { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 500 };

  return (
    <AdminLayout>
      <div style={{ padding: '40px 40px', color: '#fff' }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: '"Playfair Display", serif', color: '#fff', margin: 0 }}>Dashboard</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 6 }}>Bem-vindo ao painel de administração do SNJF-GB</p>
        </div>

        {loading ? (
          <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: 60 }}>A carregar...</div>
        ) : (
          <>
            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
              <StatCard icon="📰" label="Total de Notícias" value={stats?.totalNoticias} color="#007A33" />
              <StatCard icon="👥" label="Total de Membros" value={stats?.totalMembros} color="#FCD116"
                sub={stats?.membrosPendentes > 0 ? `${stats.membrosPendentes} pendente(s)` : null} />
              <StatCard icon="✉️" label="Mensagens" value={stats?.totalContactos} color="#CE1126"
                sub={stats?.contactosNaoLidos > 0 ? `${stats.contactosNaoLidos} não lida(s)` : null} />
            </div>

            {/* Recent news */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#fff' }}>Notícias Recentes</h2>
                <a href="/admin/noticias" style={{ color: '#FCD116', fontSize: 13, textDecoration: 'none' }}>Ver todas →</a>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <th style={{ ...hdr, padding: '12px 24px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Título</th>
                    <th style={{ ...hdr, padding: '12px 24px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Categoria</th>
                    <th style={{ ...hdr, padding: '12px 24px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Status</th>
                    <th style={{ ...hdr, padding: '12px 24px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {noticias.map(n => (
                    <tr key={n.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '14px 24px', color: '#fff', fontSize: 14, maxWidth: 300 }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.titulo}</div>
                      </td>
                      <td style={{ padding: '14px 24px' }}>
                        <span style={{ background: 'rgba(0,122,51,0.15)', color: '#4ade80', borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>{n.categoria}</span>
                      </td>
                      <td style={{ padding: '14px 24px' }}>
                        <span style={{
                          background: n.status === 'publicado' ? 'rgba(0,122,51,0.15)' : 'rgba(252,209,22,0.15)',
                          color: n.status === 'publicado' ? '#4ade80' : '#FCD116',
                          borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600
                        }}>{n.status}</span>
                      </td>
                      <td style={{ padding: '14px 24px', color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
                        {new Date(n.data_publicacao).toLocaleDateString('pt-PT')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
