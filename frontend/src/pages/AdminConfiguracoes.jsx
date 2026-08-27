import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../services/api';

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
  site_nome: 'Sindicato Nacional dos Jogadores de Futebol da Guiné-Bissau',
  site_sigla: 'SNJF-GB',
  site_email: '',
  site_telefone: '',
  site_endereco: 'Bissau, Guiné-Bissau',
  site_descricao: 'O SNJF-GB defende os direitos e interesses dos jogadores de futebol da Guiné-Bissau.',
  redes_facebook: '',
  redes_instagram: '',
  redes_twitter: '',
  redes_youtube: '',
  stat_1_valor: '100+',
  stat_1_label: 'Atletas Filiados',
  stat_2_valor: '3',
  stat_2_label: 'Anos de Luta',
  stat_3_valor: '24h',
  stat_3_label: 'Apoio Jurídico',
  email_smtp_host: 'smtp.gmail.com',
  email_smtp_port: '587',
  email_smtp_user: '',
  email_smtp_pass: '',
  email_from: '',
};

export default function AdminConfiguracoes() {
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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.adminSaveConfiguracoes(cfg);
      notify('Configurações guardadas com sucesso!');
      setChanged(false);
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: '40px', color: '#fff', fontFamily: '"Inter", sans-serif', maxWidth: 800 }}>
        {/* Toast */}
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

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: '"Playfair Display", serif', margin: 0 }}>
              Configurações
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 6 }}>
              Gerir as configurações gerais do site e comunicações
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

            {/* ── Informações do Site ── */}
            <Section title="Informações do Site" icon="🌐">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Nome Completo">
                  <input style={inp} value={cfg.site_nome} onChange={e => set('site_nome', e.target.value)} placeholder="Nome do sindicato" />
                </Field>
                <Field label="Sigla">
                  <input style={inp} value={cfg.site_sigla} onChange={e => set('site_sigla', e.target.value)} placeholder="SNJF-GB" />
                </Field>
              </div>
              <Field label="Descrição / Slogan" hint="Aparece na secção 'Sobre' e nos meta tags SEO.">
                <textarea rows={3} style={{ ...inp, resize: 'vertical' }} value={cfg.site_descricao} onChange={e => set('site_descricao', e.target.value)} />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Email de Contacto">
                  <input style={inp} type="email" value={cfg.site_email} onChange={e => set('site_email', e.target.value)} placeholder="geral@snjf-gb.org" />
                </Field>
                <Field label="Telefone">
                  <input style={inp} value={cfg.site_telefone} onChange={e => set('site_telefone', e.target.value)} placeholder="+245 ..." />
                </Field>
              </div>
              <Field label="Endereço">
                <input style={inp} value={cfg.site_endereco} onChange={e => set('site_endereco', e.target.value)} placeholder="Bissau, Guiné-Bissau" />
              </Field>
            </Section>

            {/* ── Redes Sociais ── */}
            <Section title="Redes Sociais" icon="📱">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Facebook">
                  <input style={inp} value={cfg.redes_facebook} onChange={e => set('redes_facebook', e.target.value)} placeholder="https://facebook.com/..." />
                </Field>
                <Field label="Instagram">
                  <input style={inp} value={cfg.redes_instagram} onChange={e => set('redes_instagram', e.target.value)} placeholder="https://instagram.com/..." />
                </Field>
                <Field label="Twitter / X">
                  <input style={inp} value={cfg.redes_twitter} onChange={e => set('redes_twitter', e.target.value)} placeholder="https://twitter.com/..." />
                </Field>
                <Field label="YouTube">
                  <input style={inp} value={cfg.redes_youtube} onChange={e => set('redes_youtube', e.target.value)} placeholder="https://youtube.com/..." />
                </Field>
              </div>
            </Section>

            {/* ── Estatísticas ── */}
            <Section title="Estatísticas (Página Inicial)" icon="📊">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Estatística 1 - Valor">
                  <input style={inp} value={cfg.stat_1_valor} onChange={e => set('stat_1_valor', e.target.value)} placeholder="100+" />
                </Field>
                <Field label="Estatística 1 - Texto">
                  <input style={inp} value={cfg.stat_1_label} onChange={e => set('stat_1_label', e.target.value)} placeholder="Atletas Filiados" />
                </Field>

                <Field label="Estatística 2 - Valor">
                  <input style={inp} value={cfg.stat_2_valor} onChange={e => set('stat_2_valor', e.target.value)} placeholder="3" />
                </Field>
                <Field label="Estatística 2 - Texto">
                  <input style={inp} value={cfg.stat_2_label} onChange={e => set('stat_2_label', e.target.value)} placeholder="Anos de Luta" />
                </Field>

                <Field label="Estatística 3 - Valor">
                  <input style={inp} value={cfg.stat_3_valor} onChange={e => set('stat_3_valor', e.target.value)} placeholder="24h" />
                </Field>
                <Field label="Estatística 3 - Texto">
                  <input style={inp} value={cfg.stat_3_label} onChange={e => set('stat_3_label', e.target.value)} placeholder="Apoio Jurídico" />
                </Field>
              </div>
            </Section>

            {/* ── Configurações de Email ── */}
            <Section title="Configurações de Email (SMTP)" icon="📧">
              <div style={{
                background: 'rgba(252,209,22,0.05)', border: '1px solid rgba(252,209,22,0.15)',
                borderRadius: 10, padding: '12px 16px', marginBottom: 20,
              }}>
                <p style={{ color: 'rgba(252,209,22,0.9)', fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                  ⚠️ Para o envio automático de respostas por email, configure as credenciais SMTP abaixo.
                  Para Gmail, use uma <strong>App Password</strong> (não a password normal da conta).
                  Estas configurações têm prioridade sobre as do ficheiro <code style={{ background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: 4 }}>.env</code>.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Servidor SMTP" hint="Ex: smtp.gmail.com">
                  <input style={inp} value={cfg.email_smtp_host} onChange={e => set('email_smtp_host', e.target.value)} placeholder="smtp.gmail.com" />
                </Field>
                <Field label="Porta SMTP" hint="587 (TLS) ou 465 (SSL)">
                  <input style={inp} type="number" value={cfg.email_smtp_port} onChange={e => set('email_smtp_port', e.target.value)} placeholder="587" />
                </Field>
                <Field label="Utilizador SMTP (Email)">
                  <input style={inp} type="email" value={cfg.email_smtp_user} onChange={e => set('email_smtp_user', e.target.value)} placeholder="email@gmail.com" />
                </Field>
                <Field label="Password SMTP" hint="Para Gmail: use App Password">
                  <input style={inp} type="password" value={cfg.email_smtp_pass} onChange={e => set('email_smtp_pass', e.target.value)} placeholder="••••••••••••••••" autoComplete="new-password" />
                </Field>
              </div>
              <Field label="Email de Origem (FROM)" hint="Nome e email que aparece como remetente das respostas.">
                <input style={inp} value={cfg.email_from} onChange={e => set('email_from', e.target.value)} placeholder='"SNJF-GB" <noreply@snjf-gb.org>' />
              </Field>
            </Section>

            {/* ── Botão Guardar ── */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                type="button"
                onClick={load}
                style={{
                  padding: '13px 24px', background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12, cursor: 'pointer', fontSize: 14, fontWeight: 600,
                }}
              >
                ↩ Repor
              </button>
              <button
                id="btn-guardar-configuracoes"
                type="submit"
                disabled={saving}
                style={{
                  padding: '13px 32px',
                  background: saving ? 'rgba(0,122,51,0.5)' : 'linear-gradient(135deg,#007A33,#005E28)',
                  color: '#fff', border: 'none', borderRadius: 12,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontSize: 15, fontWeight: 800,
                  boxShadow: saving ? 'none' : '0 4px 20px rgba(0,122,51,0.4)',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                {saving ? '⏳ A guardar...' : '💾 Guardar Configurações'}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
