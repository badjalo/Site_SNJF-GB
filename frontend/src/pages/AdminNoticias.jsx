import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../services/api';

const CATEGORIAS = ['Comunicados', 'Eventos', 'Formação', 'Tecnologia', 'Outros'];
const STATUS_OPT = ['publicado', 'rascunho'];

const emptyForm = { titulo: '', resumo: '', conteudo: '', categoria: 'Comunicados', imagem_url: '', autor: 'Direção SNJF-GB', status: 'publicado' };

export default function AdminNoticias() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const load = () => {
    setLoading(true);
    api.adminGetNoticias().then(setNoticias).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const notify = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3500);
  };

  const openCreate = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (n) => { setForm({ titulo: n.titulo, resumo: n.resumo, conteudo: n.conteudo, categoria: n.categoria, imagem_url: n.imagem_url || '', autor: n.autor, status: n.status }); setEditId(n.id); setShowForm(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await api.adminUpdateNoticia(editId, form);
        notify('Notícia atualizada com sucesso!');
      } else {
        await api.adminCreateNoticia(form);
        notify('Notícia criada com sucesso!');
      }
      setShowForm(false);
      load();
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.adminDeleteNoticia(deleteId);
      notify('Notícia eliminada.');
      setDeleteId(null);
      load();
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const inp = { width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: '"Inter", sans-serif' };
  const lbl = { display: 'block', color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 7 };

  return (
    <AdminLayout>
      <div style={{ padding: '40px', color: '#fff' }}>
        {/* Toast */}
        {msg && (
          <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, padding: '14px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600, background: msg.type === 'error' ? 'rgba(206,17,38,0.9)' : 'rgba(0,122,51,0.9)', color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
            {msg.text}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: '"Playfair Display", serif', margin: 0 }}>Gestão de Notícias</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 4 }}>{noticias.length} notícias encontradas</p>
          </div>
          <button id="btn-nova-noticia" onClick={openCreate} style={{ padding: '11px 22px', background: 'linear-gradient(135deg,#007A33,#005E28)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            + Nova Notícia
          </button>
        </div>

        {/* Table */}
        {loading ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>A carregar...</div> : (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  {['Título', 'Categoria', 'Autor', 'Status', 'Data', 'Ações'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {noticias.map(n => (
                  <tr key={n.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 20px', color: '#fff', fontSize: 14, maxWidth: 260 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.titulo}</div>
                    </td>
                    <td style={{ padding: '14px 20px' }}><span style={{ background: 'rgba(0,122,51,0.15)', color: '#4ade80', borderRadius: 20, padding: '3px 10px', fontSize: 12 }}>{n.categoria}</span></td>
                    <td style={{ padding: '14px 20px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{n.autor}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ background: n.status === 'publicado' ? 'rgba(0,122,51,0.15)' : 'rgba(252,209,22,0.15)', color: n.status === 'publicado' ? '#4ade80' : '#FCD116', borderRadius: 20, padding: '3px 10px', fontSize: 12 }}>{n.status}</span>
                    </td>
                    <td style={{ padding: '14px 20px', color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>{new Date(n.data_publicacao).toLocaleDateString('pt-PT')}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openEdit(n)} style={{ padding: '6px 14px', background: 'rgba(252,209,22,0.12)', color: '#FCD116', border: '1px solid rgba(252,209,22,0.2)', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Editar</button>
                        <button onClick={() => setDeleteId(n.id)} style={{ padding: '6px 14px', background: 'rgba(206,17,38,0.12)', color: '#ff6b7a', border: '1px solid rgba(206,17,38,0.2)', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal Form */}
        {showForm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '40px 20px' }}>
            <div style={{ background: '#0D1627', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, width: '100%', maxWidth: 680, padding: '36px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{editId ? 'Editar Notícia' : 'Nova Notícia'}</h2>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 24, cursor: 'pointer', lineHeight: 1 }}>×</button>
              </div>
              <form onSubmit={handleSave}>
                <div style={{ display: 'grid', gap: 20 }}>
                  <div>
                    <label style={lbl}>Título *</label>
                    <input style={inp} value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} required placeholder="Título da notícia" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={lbl}>Categoria *</label>
                      <select style={{ ...inp, cursor: 'pointer' }} value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}>
                        {CATEGORIAS.map(c => <option key={c} value={c} style={{ background: '#0D1627' }}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={lbl}>Status</label>
                      <select style={{ ...inp, cursor: 'pointer' }} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                        {STATUS_OPT.map(s => <option key={s} value={s} style={{ background: '#0D1627' }}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={lbl}>Resumo *</label>
                    <textarea style={{ ...inp, resize: 'vertical', minHeight: 80 }} value={form.resumo} onChange={e => setForm(f => ({ ...f, resumo: e.target.value }))} required placeholder="Breve resumo da notícia..." />
                  </div>
                  <div>
                    <label style={lbl}>Conteúdo completo *</label>
                    <textarea style={{ ...inp, resize: 'vertical', minHeight: 160 }} value={form.conteudo} onChange={e => setForm(f => ({ ...f, conteudo: e.target.value }))} required placeholder="Texto completo da notícia..." />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={lbl}>Autor</label>
                      <input style={inp} value={form.autor} onChange={e => setForm(f => ({ ...f, autor: e.target.value }))} placeholder="Direção SNJF-GB" />
                    </div>
                    <div>
                      <label style={lbl}>Imagem da Notícia</label>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <input 
                          style={inp} 
                          value={form.imagem_url} 
                          onChange={e => setForm(f => ({ ...f, imagem_url: e.target.value }))} 
                          placeholder="Carregue ou insira URL..." 
                        />
                        <label style={{ 
                          padding: '11px 16px', 
                          background: 'rgba(255,255,255,0.08)', 
                          border: '1px solid rgba(255,255,255,0.15)', 
                          borderRadius: 10, 
                          cursor: 'pointer', 
                          fontSize: 13, 
                          fontWeight: 600,
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          display: 'inline-flex',
                          alignItems: 'center',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                        >
                          Carregar
                          <input 
                            type="file" 
                            accept="image/*" 
                            style={{ display: 'none' }} 
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              try {
                                notify('A enviar imagem...', 'info');
                                const res = await api.adminUploadImagem(file);
                                setForm(f => ({ ...f, imagem_url: res.url }));
                                notify('Imagem carregada com sucesso!');
                              } catch (err) {
                                notify('Erro: ' + err.message, 'error');
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {form.imagem_url && (
                    <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', height: 140, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
                      <img src={form.imagem_url} alt="Pré-visualização" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      <button 
                        type="button" 
                        onClick={() => setForm(f => ({ ...f, imagem_url: '' }))} 
                        style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(206,17,38,0.85)', border: 'none', color: '#fff', width: 24, height: 24, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 28 }}>
                  <button type="button" onClick={() => setShowForm(false)} style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, cursor: 'pointer', fontSize: 14 }}>Cancelar</button>
                  <button type="submit" disabled={saving} style={{ padding: '12px 28px', background: 'linear-gradient(135deg,#007A33,#005E28)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
                    {saving ? 'A guardar...' : 'Guardar Notícia'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete confirm */}
        {deleteId && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#0D1627', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '32px', maxWidth: 360, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🗑️</div>
              <h3 style={{ color: '#fff', margin: '0 0 12px' }}>Eliminar notícia?</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 24px' }}>Esta ação é irreversível.</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button onClick={() => setDeleteId(null)} style={{ padding: '10px 22px', background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, cursor: 'pointer' }}>Cancelar</button>
                <button onClick={handleDelete} style={{ padding: '10px 22px', background: '#CE1126', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>Eliminar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
