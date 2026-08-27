import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, User, ArrowRight, BookOpen, AlertCircle, X } from 'lucide-react';
import { api } from '../services/api';

const C = { green: '#007A33', gold: '#FCD116', red: '#CE1126', dark: '#0A0F1E', text: '#111827', muted: '#6B7280', light: '#F9FAFB' };

const categorias = ['Todas', 'Comunicados', 'Eventos', 'Formação', 'Tecnologia'];

const catColors = { Comunicados: { bg: '#F0FAF4', text: '#007A33' }, Eventos: { bg: '#EEF2FF', text: '#4F46E5' }, Formação: { bg: '#FFFBEB', text: '#D97706' }, Tecnologia: { bg: '#FFF0F0', text: '#CE1126' } };

export default function News() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [categoria, setCategoria] = useState('Todas');
  const [busca, setBusca]         = useState('');
  const [termo, setTermo]         = useState('');

  useEffect(() => {
    setLoading(true); setError(null);
    api.getNoticias(categoria, termo)
      .then(setNoticias)
      .catch(() => setError('Erro ao carregar notícias. Tente novamente.'))
      .finally(() => setLoading(false));
  }, [categoria, termo]);

  return (
    <div style={{ fontFamily: '"Inter", sans-serif' }}>

      {/* ── Page Header ── */}
      <section style={{ background: C.dark, padding: '120px 24px 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 20% 50%, ${C.green}18 0%, transparent 60%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 28, height: 2, background: `linear-gradient(90deg, ${C.green}, ${C.gold})`, borderRadius: 2 }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Atualidade</span>
            </div>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: '#fff', margin: '0 0 14px', letterSpacing: '-0.02em' }}>Notícias e Comunicados</h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', maxWidth: 500, lineHeight: 1.75, margin: 0 }}>
              Todas as atualizações, tomadas de posição, eventos e comunicados oficiais do sindicato.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Filters ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 70, zIndex: 30 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 24px', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {/* Category pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categorias.map(cat => (
              <button key={cat} onClick={() => setCategoria(cat)} style={{
                padding: '7px 18px', borderRadius: 50, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                border: categoria === cat ? `1.5px solid ${C.green}` : '1.5px solid #E5E7EB',
                background: categoria === cat ? C.green : 'transparent',
                color: categoria === cat ? '#fff' : C.muted,
                transition: 'all 0.2s',
              }}>{cat}</button>
            ))}
          </div>
          {/* Search */}
          <form onSubmit={e => { e.preventDefault(); setTermo(busca); }} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={15} color="#9CA3AF" style={{ position: 'absolute', left: 14, pointerEvents: 'none' }} />
            <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Pesquisar notícias..." style={{
              paddingLeft: 38, paddingRight: termo ? 76 : 44, paddingTop: 9, paddingBottom: 9,
              border: '1.5px solid #E5E7EB', borderRadius: 50, fontSize: 13, outline: 'none',
              width: 260, background: C.light, color: C.text, transition: 'border-color 0.2s',
            }}
              onFocus={e => e.target.style.borderColor = C.green}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'}
            />
            {termo && (
              <button type="button" onClick={() => { setBusca(''); setTermo(''); }} style={{ position: 'absolute', right: 46, background: 'none', border: 'none', cursor: 'pointer', color: C.muted, display: 'flex' }}>
                <X size={13} />
              </button>
            )}
            <button type="submit" style={{ position: 'absolute', right: 5, padding: '5px 12px', background: C.green, color: '#fff', border: 'none', borderRadius: 50, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Ir</button>
          </form>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <section style={{ background: C.light, minHeight: '60vh', padding: '60px 24px 100px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 28 }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: '1px solid #E5E7EB', height: 420, display: 'flex', flexDirection: 'column' }}>
                  <div className="skeleton-shimmer" style={{ height: 210, width: '100%' }} />
                  <div style={{ padding: '22px 24px 26px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <div className="skeleton-shimmer" style={{ height: 12, width: 80, borderRadius: 4 }} />
                      <div className="skeleton-shimmer" style={{ height: 12, width: 60, borderRadius: 4 }} />
                    </div>
                    <div className="skeleton-shimmer" style={{ height: 20, width: '90%', borderRadius: 4, marginTop: 8 }} />
                    <div className="skeleton-shimmer" style={{ height: 20, width: '40%', borderRadius: 4 }} />
                    <div style={{ flex: 1, marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div className="skeleton-shimmer" style={{ height: 10, width: '100%', borderRadius: 3 }} />
                      <div className="skeleton-shimmer" style={{ height: 10, width: '95%', borderRadius: 3 }} />
                      <div className="skeleton-shimmer" style={{ height: 10, width: '70%', borderRadius: 3 }} />
                    </div>
                    <div className="skeleton-shimmer" style={{ height: 14, width: 120, borderRadius: 4, marginTop: 16 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
              <AlertCircle size={40} color={C.red} style={{ margin: '0 auto 16px' }} />
              <p style={{ color: C.muted, fontSize: 14 }}>{error}</p>
            </div>
          ) : noticias.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 24px', background: '#fff', borderRadius: 20, border: '2px dashed #E5E7EB', maxWidth: 500, margin: '0 auto' }}>
              <BookOpen size={36} color="#D1D5DB" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, color: C.text, margin: '0 0 10px' }}>Nenhuma notícia encontrada</h3>
              <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, margin: '0 0 24px' }}>Nenhum artigo corresponde aos filtros aplicados.</p>
              <button onClick={() => { setCategoria('Todas'); setBusca(''); setTermo(''); }} style={{ padding: '10px 24px', background: C.green, color: '#fff', border: 'none', borderRadius: 50, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Ver todas</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 28 }}>
              {noticias.map((n, i) => {
                const cc = catColors[n.categoria] || { bg: '#F0FAF4', text: C.green };
                return (
                  <motion.div key={n.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.25) }}>
                    <Link to={`/noticias/${n.id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 18, overflow: 'hidden', border: '1px solid #E5E7EB', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', transition: 'all 0.3s', height: '100%' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.12)'; e.currentTarget.style.borderColor = C.green + '50'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
                    >
                      <div style={{ height: 210, overflow: 'hidden', position: 'relative', background: '#f3f4f6', flexShrink: 0 }}>
                        <img src={n.imagem_url || '/logo.png'} alt={n.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                          onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                          onMouseLeave={e => e.target.style.transform = 'none'}
                          onError={e => e.target.src = '/logo.png'}
                        />
                        <span style={{ position: 'absolute', top: 14, left: 14, background: cc.bg, color: cc.text, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 20 }}>{n.categoria}</span>
                      </div>
                      <div style={{ padding: '22px 24px 26px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                          <span style={{ fontSize: 11, color: C.muted, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Calendar size={11} color={C.green} />
                            {new Date(n.data_publicacao).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span style={{ fontSize: 11, color: C.muted, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <User size={11} color={C.green} />
                            {n.autor}
                          </span>
                        </div>
                        <h4 style={{ fontFamily: '"Playfair Display", serif', fontSize: 17.5, fontWeight: 700, color: C.text, margin: '0 0 10px', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{n.titulo}</h4>
                        <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.75, margin: '0 0 20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>{n.resumo}</p>
                        <span style={{ fontSize: 12, fontWeight: 700, color: C.green, display: 'flex', alignItems: 'center', gap: 5 }}>Ler artigo completo <ArrowRight size={12} /></span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
