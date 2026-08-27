import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Users, Award, CheckCircle, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import { useConfig } from '../context/ConfigContext';

const C = { green: '#007A33', gold: '#FCD116', red: '#CE1126', dark: '#0A0F1E', card: '#fff', text: '#111827', muted: '#6B7280', light: '#F9FAFB' };

/* ── Fade-up animation wrapper ── */
const FadeUp = ({ children, delay = 0, style = {} }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    style={style}
  >
    {children}
  </motion.div>
);

/* ── Section label ── */
const SectionLabel = ({ children, light = false }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
    <div style={{ width: 28, height: 2, background: `linear-gradient(90deg, ${C.green}, ${C.gold})`, borderRadius: 2 }} />
    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: light ? 'rgba(255,255,255,0.5)' : C.green }}>
      {children}
    </span>
  </div>
);

/* ── News card ── */
const NewsCard = ({ n }) => (
  <Link to={`/noticias/${n.id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: C.card, borderRadius: 16, overflow: 'hidden', border: '1px solid #E5E7EB', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', transition: 'all 0.3s' }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.12)'; e.currentTarget.style.borderColor = C.green + '40'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
  >
    <div style={{ height: 200, overflow: 'hidden', position: 'relative', background: '#f3f4f6' }}>
      <img src={n.imagem_url || '/logo.png'} alt={n.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
        onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.target.style.transform = 'none'}
        onError={e => e.target.src = '/logo.png'}
      />
      <span style={{ position: 'absolute', top: 14, left: 14, background: C.green, color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 20 }}>{n.categoria}</span>
    </div>
    <div style={{ padding: '22px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>{new Date(n.data_publicacao).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
      <h4 style={{ fontFamily: '"Playfair Display", serif', fontSize: 17, fontWeight: 700, color: C.text, margin: '0 0 10px', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{n.titulo}</h4>
      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: '0 0 20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>{n.resumo}</p>
      <span style={{ fontSize: 12, fontWeight: 700, color: C.green, display: 'flex', alignItems: 'center', gap: 4 }}>
        Ler artigo <ArrowRight size={13} />
      </span>
    </div>
  </Link>
);

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { config } = useConfig();

  useEffect(() => {
    api.getNoticias().then(d => { setNews(d.slice(0, 5)); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ fontFamily: '"Inter", sans-serif' }}>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section style={{ minHeight: '100vh', background: C.dark, display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Blobs */}
        <div style={{ position: 'absolute', top: '15%', left: '8%', width: 480, height: 480, background: `radial-gradient(circle, ${C.green}30 0%, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 400, height: 400, background: `radial-gradient(circle, ${C.red}20 0%, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', right: '20%', width: 300, height: 300, background: `radial-gradient(circle, ${C.gold}15 0%, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none' }} />

        {/* Grid pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '120px 24px 80px', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>

            {/* Left: Text */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 50, padding: '6px 16px', marginBottom: 32 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.red, animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Sindicato Oficial dos Jogadores da Guiné-Bissau</span>
                </div>
              </motion.div>

              <motion.h1
                style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, color: '#fff', lineHeight: 1.1, margin: '0 0 24px', letterSpacing: '-0.03em' }}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              >
                Unidos pela{' '}
                <span style={{ background: `linear-gradient(135deg, ${C.green}, ${C.gold})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Dignidade
                </span>{' '}
                do Futebolista
              </motion.h1>

              <motion.p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, margin: '0 0 40px', maxWidth: 480 }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              >
                O SNJF-GB protege, representa e apoia os futebolistas guineenses. Lutamos por melhores condições de trabalho, saúde e dignidade nos estádios do nosso país.
              </motion.p>

              <motion.div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Link to="/membros" style={{ padding: '14px 32px', background: `linear-gradient(135deg, ${C.green}, #005E28)`, color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: 50, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, boxShadow: `0 8px 32px ${C.green}50`, border: 'none', transition: 'all 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 12px 40px ${C.green}70`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 8px 32px ${C.green}50`; }}
                >
                  Aderir ao Sindicato <ArrowRight size={15} color={C.gold} />
                </Link>
                <Link to="/sobre" style={{ padding: '14px 32px', background: 'rgba(255,255,255,0.07)', color: '#fff', fontWeight: 600, fontSize: 14, borderRadius: 50, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)', transition: 'all 0.25s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                >
                  Saber Mais
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div style={{ display: 'flex', gap: 32, marginTop: 56, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.07)' }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}
              >
                {[
                  [config.stat_1_valor || '100+', config.stat_1_label || 'Atletas Filiados'],
                  [config.stat_2_valor || '3', config.stat_2_label || 'Anos de Luta'],
                  [config.stat_3_valor || '24h', config.stat_3_label || 'Apoio Jurídico']
                ].map(([val, label]) => (
                  <div key={label}>
                    <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 800, color: C.gold, lineHeight: 1 }}>{val}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4, letterSpacing: '0.05em' }}>{label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Logo card */}
            <motion.div style={{ display: 'flex', justifyContent: 'center' }}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{ position: 'relative', width: 380, height: 380 }}>
                {/* Glow ring */}
                <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', background: `radial-gradient(circle, ${C.green}25 0%, transparent 70%)` }} />
                {/* Card */}
                <div style={{ width: '100%', height: '100%', borderRadius: 24, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${C.red}, ${C.gold}, ${C.green})` }} />
                  <img src="/logo.png" alt="SNJF-GB" style={{ width: '80%', height: '80%', objectFit: 'contain', filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.5))' }} />
                </div>
                {/* Floating badge top-right */}
                <div style={{ position: 'absolute', top: -10, right: -10, background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Shield size={14} color={C.gold} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Protegido</span>
                </div>
                {/* Floating badge bottom-left */}
                <div style={{ position: 'absolute', bottom: -10, left: -10, background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Users size={14} color={C.green + 'ee'} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Unidos</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Responsive hero grid fix */}
        <style>{`@media(max-width:768px){.hero-grid{grid-template-columns:1fr!important}.hero-logo{display:none!important}}`}</style>
      </section>

      {/* ══════════════════════════════════════
          MISSÃO
      ══════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <FadeUp style={{ textAlign: 'center', marginBottom: 64 }}>
            <SectionLabel>A Nossa Missão</SectionLabel>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: C.text, margin: '0 0 16px' }}>
              Defender quem cria o espetáculo
            </h2>
            <p style={{ fontSize: 16, color: C.muted, maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
              Três pilares fundamentais sustentam toda a ação do sindicato em prol dos atletas guineenses.
            </p>
          </FadeUp>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
            {[
              { icon: Shield, color: C.green, bg: '#F0FAF4', title: 'Defesa de Direitos', desc: 'Assegurar contratos dignos, seguros médicos e assessoria jurídica gratuita a todos os atletas filiados em qualquer situação.' },
              { icon: Users, color: '#4F46E5', bg: '#EEF2FF', title: 'Solidariedade Social', desc: 'Fundo de apoio financeiro temporário a jogadores desempregados, lesionados ou em situação de vulnerabilidade comprovada.' },
              { icon: Award, color: '#D97706', bg: '#FFFBEB', title: 'Formação e Futuro', desc: 'Bolsas de estudo para cursos de gestão desportiva, treinador e empreendedorismo — preparando o atleta para o pós-carreira.' },
            ].map(({ icon: Icon, color, bg, title, desc }, i) => (
              <FadeUp key={title} delay={i * 0.1}>
                <div style={{ background: C.light, borderRadius: 20, padding: '36px 32px', border: '1px solid #E5E7EB', transition: 'all 0.3s', height: '100%' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = color + '40'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                    <Icon size={22} color={color} />
                  </div>
                  <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 20, fontWeight: 700, color: C.text, margin: '0 0 12px' }}>{title}</h3>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, margin: 0 }}>{desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SOBRE NÓS (Short)
      ══════════════════════════════════════ */}
      <section style={{ background: C.light, padding: '100px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <FadeUp>
            <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden' }}>
              <img src="/quem_somos.png" alt="Futebol" style={{ width: '100%', height: 460, objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,15,30,0.7) 0%, transparent 60%)' }} />
              <div style={{ position: 'absolute', bottom: 28, left: 28, right: 28 }}>
                <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', borderRadius: 14, padding: '20px 24px', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Fundado para Proteger</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Dignidade e respeito para cada atleta guineense.</div>
                </div>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <SectionLabel>Quem Somos</SectionLabel>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, color: C.text, margin: '0 0 20px' }}>
              A Voz dos Futebolistas da Guiné-Bissau
            </h2>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.85, margin: '0 0 16px' }}>
              O SNJF-GB nasceu da necessidade de dotar o futebolista guineense de uma estrutura que possa dialogar com a Federação, os clubes e as organizações internacionais como a FIFPRO.
            </p>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.85, margin: '0 0 32px' }}>
              Representamos jogadores dentro e fora do país, zelando pela previdência social, respeito contratual e formação continuada.
            </p>
            {[
              'Afiliação institucional em crescimento internacional',
              'Fundo social apoiado por quotas e doações',
              'Assistência jurídica gratuita para todos os filiados',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#F0FAF4', border: `1.5px solid ${C.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle size={12} color={C.green} />
                </div>
                <span style={{ fontSize: 13.5, color: C.text, fontWeight: 500 }}>{item}</span>
              </div>
            ))}
            <Link to="/sobre" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 32, color: C.green, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.gap = '12px'}
              onMouseLeave={e => e.currentTarget.style.gap = '8px'}
            >
              Conhecer a nossa história <ArrowRight size={15} />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════
          NOTÍCIAS RECENTES
      ══════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <FadeUp style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 52, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <SectionLabel>Atualidade</SectionLabel>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, color: C.text, margin: 0 }}>Últimas Notícias</h2>
            </div>
            <Link to="/noticias" style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.green, fontWeight: 700, fontSize: 13.5, textDecoration: 'none' }}>
              Ver todas <ChevronRight size={16} />
            </Link>
          </FadeUp>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #E5E7EB', height: 420, display: 'flex', flexDirection: 'column' }}>
                  <div className="skeleton-shimmer" style={{ height: 200, width: '100%' }} />
                  <div style={{ padding: '22px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div className="skeleton-shimmer" style={{ height: 12, width: 90, borderRadius: 4, marginBottom: 4 }} />
                    <div className="skeleton-shimmer" style={{ height: 20, width: '90%', borderRadius: 4 }} />
                    <div className="skeleton-shimmer" style={{ height: 20, width: '40%', borderRadius: 4 }} />
                    <div style={{ flex: 1, marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div className="skeleton-shimmer" style={{ height: 10, width: '100%', borderRadius: 3 }} />
                      <div className="skeleton-shimmer" style={{ height: 10, width: '95%', borderRadius: 3 }} />
                      <div className="skeleton-shimmer" style={{ height: 10, width: '70%', borderRadius: 3 }} />
                    </div>
                    <div className="skeleton-shimmer" style={{ height: 14, width: 100, borderRadius: 4, marginTop: 16 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
              {news.map((n, i) => (
                <FadeUp key={n.id} delay={i * 0.1}><NewsCard n={n} /></FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA FINAL
      ══════════════════════════════════════ */}
      <section style={{ background: C.dark, padding: '100px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center, ${C.green}18 0%, transparent 65%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.red}, ${C.gold}, ${C.green})` }} />
        <FadeUp style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: `${C.green}20`, border: `1px solid ${C.green}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
            <Shield size={28} color={C.gold} />
          </div>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(26px, 4vw, 46px)', fontWeight: 800, color: '#fff', margin: '0 0 20px', lineHeight: 1.2 }}>
            Faz Parte da Mudança do Futebol Guineense
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.85, margin: '0 0 40px' }}>
            Junta-te a centenas de colegas na luta pela proteção jurídica, profissional e social. Unidos somos mais fortes — dentro e fora de campo.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/membros" style={{ padding: '15px 36px', background: C.gold, color: C.dark, fontWeight: 800, fontSize: 14, borderRadius: 50, textDecoration: 'none', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.transform = 'none'; }}
            >
              Filiar-me no SNJF-GB
            </Link>
            <Link to="/contacto" style={{ padding: '15px 36px', background: 'transparent', color: '#fff', fontWeight: 600, fontSize: 14, borderRadius: 50, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)', transition: 'all 0.25s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Falar com o Sindicato
            </Link>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}
