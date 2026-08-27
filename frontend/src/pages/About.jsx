import { motion } from 'framer-motion';
import { Shield, Heart, CheckCircle, Award, Star, Users } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

const C = { green: '#007A33', gold: '#FCD116', red: '#CE1126', dark: '#0A0F1E', text: '#111827', muted: '#6B7280', light: '#F9FAFB' };
const IconMap = { Shield, Heart, CheckCircle, Award, Star, Users };

const FadeUp = ({ children, delay = 0, style = {} }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} style={style}>
    {children}
  </motion.div>
);

const SectionLabel = ({ children, light }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
    <div style={{ width: 28, height: 2, background: `linear-gradient(90deg, ${C.green}, ${C.gold})`, borderRadius: 2 }} />
    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: light ? 'rgba(255,255,255,0.5)' : C.green }}>{children}</span>
  </div>
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

export default function About() {
  const { config, loading } = useConfig();

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Carregando...</div>;

  const values = config.sobre_valores || [];
  const board = config.sobre_corpo_dirigente || [];
  const timeline = config.sobre_linha_tempo || [];
  const hist1 = config.sobre_historia_1 || '';
  const hist2 = config.sobre_historia_2 || '';

  return (
    <div style={{ fontFamily: '"Inter", sans-serif' }}>
      <PageHeader title={`Sobre o ${config.site_sigla || 'SNJF-GB'}`} sub="Conheça a história, os valores e a equipa que trabalha diariamente pela dignidade dos futebolistas guineenses." />

      {/* História */}
      <section style={{ background: '#fff', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <FadeUp>
            <SectionLabel>A Nossa Origem</SectionLabel>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, color: C.text, margin: '0 0 20px' }}>História do Sindicato</h2>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.85, margin: '0 0 16px' }}>{hist1}</p>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.85 }}>{hist2}</p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden' }}>
              <img src="/estadio.png" alt="Estádio" style={{ width: '100%', height: 440, objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,15,30,0.6) 0%, transparent 60%)' }} />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Valores */}
      <section style={{ background: C.light, padding: '100px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <FadeUp style={{ textAlign: 'center', marginBottom: 60 }}>
            <SectionLabel>Pilares Fundamentais</SectionLabel>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, color: C.text, margin: 0 }}>Os Nossos Valores</h2>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {values.map(({ icon, color, bg, title, text }, i) => {
              const Icon = IconMap[icon] || Star;
              return (
              <FadeUp key={title} delay={i * 0.08}>
                <div style={{ background: '#fff', borderRadius: 20, padding: '32px 28px', border: '1px solid #E5E7EB', height: '100%', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.09)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}><Icon size={22} color={color} /></div>
                  <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 19, fontWeight: 700, color: C.text, margin: '0 0 10px' }}>{title}</h3>
                  <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.8, margin: 0 }}>{text}</p>
                </div>
              </FadeUp>
            )})}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ background: '#fff', padding: '100px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <FadeUp style={{ textAlign: 'center', marginBottom: 64 }}>
            <SectionLabel>Jornada de Luta</SectionLabel>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, color: C.text, margin: 0 }}>Linha do Tempo</h2>
          </FadeUp>
          <div style={{ position: 'relative', paddingLeft: 40 }}>
            <div style={{ position: 'absolute', left: 16, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, #007A33, #FCD116, #CE1126)', borderRadius: 2 }} />
            {timeline.map(({ year, title, desc }, i) => (
              <FadeUp key={year} delay={i * 0.1} style={{ marginBottom: 44, position: 'relative' }}>
                <div style={{ position: 'absolute', left: -32, top: 4, width: 14, height: 14, borderRadius: '50%', background: [C.green, C.green, '#D97706', C.red, '#4F46E5'][i], border: '3px solid #fff', boxShadow: '0 0 0 2px ' + [C.green, C.green, '#D97706', C.red, '#4F46E5'][i] + '40' }} />
                <span style={{ display: 'inline-block', background: C.dark, color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, marginBottom: 10, letterSpacing: '0.05em' }}>{year}</span>
                <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 20, fontWeight: 700, color: C.text, margin: '0 0 8px' }}>{title}</h3>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75, margin: 0 }}>{desc}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Direção */}
      <section style={{ background: C.light, padding: '100px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <FadeUp style={{ textAlign: 'center', marginBottom: 60 }}>
            <SectionLabel>Corpo Dirigente</SectionLabel>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, color: C.text, margin: 0 }}>Órgãos de Direção</h2>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {board.map(({ role, name, desc, img }, i) => (
              <FadeUp key={role + i} delay={i * 0.08}>
                <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #E5E7EB', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
                >
                  <div style={{ height: 220, overflow: 'hidden', position: 'relative' }}>
                    <img src={img} alt={role} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(80%)', transition: 'filter 0.4s' }}
                      onMouseEnter={e => e.target.style.filter = 'grayscale(0%)'}
                      onMouseLeave={e => e.target.style.filter = 'grayscale(80%)'}
                    />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.red}, ${C.gold}, ${C.green})` }} />
                  </div>
                  <div style={{ padding: '24px 24px 28px', textAlign: 'center' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.green, marginBottom: 8 }}>{role}</div>
                    {name && <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: C.text }}>{name}</h4>}
                    <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: 0 }}>{desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
