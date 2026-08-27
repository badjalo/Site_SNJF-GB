import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../services/api';

const toast = (setMsg, text, type = 'success') => {
  setMsg({ text, type });
  setTimeout(() => setMsg(null), 4000);
};

/* ── Sub-componente: Modal de detalhe + resposta ── */
function MessageModal({ selected, onClose, onDelete, onReply, loading }) {
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);
  const [showReply, setShowReply] = useState(!selected?.respondido);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setReplying(true);
    await onReply(selected.id, replyText);
    setReplying(false);
    setShowReply(false);
    setReplyText('');
  };

  const inp = {
    width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff',
    fontSize: 14, outline: 'none', boxSizing: 'border-box',
    fontFamily: '"Inter", sans-serif', resize: 'vertical',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{
        background: '#0D1627', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20, width: '100%', maxWidth: 600, maxHeight: '90vh',
        overflowY: 'auto', padding: '36px',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#fff' }}>Mensagem Recebida</h2>
            {selected.respondido && (
              <span style={{ background: 'rgba(0,122,51,0.2)', color: '#4ade80', borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 700 }}>
                ✓ Respondida
              </span>
            )}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 26, cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        {/* Remetente */}
        <div style={{ background: 'rgba(252,209,22,0.05)', border: '1px solid rgba(252,209,22,0.12)', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
          <div style={{ color: '#FCD116', fontWeight: 700, fontSize: 16, marginBottom: 10 }}>{selected.assunto}</div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>👤 {selected.nome}</span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>✉️ {selected.email}</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
              📅 {new Date(selected.data_envio).toLocaleString('pt-PT')}
            </span>
          </div>
        </div>

        {/* Mensagem original */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Mensagem</div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '18px', fontSize: 15, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {selected.mensagem}
          </div>
        </div>

        {/* Resposta anterior */}
        {selected.respondido && selected.resposta && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ color: '#4ade80', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              ✓ Resposta Enviada — {selected.data_resposta ? new Date(selected.data_resposta).toLocaleString('pt-PT') : ''}
            </div>
            <div style={{ background: 'rgba(0,122,51,0.05)', border: '1px solid rgba(0,122,51,0.2)', borderRadius: 12, padding: '18px', fontSize: 15, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {selected.resposta}
            </div>
          </div>
        )}

        {/* Formulário de resposta */}
        {showReply ? (
          <div style={{ marginBottom: 20 }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              Escrever Resposta
            </div>
            <textarea
              id="reply-textarea"
              rows={6}
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder={`Escreva aqui a resposta para ${selected.nome}...`}
              style={inp}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowReply(false)}
                style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, cursor: 'pointer', fontSize: 14 }}
              >
                Cancelar
              </button>
              <button
                id="btn-enviar-resposta"
                onClick={handleReply}
                disabled={replying || !replyText.trim()}
                style={{
                  padding: '10px 24px', background: replying ? 'rgba(0,122,51,0.4)' : 'linear-gradient(135deg,#007A33,#005E28)',
                  color: '#fff', border: 'none', borderRadius: 10, cursor: replying ? 'not-allowed' : 'pointer',
                  fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                {replying ? '⏳ A enviar...' : '📨 Enviar Resposta'}
              </button>
            </div>
          </div>
        ) : (
          selected.respondido && (
            <button
              onClick={() => { setShowReply(true); setReplyText(selected.resposta || ''); }}
              style={{ marginBottom: 20, padding: '10px 20px', background: 'rgba(252,209,22,0.08)', color: '#FCD116', border: '1px solid rgba(252,209,22,0.2)', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
            >
              ↩ Enviar Nova Resposta
            </button>
          )
        )}

        {/* Acções */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20 }}>
          <a
            href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.assunto)}`}
            style={{ padding: '10px 18px', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, textDecoration: 'none', fontSize: 13, fontWeight: 500 }}
          >
            🔗 Abrir no Email
          </a>
          <button
            onClick={() => onDelete(selected.id)}
            style={{ padding: '10px 18px', background: 'rgba(206,17,38,0.1)', color: '#ff6b7a', border: '1px solid rgba(206,17,38,0.2)', borderRadius: 10, cursor: 'pointer', fontSize: 14 }}
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Componente principal ── */
export default function AdminContactos() {
  const [contactos, setContactos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const [busca, setBusca] = useState('');
  const [selected, setSelected] = useState(null);
  const [msg, setMsg] = useState(null);

  const notify = (text, type = 'success') => toast(setMsg, text, type);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.adminGetContactos();
      setContactos(data);
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const marcarLido = async (id) => {
    try {
      const updated = await api.adminMarcarLido(id);
      setContactos(prev => prev.map(c => c.id === id ? updated : c));
      if (selected?.id === id) setSelected(updated);
    } catch {}
  };

  const abrirMensagem = async (c) => {
    setSelected(c);
    if (!c.lido) marcarLido(c.id);
  };

  const deletar = async (id) => {
    if (!window.confirm('Eliminar esta mensagem?')) return;
    try {
      await api.adminDeleteContacto(id);
      notify('Mensagem eliminada com sucesso.');
      setSelected(null);
      load();
    } catch (err) { notify(err.message, 'error'); }
  };

  const responder = async (id, resposta) => {
    try {
      const result = await api.adminResponderContacto(id, resposta);
      notify(result.message || 'Resposta enviada!');
      // atualizar o item localmente
      const updatedContacto = result.contacto;
      setContactos(prev => prev.map(c => c.id === id ? updatedContacto : c));
      setSelected(updatedContacto);
    } catch (err) {
      notify(err.message, 'error');
      throw err;
    }
  };

  // Filtros
  const filtrado = contactos
    .filter(c => {
      if (filtro === 'nao-lidos') return !c.lido;
      if (filtro === 'lidos') return c.lido;
      if (filtro === 'respondidos') return c.respondido;
      if (filtro === 'pendentes') return !c.respondido;
      return true;
    })
    .filter(c =>
      busca === '' ||
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.email.toLowerCase().includes(busca.toLowerCase()) ||
      c.assunto.toLowerCase().includes(busca.toLowerCase())
    );

  const naoLidos = contactos.filter(c => !c.lido).length;
  const naoRespondidos = contactos.filter(c => !c.respondido).length;

  const FILTROS = [
    { v: 'todos', l: 'Todas', count: contactos.length },
    { v: 'nao-lidos', l: 'Não Lidas', count: naoLidos },
    { v: 'pendentes', l: 'Sem Resposta', count: naoRespondidos },
    { v: 'respondidos', l: 'Respondidas', count: contactos.filter(c => c.respondido).length },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: '40px', color: '#fff', fontFamily: '"Inter", sans-serif' }}>
        {/* Toast */}
        {msg && (
          <div style={{
            position: 'fixed', top: 24, right: 24, zIndex: 9999, padding: '14px 22px',
            borderRadius: 12, fontSize: 14, fontWeight: 600,
            background: msg.type === 'error' ? 'rgba(206,17,38,0.95)' : 'rgba(0,122,51,0.95)',
            color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', gap: 10,
            animation: 'slideIn 0.3s ease',
          }}>
            {msg.type === 'error' ? '❌' : '✅'} {msg.text}
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: '"Playfair Display", serif', margin: 0, color: '#fff' }}>
            Mensagens de Contacto
          </h1>
          <div style={{ display: 'flex', gap: 20, marginTop: 8, flexWrap: 'wrap' }}>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>
              {contactos.length} mensagem(s) total
            </span>
            {naoLidos > 0 && (
              <span style={{ color: '#CE1126', fontSize: 14, fontWeight: 600 }}>
                • {naoLidos} não lida(s)
              </span>
            )}
            {naoRespondidos > 0 && (
              <span style={{ color: '#FCD116', fontSize: 14, fontWeight: 600 }}>
                • {naoRespondidos} sem resposta
              </span>
            )}
          </div>
        </div>

        {/* Barra de filtros + busca */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {FILTROS.map(({ v, l, count }) => (
              <button
                key={v}
                onClick={() => setFiltro(v)}
                style={{
                  padding: '8px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                  background: filtro === v ? '#CE1126' : 'rgba(255,255,255,0.06)',
                  color: filtro === v ? '#fff' : 'rgba(255,255,255,0.6)',
                }}
              >
                {l}
                {count > 0 && (
                  <span style={{ marginLeft: 6, opacity: 0.8 }}>({count})</span>
                )}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="🔍 Pesquisar nome, email ou assunto..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            style={{
              padding: '9px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 14,
              outline: 'none', minWidth: 280, fontFamily: '"Inter", sans-serif',
            }}
          />
        </div>

        {/* Lista de mensagens */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
            A carregar mensagens...
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {filtrado.map(c => (
              <div
                key={c.id}
                id={`msg-${c.id}`}
                onClick={() => abrirMensagem(c)}
                style={{
                  background: !c.lido ? 'rgba(206,17,38,0.06)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${!c.lido ? 'rgba(206,17,38,0.15)' : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: 14, padding: '16px 20px', cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = !c.lido ? 'rgba(206,17,38,0.06)' : 'rgba(255,255,255,0.02)'}
              >
                {/* Indicador não-lido */}
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.lido ? 'rgba(255,255,255,0.12)' : '#CE1126', flexShrink: 0 }} />

                {/* Conteúdo */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                    <span style={{ color: '#fff', fontWeight: c.lido ? 500 : 700, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.nome}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, flexShrink: 0 }}>
                      {new Date(c.data_envio).toLocaleDateString('pt-PT')}
                    </span>
                  </div>
                  <div style={{ color: '#FCD116', fontSize: 13, fontWeight: 600, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.assunto}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.mensagem}
                  </div>
                </div>

                {/* Badge respondido */}
                {c.respondido && (
                  <span style={{ background: 'rgba(0,122,51,0.15)', color: '#4ade80', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                    ✓ Respondida
                  </span>
                )}
              </div>
            ))}

            {filtrado.length === 0 && (
              <div style={{ textAlign: 'center', padding: 80, color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>
                Nenhuma mensagem encontrada.
              </div>
            )}
          </div>
        )}

        {/* Modal de mensagem */}
        {selected && (
          <MessageModal
            selected={selected}
            onClose={() => setSelected(null)}
            onDelete={deletar}
            onReply={responder}
          />
        )}
      </div>
    </AdminLayout>
  );
}
