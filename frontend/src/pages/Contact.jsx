import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useConfig } from '../context/ConfigContext';

const C = { green: '#007A33', gold: '#FCD116', red: '#CE1126', dark: '#0A0F1E', text: '#111827', muted: '#6B7280', light: '#F9FAFB' };

const FadeUp = ({ children, delay = 0, style = {} }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} style={style}>
    {children}
  </motion.div>
);

const PageHeader = ({ title, sub }) => (
  <section style={{ background: C.dark, padding: '120px 24px 72px', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 20% 50%, ${C.green}18 0%, transparent 60%)`, pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.06)' }} />
    <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(32px, 5vw, 58px)', fontWeight: 800, color: '#fff', margin: '0 0 16px', letterSpacing: '-0.02em' }}>{title}</h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', maxWidth: 520, lineHeight: 1.75, margin: 0 }}>{sub}</p>
      </motion.div>
    </div>
  </section>
);

export default function Contact() {
  const { config } = useConfig();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await api.enviarContacto(formData);
      setStatus({
        type: 'success',
        message: response.message || 'Mensagem enviada com sucesso! Responderemos o mais breve possível.'
      });
      setFormData({
        nome: '',
        email: '',
        assunto: '',
        mensagem: '',
      });
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      setStatus({
        type: 'error',
        message: err.message || 'Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: MapPin, title: 'Endereço Físico', lines: [config.site_endereco] },
    { icon: Phone, title: 'Telefone de Contacto', lines: [config.site_telefone] },
    { icon: Mail, title: 'E-mail Oficial', lines: [config.site_email] },
    { icon: Clock, title: 'Horário de Atendimento', lines: ['Segunda a Sexta: 09:00 - 17:00', 'Sábado: 09:00 - 13:00'] },
  ];

  return (
    <div style={{ fontFamily: '"Inter", sans-serif', background: C.light }}>
      <PageHeader title="Contacte-nos" sub="Esclareça dúvidas, sugira melhorias ou solicite apoio direto. Estamos à sua disposição." />

      {/* Info Cards */}
      <section style={{ padding: '80px 24px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {contactInfo.map((item, idx) => {
            const Icon = item.icon;
            return (
              <FadeUp key={idx} delay={idx * 0.08}>
                <div style={{ background: '#fff', padding: '32px 24px', borderRadius: 20, border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100%', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#F0FAF4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <Icon size={18} color={C.green} />
                  </div>
                  <h4 style={{ fontFamily: '"Playfair Display", serif', fontSize: 16.5, fontWeight: 700, color: C.text, margin: '0 0 8px' }}>{item.title}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {item.lines.map((line, lIdx) => (
                      <span key={lIdx} style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.5 }}>{line}</span>
                    ))}
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </section>

      {/* Form + Map */}
      <section style={{ padding: '40px 24px 100px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 48, flexWrap: 'wrap' }} className="contact-layout">
          
          {/* Form */}
          <div style={{ flex: '1 1 500px', background: '#fff', borderRadius: 24, border: '1px solid #E5E7EB', padding: 40, boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, fontWeight: 700, color: C.text, margin: '0 0 8px' }}>Envie uma Mensagem</h3>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: '0 0 28px' }}>Preencha os campos abaixo para nos contactar diretamente por correio eletrónico.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {status.type && (
                <div style={{ display: 'flex', gap: 12, padding: '16px 20px', borderRadius: 12, background: status.type === 'success' ? '#F0FAF4' : '#FFF0F0', border: `1px solid ${status.type === 'success' ? '#DEF7EC' : '#FDE8E8'}` }}>
                  {status.type === 'success' ? <CheckCircle size={18} color={C.green} style={{ flexShrink: 0, marginTop: 2 }} /> : <AlertCircle size={18} color={C.red} style={{ flexShrink: 0, marginTop: 2 }} />}
                  <span style={{ fontSize: 13.5, color: status.type === 'success' ? '#03543F' : '#9B1C1C', fontWeight: 500, lineHeight: 1.5 }}>{status.message}</span>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: C.text }}>Nome Completo <span style={{ color: C.red }}>*</span></label>
                <input type="text" name="nome" required value={formData.nome} onChange={handleChange} placeholder="Ex: Ansumane Mané" style={{ padding: '11px 16px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 13.5, outline: 'none', background: C.light }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: C.text }}>E-mail <span style={{ color: C.red }}>*</span></label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Ex: jogador@email.com" style={{ padding: '11px 16px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 13.5, outline: 'none', background: C.light }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: C.text }}>Assunto <span style={{ color: C.red }}>*</span></label>
                <input type="text" name="assunto" required value={formData.assunto} onChange={handleChange} placeholder="Ex: Apoio Jurídico / Dúvidas" style={{ padding: '11px 16px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 13.5, outline: 'none', background: C.light }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: C.text }}>Mensagem <span style={{ color: C.red }}>*</span></label>
                <textarea name="mensagem" rows={5} required value={formData.mensagem} onChange={handleChange} placeholder="Escreva a sua mensagem..." style={{ padding: '12px 16px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 13.5, outline: 'none', background: C.light, resize: 'vertical' }} />
              </div>

              <button type="submit" disabled={submitting} style={{
                padding: '13px', background: C.green, color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', borderRadius: 50, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background-color 0.25s', marginTop: 12
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#005E28'}
                onMouseLeave={e => e.currentTarget.style.background = C.green}
              >
                <Send size={15} color={C.gold} /> {submitting ? 'A enviar...' : 'Enviar mensagem'}
              </button>

            </form>
          </div>

          {/* Map Side */}
          <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column' }} className="contact-map">
            <div style={{ background: C.dark, padding: 40, borderRadius: 24, border: '1px solid rgba(255,255,255,0.06)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff', minHeight: 400 }}>
              <div>
                <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 20, fontWeight: 700, color: C.gold, margin: '0 0 12px' }}>Sede do Sindicato</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: 0 }}>
                  A nossa sede encontra-se no centro da capital, nas instalações oficiais do histórico Estádio Lino Correia. Sinta-se à vontade para nos visitar pessoalmente ou agendar uma reunião de apoio.
                </p>
              </div>

              {/* Mock Map */}
              <div style={{ height: 260, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden', marginTop: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                
                <div style={{ textAlign: 'center', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: C.green, border: `2px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'bounce 2s infinite' }}>
                    <img src="/logo.png" alt="SNJF-GB" style={{ width: '70%', height: '70%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ background: 'rgba(6,10,21,0.85)', padding: '10px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{config.site_sigla}</div>
                    <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{config.site_endereco}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <style>{`
        @media(max-width: 968px) {
          .contact-layout { flex-direction: column !important; }
          .contact-map { width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
