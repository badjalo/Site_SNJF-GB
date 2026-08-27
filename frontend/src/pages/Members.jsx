import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Heart, BookOpen, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { api } from '../services/api';

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

export default function Members() {
  const [formData, setFormData] = useState({
    nome_completo: '',
    email: '',
    telefone: '',
    clube: '',
    posicao: 'Médio',
    data_nascimento: '',
    numero_identificacao: '',
    mensagem: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });

  const benefits = [
    { icon: Shield, color: C.green, bg: '#F0FAF4', title: 'Assistência Jurídica', desc: 'Acesso imediato ao nosso gabinete jurídico para revisão de contratos, mediação de litígios salariais e representação em litígios.' },
    { icon: Heart, color: C.red, bg: '#FFF0F0', title: 'Fundo Social e de Saúde', desc: 'Apoio em despesas médicas críticas, tratamentos de lesões e assistência em casos de paragem forçada ou incapacidade.' },
    { icon: BookOpen, color: '#4F46E5', bg: '#EEF2FF', title: 'Formação Contínua', desc: 'Bolsas e protocolos de formação para cursos de treinador, gestão desportiva ou empreendedorismo no pós-carreira.' },
    { icon: Users, color: '#D97706', bg: '#FFFBEB', title: 'Protocolos de Parceria', desc: 'Descontos e acordos exclusivos com clínicas de fisioterapia, farmácias de referência e ginásios parceiros.' }
  ];

  const posicoes = ['Guarda-Redes', 'Defesa', 'Médio', 'Avançado'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await api.cadastrarMembro(formData);
      setStatus({
        type: 'success',
        message: response.message || 'Pedido de adesão enviado com sucesso! Entraremos em contacto brevemente.'
      });
      setFormData({
        nome_completo: '',
        email: '',
        telefone: '',
        clube: '',
        posicao: 'Médio',
        data_nascimento: '',
        numero_identificacao: '',
        mensagem: '',
      });
    } catch (err) {
      console.error('Erro ao enviar pedido de filiação:', err);
      setStatus({
        type: 'error',
        message: err.message || 'Ocorreu um erro ao processar a adesão. Por favor, tente novamente.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ fontFamily: '"Inter", sans-serif', background: C.light }}>
      <PageHeader title="Área de Membros" sub="Associe-se ao sindicato de futebolistas para aceder a apoio completo de previdência social, jurídica e médica." />

      {/* Benefits */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <FadeUp style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, justifyContent: 'center' }}>
              <div style={{ width: 28, height: 2, background: `linear-gradient(90deg, ${C.green}, ${C.gold})`, borderRadius: 2 }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.green }}>Benefícios</span>
            </div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, color: C.text, margin: 0 }}>Porquê Filia-se ao SNJF-GB?</h2>
          </FadeUp>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
            {benefits.map(({ icon: Icon, color, bg, title, desc }, i) => (
              <FadeUp key={title} delay={i * 0.08}>
                <div style={{ background: '#fff', padding: '32px 28px', borderRadius: 20, border: '1px solid #E5E7EB', height: '100%', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <Icon size={20} color={color} />
                  </div>
                  <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 18, fontWeight: 700, color: C.text, margin: '0 0 10px' }}>{title}</h3>
                  <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.75, margin: 0 }}>{desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Online Registration Form */}
      <section style={{ padding: '40px 24px 100px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <FadeUp>
            <div style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', border: '1px solid #E5E7EB', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
              
              {/* Form Title banner */}
              <div style={{ background: C.dark, padding: '32px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${C.red}, ${C.gold}, ${C.green})` }} />
                <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, fontWeight: 700, color: C.gold, margin: '0 0 8px' }}>Ficha de Adesão Online</h3>
                <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 }}>Submeta a sua proposta de adesão ao nosso sindicato de jogadores de futebol.</p>
              </div>

              {/* Form body */}
              <form onSubmit={handleSubmit} style={{ padding: 40, display: 'flex', flexDirection: 'column', gap: 24 }}>
                
                {status.type && (
                  <div style={{ display: 'flex', gap: 12, padding: '16px 20px', borderRadius: 12, background: status.type === 'success' ? '#F0FAF4' : '#FFF0F0', border: `1px solid ${status.type === 'success' ? '#DEF7EC' : '#FDE8E8'}` }}>
                    {status.type === 'success' ? <CheckCircle size={18} color={C.green} style={{ flexShrink: 0, marginTop: 2 }} /> : <AlertCircle size={18} color={C.red} style={{ flexShrink: 0, marginTop: 2 }} />}
                    <span style={{ fontSize: 13.5, color: status.type === 'success' ? '#03543F' : '#9B1C1C', fontWeight: 500, lineHeight: 1.5 }}>{status.message}</span>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                  
                  {/* Nome */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label htmlFor="nome_completo" style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: C.text }}>Nome Completo <span style={{ color: C.red }}>*</span></label>
                    <input type="text" id="nome_completo" name="nome_completo" required value={formData.nome_completo} onChange={handleChange} placeholder="Ex: Admilson Silva" style={{ padding: '11px 16px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 13.5, outline: 'none', background: C.light }} />
                  </div>

                  {/* Email */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: C.text }}>E-mail <span style={{ color: C.red }}>*</span></label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Ex: jogador@email.com" style={{ padding: '11px 16px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 13.5, outline: 'none', background: C.light }} />
                  </div>

                  {/* Telefone */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: C.text }}>Telefone <span style={{ color: C.red }}>*</span></label>
                    <input type="tel" name="telefone" required value={formData.telefone} onChange={handleChange} placeholder="Ex: +245 95 000 00 00" style={{ padding: '11px 16px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 13.5, outline: 'none', background: C.light }} />
                  </div>

                  {/* Clube */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: C.text }}>Clube Atual <span style={{ color: C.red }}>*</span></label>
                    <input type="text" name="clube" required value={formData.clube} onChange={handleChange} placeholder="Ex: Benfica de Bissau" style={{ padding: '11px 16px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 13.5, outline: 'none', background: C.light }} />
                  </div>

                  {/* Posicao */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: C.text }}>Posição no Campo</label>
                    <select name="posicao" value={formData.posicao} onChange={handleChange} style={{ padding: '11px 16px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 13.5, outline: 'none', background: C.light, cursor: 'pointer' }}>
                      {posicoes.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                    </select>
                  </div>

                  {/* Data Nascimento */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: C.text }}>Data de Nascimento <span style={{ color: C.red }}>*</span></label>
                    <input type="date" name="data_nascimento" required value={formData.data_nascimento} onChange={handleChange} style={{ padding: '11px 16px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 13.5, outline: 'none', background: C.light }} />
                  </div>

                </div>

                {/* Numero Identificação */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: C.text }}>Número de Identificação (BI / Passaporte) <span style={{ color: C.red }}>*</span></label>
                  <input type="text" name="numero_identificacao" required value={formData.numero_identificacao} onChange={handleChange} placeholder="Ex: N01020304" style={{ padding: '11px 16px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 13.5, outline: 'none', background: C.light }} />
                </div>

                {/* Mensagem */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: C.text }}>Observações / Mensagem Adicional</label>
                  <textarea name="mensagem" rows={4} value={formData.mensagem} onChange={handleChange} placeholder="Alguma observação relevante..." style={{ padding: '12px 16px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 13.5, outline: 'none', background: C.light, resize: 'vertical' }} />
                </div>

                {/* Submit button */}
                <button type="submit" disabled={submitting} style={{
                  padding: '13px', background: C.green, color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', borderRadius: 50, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background-color 0.25s', marginTop: 12
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#005E28'}
                  onMouseLeave={e => e.currentTarget.style.background = C.green}
                >
                  <Send size={15} color={C.gold} /> {submitting ? 'A submeter proposta...' : 'Submeter proposta de adesão'}
                </button>

              </form>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
