const API_BASE_URL = 'http://localhost:5001/api';

// Helper para requisições autenticadas
const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('snj_admin_token');
  const isFormData = options.body instanceof FormData;
  const headers = { 
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }), 
    ...(token ? { Authorization: `Bearer ${token}` } : {}), 
    ...options.headers 
  };
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem('snj_admin_token');
    window.location.href = '/admin/login';
    throw new Error('Sessão expirada');
  }
  return res;
};

export const api = {
  // ── Público ──────────────────────────────────────────────────────────────
  getNoticias: async (categoria = '', busca = '') => {
    let url = `${API_BASE_URL}/noticias`;
    const params = [];
    if (categoria && categoria !== 'Todas') params.push(`categoria=${encodeURIComponent(categoria)}`);
    if (busca) params.push(`busca=${encodeURIComponent(busca)}`);
    if (params.length) url += `?${params.join('&')}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Falha ao obter notícias.');
    return res.json();
  },

  getNoticiaById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/noticias/${id}`);
    if (!res.ok) throw new Error('Falha ao obter notícia.');
    return res.json();
  },

  cadastrarMembro: async (data) => {
    const res = await fetch(`${API_BASE_URL}/membros`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Falha ao processar adesão.');
    return json;
  },

  enviarContacto: async (data) => {
    const res = await fetch(`${API_BASE_URL}/contactos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Falha ao enviar mensagem.');
    return json;
  },

  getConfiguracoes: async () => {
    const res = await fetch(`${API_BASE_URL}/configuracoes`);
    if (!res.ok) throw new Error('Falha ao obter configurações.');
    return res.json();
  },

  // ── Admin Auth ────────────────────────────────────────────────────────────
  adminLogin: async (username, password) => {
    const res = await fetch(`${API_BASE_URL}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Credenciais inválidas.');
    return json;
  },

  adminVerify: async () => {
    const res = await authFetch(`${API_BASE_URL}/admin/verify`);
    return res.ok;
  },

  // ── Admin Stats ───────────────────────────────────────────────────────────
  adminStats: async () => {
    const res = await authFetch(`${API_BASE_URL}/admin/stats`);
    return res.json();
  },

  // ── Admin Notícias ────────────────────────────────────────────────────────
  adminGetNoticias: async () => {
    const res = await authFetch(`${API_BASE_URL}/admin/noticias`);
    return res.json();
  },

  adminCreateNoticia: async (data) => {
    const res = await authFetch(`${API_BASE_URL}/admin/noticias`, { method: 'POST', body: JSON.stringify(data) });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
    return json;
  },

  adminUpdateNoticia: async (id, data) => {
    const res = await authFetch(`${API_BASE_URL}/admin/noticias/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
    return json;
  },

  adminDeleteNoticia: async (id) => {
    const res = await authFetch(`${API_BASE_URL}/admin/noticias/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao eliminar notícia.');
    return res.json();
  },

  // ── Admin Membros ─────────────────────────────────────────────────────────
  adminGetMembros: async () => {
    const res = await authFetch(`${API_BASE_URL}/admin/membros`);
    return res.json();
  },

  adminUpdateMembroStatus: async (id, status) => {
    const res = await authFetch(`${API_BASE_URL}/admin/membros/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
    return json;
  },

  adminDeleteMembro: async (id) => {
    const res = await authFetch(`${API_BASE_URL}/admin/membros/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao eliminar membro.');
    return res.json();
  },

  // ── Admin Contactos ───────────────────────────────────────────────────────
  adminGetContactos: async () => {
    const res = await authFetch(`${API_BASE_URL}/admin/contactos`);
    return res.json();
  },

  adminMarcarLido: async (id) => {
    const res = await authFetch(`${API_BASE_URL}/admin/contactos/${id}/lido`, { method: 'PATCH' });
    return res.json();
  },

  adminDeleteContacto: async (id) => {
    const res = await authFetch(`${API_BASE_URL}/admin/contactos/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao eliminar contacto.');
    return res.json();
  },

  adminResponderContacto: async (id, resposta) => {
    const res = await authFetch(`${API_BASE_URL}/admin/contactos/${id}/responder`, {
      method: 'POST',
      body: JSON.stringify({ resposta }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Erro ao enviar resposta.');
    return json;
  },

  // ── Admin Configurações ───────────────────────────────────────────────────
  adminGetConfiguracoes: async () => {
    const res = await authFetch(`${API_BASE_URL}/admin/configuracoes`);
    return res.json();
  },

  adminSaveConfiguracoes: async (data) => {
    const res = await authFetch(`${API_BASE_URL}/admin/configuracoes`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Erro ao guardar configurações.');
    return json;
  },

  adminUploadImagem: async (file) => {
    const formData = new FormData();
    formData.append('imagem', file);

    const res = await authFetch(`${API_BASE_URL}/admin/upload`, {
      method: 'POST',
      body: formData,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Erro ao carregar imagem.');
    return json;
  },
};
