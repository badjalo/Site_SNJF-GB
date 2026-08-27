import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Shield, ChevronRight } from 'lucide-react';
import { api } from '../services/api';

const C = { green: '#007A33', gold: '#FCD116', red: '#CE1126', dark: '#0A0F1E', text: '#111827', muted: '#6B7280', light: '#F9FAFB' };

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [noticia, setNoticia] = useState(null);
  const [outrasNoticias, setOutrasNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticleData = async () => {
      setLoading(true);
      setError(null);
      try {
        const article = await api.getNoticiaById(id);
        setNoticia(article);
        
        const all = await api.getNoticias();
        setOutrasNoticias(all.filter(n => n.id !== parseInt(id)).slice(0, 3));
      } catch (err) {
        console.error('Erro ao buscar detalhe da notícia:', err);
        setError('Não foi possível carregar o artigo. Pode ter sido removido ou o link é inválido.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticleData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ fontFamily: '"Inter", sans-serif', background: C.light, minHeight: '100vh' }}>
        {/* Breadcrumb Skeleton */}
        <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', paddingTop: 90, paddingBottom: 12 }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 8 }}>
            <div className="skeleton-shimmer" style={{ height: 14, width: 200, borderRadius: 4 }} />
          </div>
        </div>

        <section style={{ padding: '56px 24px 100px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'row', gap: 48, flexWrap: 'wrap' }}>
            
            {/* Main Content Skeleton */}
            <article style={{ flex: '1 1 640px', background: '#fff', borderRadius: 24, padding: '32px 32px 48px', border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div className="skeleton-shimmer" style={{ height: 16, width: 120, borderRadius: 4, marginBottom: 24 }} />
              <div className="skeleton-shimmer" style={{ height: 22, width: 100, borderRadius: 20, marginBottom: 16 }} />
              <div className="skeleton-shimmer" style={{ height: 40, width: '85%', borderRadius: 8, marginBottom: 8 }} />
              <div className="skeleton-shimmer" style={{ height: 40, width: '60%', borderRadius: 8, marginBottom: 16 }} />
              <div className="skeleton-shimmer" style={{ height: 20, width: 250, borderRadius: 4, marginBottom: 32 }} />
              
              <div className="skeleton-shimmer" style={{ height: 420, width: '100%', borderRadius: 16, marginBottom: 32 }} />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="skeleton-shimmer" style={{ height: 16, width: '100%', borderRadius: 4 }} />
                <div className="skeleton-shimmer" style={{ height: 16, width: '95%', borderRadius: 4 }} />
                <div className="skeleton-shimmer" style={{ height: 16, width: '98%', borderRadius: 4 }} />
                <div className="skeleton-shimmer" style={{ height: 16, width: '80%', borderRadius: 4 }} />
              </div>
            </article>

            {/* Sidebar Skeleton */}
            <aside style={{ flex: '1 1 300px', maxWidth: 360 }}>
              <div className="skeleton-shimmer" style={{ height: 260, width: '100%', borderRadius: 24, marginBottom: 32 }} />
              <div style={{ background: '#fff', padding: 24, borderRadius: 24, border: '1px solid #E5E7EB' }}>
                <div className="skeleton-shimmer" style={{ height: 20, width: 120, borderRadius: 4, marginBottom: 24 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ display: 'flex', gap: 12 }}>
                      <div className="skeleton-shimmer" style={{ width: 64, height: 64, borderRadius: 10, flexShrink: 0 }} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
                        <div className="skeleton-shimmer" style={{ height: 10, width: 60, borderRadius: 4 }} />
                        <div className="skeleton-shimmer" style={{ height: 14, width: '100%', borderRadius: 4 }} />
                        <div className="skeleton-shimmer" style={{ height: 14, width: '70%', borderRadius: 4 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    );
  }

  if (error || !noticia) {
    return (
      <div style={{ maxWidth: 480, margin: '160px auto 100px', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FFF0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Shield size={28} color={C.red} />
        </div>
        <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 12 }}>Artigo não encontrado</h2>
        <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, marginBottom: 24 }}>{error || 'A notícia solicitada não está disponível.'}</p>
        <button onClick={() => navigate('/noticias')} style={{ padding: '10px 24px', background: C.green, color: '#fff', border: 'none', borderRadius: 50, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Voltar às notícias</button>
      </div>
    );
  }

  const paragrafos = noticia.conteudo ? noticia.conteudo.split('\\n') : [];

  return (
    <div style={{ fontFamily: '"Inter", sans-serif', background: C.light, minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', paddingTop: 90, paddingBottom: 12 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: C.muted }}>
          <Link to="/" style={{ color: C.muted, textDecoration: 'none' }}>Início</Link>
          <ChevronRight size={12} />
          <Link to="/noticias" style={{ color: C.muted, textDecoration: 'none' }}>Notícias</Link>
          <ChevronRight size={12} />
          <span style={{ color: C.text, fontWeight: 600, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 250 }}>{noticia.titulo}</span>
        </div>
      </div>

      <section style={{ padding: '56px 24px 100px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'row', gap: 48, flexWrap: 'wrap' }} className="article-layout">
          
          {/* Main Content */}
          <article style={{ flex: '1 1 640px', background: '#fff', borderRadius: 24, padding: '32px 32px 48px', border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <button onClick={() => navigate('/noticias')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: C.green, fontSize: 13, fontWeight: 700, padding: 0, marginBottom: 24 }}>
              <ArrowLeft size={14} /> Voltar à listagem
            </button>

            <div style={{ marginBottom: 24 }}>
              <span style={{ display: 'inline-block', background: '#F0FAF4', color: C.green, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 20, marginBottom: 16 }}>{noticia.categoria}</span>
              <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: C.text, margin: '0 0 16px', lineHeight: 1.25 }}>{noticia.titulo}</h1>
              <div style={{ display: 'flex', gap: 16, borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6', padding: '12px 0', fontSize: 12.5, color: C.muted }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={13} color={C.green} />
                  {new Date(noticia.data_publicacao).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <User size={13} color={C.green} />
                  Publicado por: <span style={{ fontWeight: 600, color: C.text }}>{noticia.autor}</span>
                </span>
              </div>
            </div>

            {/* Resume */}
            <p style={{ fontSize: 16, color: C.text, fontWeight: 500, borderLeft: `3px solid ${C.gold}`, paddingLeft: 16, margin: '0 0 32px', lineHeight: 1.8, fontStyle: 'italic' }}>
              {noticia.resumo}
            </p>

            {/* Image */}
            <div style={{ borderRadius: 16, overflow: 'hidden', height: 420, marginBottom: 32, background: C.light }}>
              <img src={noticia.imagem_url || '/logo.png'} alt={noticia.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.src = '/logo.png'} />
            </div>

            {/* Paragraphs */}
            <div style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, spaceY: '24px' }}>
              {paragrafos.map((p, idx) => {
                const text = p.trim();
                if (!text) return null;
                return <p key={idx} style={{ marginBottom: 20 }}>{text}</p>;
              })}
            </div>
          </article>

          {/* Sidebar */}
          <aside style={{ flex: '1 1 300px', maxWidth: 360 }} className="article-sidebar">
            
            {/* CTA */}
            <div style={{ background: C.dark, color: '#fff', padding: 32, borderRadius: 24, border: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden', marginBottom: 32 }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${C.red}, ${C.gold}, ${C.green})` }} />
              <h4 style={{ fontFamily: '"Playfair Display", serif', fontSize: 19, fontWeight: 700, color: C.gold, margin: '0 0 12px' }}>Filia-te no Sindicato</h4>
              <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: '0 0 24px' }}>
                Acede a apoio legal gratuito, assistência médica e cobertura do fundo social. Faz parte do nosso coletivo.
              </p>
              <Link to="/membros" style={{ display: 'block', textAlign: 'center', padding: '11px', background: C.green, color: '#fff', fontSize: 13, fontWeight: 700, borderRadius: 50, textDecoration: 'none', transition: 'background-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#005E28'}
                onMouseLeave={e => e.currentTarget.style.background = C.green}
              >Aderir Agora</Link>
            </div>

            {/* Recommendations */}
            {outrasNoticias.length > 0 && (
              <div style={{ background: '#fff', padding: 24, borderRadius: 24, border: '1px solid #E5E7EB' }}>
                <h4 style={{ fontFamily: '"Playfair Display", serif', fontSize: 16, fontWeight: 700, color: C.text, borderBottom: '1px solid #F3F4F6', paddingBottom: 12, margin: '0 0 16px' }}>Mais Notícias</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {outrasNoticias.map(item => (
                    <Link key={item.id} to={`/noticias/${item.id}`} style={{ display: 'flex', gap: 12, textDecoration: 'none', alignItems: 'center' }}>
                      <div style={{ width: 64, height: 64, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: C.light }}>
                        <img src={item.imagem_url || '/logo.png'} alt={item.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.src = '/logo.png'} />
                      </div>
                      <div>
                        <span style={{ fontSize: 9, fontWeight: 700, color: C.green, textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>{item.categoria}</span>
                        <h5 style={{ fontSize: 12.5, fontWeight: 700, color: C.text, margin: 0, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.titulo}</h5>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>

        </div>
      </section>

      <style>{`
        @media(max-width: 1024px) {
          .article-layout { flex-direction: column !important; }
          .article-sidebar { max-width: 100% !important; width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
