import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../services/api';

const STATUS_COLORS = {
  pendente:  { bg: 'rgba(252,209,22,0.12)', color: '#FCD116' },
  aprovado:  { bg: 'rgba(0,122,51,0.12)',   color: '#4ade80' },
  rejeitado: { bg: 'rgba(206,17,38,0.12)',  color: '#ff6b7a' },
};

export default function AdminMembros() {
  const [membros, setMembros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const [selected, setSelected] = useState(null);
  const [msg, setMsg] = useState(null);

  const load = () => { setLoading(true); api.adminGetMembros().then(setMembros).finally(() => setLoading(false)); };
  useEffect(load, []);

  const notify = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg(null), 3500); };

  const updateStatus = async (id, status) => {
    try {
      await api.adminUpdateMembroStatus(id, status);
      notify(`Membro ${status} com sucesso.`);
      setSelected(null);
      load();
    } catch (err) { notify(err.message, 'error'); }
  };

  const deleteMembro = async (id) => {
    if (!window.confirm('Eliminar este registo?')) return;
    try { await api.adminDeleteMembro(id); notify('Registo eliminado.'); setSelected(null); load(); }
    catch (err) { notify(err.message, 'error'); }
  };

  const filtrado = filtro === 'todos' ? membros : membros.filter(m => m.status === filtro);

  return (
    <AdminLayout>
      <div style={{ padding: '40px', color: '#fff' }}>
        {msg && <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, padding: '14px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600, background: msg.type === 'error' ? 'rgba(206,17,38,0.9)' : 'rgba(0,122,51,0.9)', color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>{msg.text}</div>}

        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: '"Playfair Display", serif', margin: 0 }}>Gestão de Membros</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 4 }}>{membros.length} pedidos de adesão</p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {['todos', 'pendente', 'aprovado', 'rejeitado'].map(f => (
            <button key={f} onClick={() => setFiltro(f)} style={{
              padding: '8px 18px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: filtro === f ? '#FCD116' : 'rgba(255,255,255,0.06)',
              color: filtro === f ? '#000' : 'rgba(255,255,255,0.6)',
              transition: 'all 0.2s',
            }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== 'todos' && <span style={{ marginLeft: 6, opacity: 0.7 }}>({membros.filter(m => m.status === f).length})</span>}
            </button>
          ))}
        </div>

        {loading ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>A carregar...</div> : (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Nome', 'Email', 'Clube', 'Posição', 'Status', 'Data', 'Ações'].map(h => (
                    <th key={h} style={{ padding: '14px 18px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrado.map(m => (
                  <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 18px', color: '#fff', fontSize: 14, fontWeight: 500 }}>{m.nome_completo}</td>
                    <td style={{ padding: '14px 18px', color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>{m.email}</td>
                    <td style={{ padding: '14px 18px', color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>{m.clube}</td>
                    <td style={{ padding: '14px 18px', color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>{m.posicao || '—'}</td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ background: STATUS_COLORS[m.status]?.bg, color: STATUS_COLORS[m.status]?.color, borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>{m.status}</span>
                    </td>
                    <td style={{ padding: '14px 18px', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{new Date(m.data_adesao).toLocaleDateString('pt-PT')}</td>
                    <td style={{ padding: '14px 18px' }}>
                      <button onClick={() => setSelected(m)} style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>Ver</button>
                    </td>
                  </tr>
                ))}
                {filtrado.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Nenhum registo encontrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Detail modal */}
        {selected && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ background: '#0D1627', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, width: '100%', maxWidth: 520, padding: '36px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Ficha de Adesão</h2>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 24, cursor: 'pointer' }}>×</button>
              </div>

              <div style={{ display: 'grid', gap: 14, marginBottom: 28 }}>
                {[
                  ['Nome Completo', selected.nome_completo],
                  ['Email', selected.email],
                  ['Telefone', selected.telefone],
                  ['Clube', selected.clube],
                  ['Posição', selected.posicao || '—'],
                  ['Data de Nascimento', selected.data_nascimento ? new Date(selected.data_nascimento).toLocaleDateString('pt-PT') : '—'],
                  ['Nº de Identificação', selected.numero_identificacao],
                  ['Data de Adesão', new Date(selected.data_adesao).toLocaleDateString('pt-PT')],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 10 }}>
                    <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>{k}</span>
                    <span style={{ color: '#fff', fontSize: 14, fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{v}</span>
                  </div>
                ))}
                {selected.mensagem && (
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginBottom: 6 }}>Mensagem</div>
                    <div style={{ color: '#fff', fontSize: 14, background: 'rgba(255,255,255,0.04)', padding: 12, borderRadius: 8 }}>{selected.mensagem}</div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {selected.status !== 'aprovado' && (
                  <button onClick={() => updateStatus(selected.id, 'aprovado')} style={{ flex: 1, padding: '11px', background: 'rgba(0,122,51,0.8)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>✓ Aprovar</button>
                )}
                {selected.status !== 'rejeitado' && (
                  <button onClick={() => updateStatus(selected.id, 'rejeitado')} style={{ flex: 1, padding: '11px', background: 'rgba(206,17,38,0.8)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>✗ Rejeitar</button>
                )}
                <button onClick={() => deleteMembro(selected.id)} style={{ padding: '11px 18px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,100,100,0.8)', border: '1px solid rgba(255,100,100,0.2)', borderRadius: 10, cursor: 'pointer', fontSize: 14 }}>🗑️</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
