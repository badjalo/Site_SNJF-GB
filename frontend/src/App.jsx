import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Members from './pages/Members';
import Contact from './pages/Contact';
// Admin pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminNoticias from './pages/AdminNoticias';
import AdminMembros from './pages/AdminMembros';
import AdminContactos from './pages/AdminContactos';
import AdminConfiguracoes from './pages/AdminConfiguracoes';
import AdminSobre from './pages/AdminSobre';
import NotFound from './pages/NotFound';
import { ConfigProvider } from './context/ConfigContext';

// Layout público (com Navbar + Footer)
function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA]">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ConfigProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* ── Rotas Públicas ── */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/sobre" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/noticias" element={<PublicLayout><News /></PublicLayout>} />
          <Route path="/noticias/:id" element={<PublicLayout><NewsDetail /></PublicLayout>} />
          <Route path="/membros" element={<PublicLayout><Members /></PublicLayout>} />
          <Route path="/contacto" element={<PublicLayout><Contact /></PublicLayout>} />

          {/* ── Rotas Admin (sem Navbar/Footer) ── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/noticias" element={<AdminNoticias />} />
          <Route path="/admin/membros" element={<AdminMembros />} />
          <Route path="/admin/contactos" element={<AdminContactos />} />
          <Route path="/admin/configuracoes" element={<AdminConfiguracoes />} />
          <Route path="/admin/sobre" element={<AdminSobre />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}
