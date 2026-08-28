import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../services/api';
import { Trash2, Plus, GripVertical } from 'lucide-react';

const Section = ({ title, icon, children }) => (
  <div style={{
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16, overflow: 'hidden', marginBottom: 24,
  }}>
    <div style={{
      padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#fff' }}>{title}</h2>
    </div>
    <div style={{ padding: '24px' }}>
      {children}
    </div>
  </div>
);

const Field = ({ label, hint, children }) => (
  <div style={{ marginBottom: 20 }}>
    <label style={{
      display: 'block', color: 'rgba(255,255,255,0.55)', fontSize: 12,
      fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 7,
    }}>
      {label}
    </label>
    {children}
    {hint && (
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 5, marginBottom: 0 }}>{hint}</p>
    )}
  </div>
);

const inp = {
  width: '100%', padding: '11px 14px',
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none',
  boxSizing: 'border-box', fontFamily: '"Inter", sans-serif',
  transition: 'border-color 0.2s',
};

const DEFAULTS = {
  sobre_historia_1: '',
  sobre_historia_2: '',
  sobre_valores: [],
  sobre_corpo_dirigente: [],
  sobre_linha_tempo: []
};

export default function AdminSobre() {
  const [cfg, setCfg] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [changed, setChanged] = useState(false);

  const notify = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 4000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.adminGetConfiguracoes();
      
      // Parse JSON arrays
      ['sobre_valores', 'sobre_corpo_dirigente', 'sobre_linha_tempo'].forEach(k => {
        if (data[k] && typeof data[k] === 'string') {
          try { data[k] = JSON.parse(data[k]); } catch(e) {}
        }
      });
      
      setCfg(prev => ({ ...prev, ...data }));
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (key, value) => {
    setCfg(prev => ({ ...prev, [key]: value }));
    setChanged(true);
  };

  const setArrayItem = (key, index, field, value) => {
    const newArr = [...(cfg[key] || [])];
    newArr[index] = { ...newArr[index], [field]: value };
    set(key, newArr);
  };

  const addArrayItem = (key, newItem) => {
    const newArr = [...(cfg[key] || []), newItem];
    set(key, newArr);
  };

  const removeArrayItem = (key, index) => {
    const newArr = [...(cfg[key] || [])];
    newArr.splice(index, 1);
    set(key, newArr);
  };

  const handleUploadImage = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      notify('A carregar imagem...', 'success');
      const data = await api.adminUploadImagem(file);
      setArrayItem('sobre_corpo_dirigente', index, 'img', data.url);
      notify('Imagem carregada com sucesso!');
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        sobre_historia_1: cfg.sobre_historia_1,
        sobre_historia_2: cfg.sobre_historia_2,
        sobre_valores: JSON.stringify(cfg.sobre_valores),
        sobre_corpo_dirigente: JSON.stringify(cfg.sobre_corpo_dirigente),
        sobre_linha_tempo: JSON.stringify(cfg.sobre_linha_tempo)
      };
      await api.adminSaveConfiguracoes(payload);
      notify('Conteúdo Sobre Nós guardado com sucesso!');
      setChanged(false);
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: '40px', color: '#fff', fontFamily: '"Inter", sans-serif', maxWidth: 900 }}>
        {msg && (
          <div style={{
            position: 'fixed', top: 24, right: 24, zIndex: 9999, padding: '14px 22px',
            borderRadius: 12, fontSize: 14, fontWeight: 600,
            background: msg.type === 'error' ? 'rgba(206,17,38,0.95)' : 'rgba(0,122,51,0.95)',
            color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            {msg.type === 'error' ? '❌' : '✅'} {msg.text}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: '"Playfair Display", serif', margin: 0 }}>
              Gestão da Página Sobre Nós
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 6 }}>
              Alterar história, valores, corpo dirigente e linha do tempo
            </p>
          </div>
          {changed && (
            <div style={{ background: 'rgba(252,209,22,0.1)', border: '1px solid rgba(252,209,22,0.2)', borderRadius: 10, padding: '8px 16px', color: '#FCD116', fontSize: 13, fontWeight: 600 }}>
              ● Alterações não guardadas
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: 'rgba(255,255,255,0.3)' }}>A carregar...</div>
        ) : (
          <form onSubmit={handleSave}>
            
            {/* HISTÓRIA */}
            <Section title="História da Organização" icon="📜">
              <Field label="Parágrafo 1 (História)">
                <textarea rows={4} style={{ ...inp, resize: 'vertical' }} value={cfg.sobre_historia_1} onChange={e => set('sobre_historia_1', e.target.value)} />
              </Field>
              <Field label="Parágrafo 2 (Continuação)">
                <textarea rows={4} style={{ ...inp, resize: 'vertical' }} value={cfg.sobre_historia_2} onChange={e => set('sobre_historia_2', e.target.value)} />
              </Field>
            </Section>

            {/* CORPO DIRIGENTE */}
            <Section title="Corpo Dirigente" icon="👥">
              {(cfg.sobre_corpo_dirigente || []).map((item, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 12, marginBottom: 16, border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                  <button type="button" onClick={() => removeArrayItem('sobre_corpo_dirigente', i)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(206,17,38,0.1)', border: 'none', color: '#CE1126', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={16} />
                  </button>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16, paddingRight: 40 }}>
                    <Field label="Cargo (Ex: Presidente)"><input style={inp} value={item.role} onChange={e => setArrayItem('sobre_corpo_dirigente', i, 'role', e.target.value)} /></Field>
                    <Field label="Nome Completo"><input style={inp} value={item.name || ''} onChange={e => setArrayItem('sobre_corpo_dirigente', i, 'name', e.target.value)} /></Field>
                  </div>
                  <Field label="Resumo Profissional"><textarea rows={2} style={inp} value={item.desc} onChange={e => setArrayItem('sobre_corpo_dirigente', i, 'desc', e.target.value)} /></Field>
                  <Field label="Fotografia (Link ou Carregar do PC)">
                    <div style={{ display: 'flex', gap: 10 }}>
                      <input style={{...inp, flex: 1}} value={item.img || ''} onChange={e => setArrayItem('sobre_corpo_dirigente', i, 'img', e.target.value)} placeholder="Cole o URL ou clique em Upload 👉" />
                      <label style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.1)', padding: '0 16px', borderRadius: 10, display: 'flex', alignItems: 'center', fontSize: 13, fontWeight: 600, border: '1px solid rgba(255,255,255,0.2)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.2)'} onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
                        📤 Upload
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleUploadImage(e, i)} />
                      </label>
                    </div>
                  </Field>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('sobre_corpo_dirigente', { role: 'Novo Cargo', name: '', desc: '', img: '' })} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px dashed rgba(255,255,255,0.2)', padding: '10px 16px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
                <Plus size={16} /> Adicionar Membro à Direção
              </button>
            </Section>

            {/* LINHA DO TEMPO */}
            <Section title="Linha do Tempo (Timeline)" icon="⏳">
              {(cfg.sobre_linha_tempo || []).map((item, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 12, marginBottom: 16, border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                  <button type="button" onClick={() => removeArrayItem('sobre_linha_tempo', i)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(206,17,38,0.1)', border: 'none', color: '#CE1126', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={16} />
                  </button>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 16, marginBottom: 16, paddingRight: 40 }}>
                    <Field label="Ano"><input style={inp} value={item.year} onChange={e => setArrayItem('sobre_linha_tempo', i, 'year', e.target.value)} /></Field>
                    <Field label="Título do Marco"><input style={inp} value={item.title} onChange={e => setArrayItem('sobre_linha_tempo', i, 'title', e.target.value)} /></Field>
                  </div>
                  <Field label="Descrição"><textarea rows={2} style={inp} value={item.desc} onChange={e => setArrayItem('sobre_linha_tempo', i, 'desc', e.target.value)} /></Field>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('sobre_linha_tempo', { year: new Date().getFullYear().toString(), title: 'Novo Marco', desc: '' })} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px dashed rgba(255,255,255,0.2)', padding: '10px 16px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
                <Plus size={16} /> Adicionar Marco
              </button>
            </Section>

            {/* VALORES */}
            <Section title="Valores e Princípios Fundamentais" icon="⭐">
              {(cfg.sobre_valores || []).map((item, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 12, marginBottom: 16, border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                  <button type="button" onClick={() => removeArrayItem('sobre_valores', i)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(206,17,38,0.1)', border: 'none', color: '#CE1126', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={16} />
                  </button>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: 16, marginBottom: 16, paddingRight: 40 }}>
                    <Field label="Nome do Valor (Ex: Solidariedade)"><input style={inp} value={item.title} onChange={e => setArrayItem('sobre_valores', i, 'title', e.target.value)} /></Field>
                    <Field label="Ícone (Lucide)">
                      <select style={inp} value={item.icon} onChange={e => setArrayItem('sobre_valores', i, 'icon', e.target.value)}>
                        <option value="Heart">Heart</option>
                        <option value="Shield">Shield</option>
                        <option value="CheckCircle">CheckCircle</option>
                        <option value="Award">Award</option>
                        <option value="Star">Star</option>
                        <option value="Users">Users</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Explicação do Valor"><textarea rows={2} style={inp} value={item.text} onChange={e => setArrayItem('sobre_valores', i, 'text', e.target.value)} /></Field>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Field label="Cor do Ícone (Hex)"><input style={inp} type="color" value={item.color} onChange={e => setArrayItem('sobre_valores', i, 'color', e.target.value)} /></Field>
                    <Field label="Cor de Fundo (Hex)"><input style={inp} type="color" value={item.bg} onChange={e => setArrayItem('sobre_valores', i, 'bg', e.target.value)} /></Field>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('sobre_valores', { title: 'Novo Valor', text: '', icon: 'Star', color: '#FCD116', bg: '#FFFBEB' })} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px dashed rgba(255,255,255,0.2)', padding: '10px 16px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
                <Plus size={16} /> Adicionar Valor
              </button>
            </Section>

            {/* Ações */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button type="button" onClick={load} style={{ padding: '13px 24px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                ↩ Repor
              </button>
              <button type="submit" disabled={saving} style={{ padding: '13px 32px', background: saving ? 'rgba(0,122,51,0.5)' : 'linear-gradient(135deg,#007A33,#005E28)', color: '#fff', border: 'none', borderRadius: 12, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 800, boxShadow: saving ? 'none' : '0 4px 20px rgba(0,122,51,0.4)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8 }}>
                {saving ? '⏳ A guardar...' : '💾 Guardar Tudo'}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
