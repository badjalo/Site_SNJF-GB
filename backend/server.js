const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const { initDatabase, query } = require('./db');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'snj_gb_secret';

// Nodemailer transporter
const createTransporter = () => nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Middlewares
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));
app.use(express.json());

// Servir pasta uploads de forma estática
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Criar pasta de uploads se não existir
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuração do Multer para upload de imagens
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'imagem-' + uniqueSuffix + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, webp, gif).'));
  }
});

/* ==========================================================================
   MIDDLEWARE: Autenticação JWT
   ========================================================================== */

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Acesso não autorizado. Token em falta.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    return res.status(403).json({ error: 'Token inválido ou expirado.' });
  }
};

/* ==========================================================================
   ROTA DE TESTE
   ========================================================================== */

app.get('/api/status', (req, res) => {
  res.json({ status: 'online', message: 'API do Sindicato Nacional dos Jogadores de Futebol da Guiné-Bissau ativa.' });
});

/* ==========================================================================
   ADMIN: Autenticação
   ========================================================================== */

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Username e password são obrigatórios.' });

  try {
    const bcrypt = require('bcryptjs');
    const result = await query('SELECT * FROM administradores WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const admin = result.rows[0];
    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ username: admin.username, role: admin.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ success: true, token });
  } catch (err) {
    console.error('Erro no login do administrador:', err.message);
    res.status(500).json({ error: 'Erro no servidor durante o login.' });
  }
});

app.get('/api/admin/verify', authMiddleware, (req, res) => {
  res.json({ valid: true, admin: req.admin.username });
});

/* ==========================================================================
   ADMIN: Upload de Imagens
   ========================================================================== */
app.post('/api/admin/upload', authMiddleware, upload.single('imagem'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum ficheiro de imagem enviado.' });
  }

  const hostUrl = req.protocol + '://' + req.get('host');
  const fileUrl = `${hostUrl}/uploads/${req.file.filename}`;

  res.json({
    success: true,
    url: fileUrl,
    filename: req.file.filename
  });
}, (err, req, res, next) => {
  res.status(400).json({ error: err.message });
});

/* ==========================================================================
   CONFIGURAÇÕES (Público)
   ========================================================================== */

app.get('/api/configuracoes', async (req, res) => {
  try {
    const result = await query(
      "SELECT chave, valor FROM configuracoes WHERE chave NOT LIKE 'email_smtp_%' ORDER BY chave"
    );
    const cfg = {};
    result.rows.forEach(r => { cfg[r.chave] = r.valor; });
    res.json(cfg);
  } catch (err) {
    console.error('Erro ao carregar configurações públicas:', err.message);
    res.status(500).json({ error: 'Erro ao carregar configurações públicas.' });
  }
});

/* ==========================================================================
   ENTIDADE: NOTÍCIA (Público)
   ========================================================================== */

app.get('/api/noticias', async (req, res) => {
  const { categoria, busca } = req.query;
  try {
    let sql = "SELECT * FROM noticias WHERE status = 'publicado'";
    const params = [];
    if (categoria && categoria !== 'Todas') {
      params.push(categoria);
      sql += ` AND categoria = $${params.length}`;
    }
    if (busca) {
      params.push(`%${busca}%`);
      sql += ` AND (titulo ILIKE $${params.length} OR resumo ILIKE $${params.length} OR conteudo ILIKE $${params.length})`;
    }
    sql += ' ORDER BY data_publicacao DESC';
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar notícias:', err.message);
    res.status(500).json({ error: 'Erro ao buscar notícias no servidor.' });
  }
});

app.get('/api/noticias/:id', async (req, res) => {
  try {
    const result = await query("SELECT * FROM noticias WHERE id = $1 AND status = 'publicado'", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Notícia não encontrada.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar detalhe da notícia.' });
  }
});

/* ==========================================================================
   ADMIN: CRUD de Notícias
   ========================================================================== */

app.get('/api/admin/noticias', authMiddleware, async (req, res) => {
  try {
    const result = await query('SELECT * FROM noticias ORDER BY data_publicacao DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar notícias.' });
  }
});

app.post('/api/admin/noticias', authMiddleware, async (req, res) => {
  const { titulo, resumo, conteudo, categoria, imagem_url, autor, status } = req.body;
  if (!titulo || !resumo || !conteudo || !categoria)
    return res.status(400).json({ error: 'Título, resumo, conteúdo e categoria são obrigatórios.' });
  try {
    const sql = `
      INSERT INTO noticias (titulo, resumo, conteudo, categoria, imagem_url, autor, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `;
    const values = [
      titulo, resumo, conteudo, categoria,
      imagem_url || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
      autor || 'Direção SNJ-GB',
      status || 'publicado'
    ];
    const result = await query(sql, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar notícia.' });
  }
});

app.put('/api/admin/noticias/:id', authMiddleware, async (req, res) => {
  const { titulo, resumo, conteudo, categoria, imagem_url, autor, status } = req.body;
  try {
    const sql = `
      UPDATE noticias SET titulo=$1, resumo=$2, conteudo=$3, categoria=$4,
      imagem_url=$5, autor=$6, status=$7
      WHERE id=$8 RETURNING *
    `;
    const values = [titulo, resumo, conteudo, categoria, imagem_url, autor, status, req.params.id];
    const result = await query(sql, values);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Notícia não encontrada.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar notícia.' });
  }
});

app.delete('/api/admin/noticias/:id', authMiddleware, async (req, res) => {
  try {
    await query('DELETE FROM noticias WHERE id=$1', [req.params.id]);
    res.json({ success: true, message: 'Notícia eliminada com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao eliminar notícia.' });
  }
});

/* ==========================================================================
   ENTIDADE: MEMBRO (Público)
   ========================================================================== */

app.post('/api/membros', async (req, res) => {
  const { nome_completo, email, telefone, clube, posicao, data_nascimento, numero_identificacao, mensagem } = req.body;
  if (!nome_completo || !email || !telefone || !clube || !data_nascimento || !numero_identificacao)
    return res.status(400).json({ error: 'Os campos obrigatórios não foram preenchidos.' });
  try {
    const checkDup = await query(
      'SELECT id FROM membros WHERE email = $1 OR numero_identificacao = $2',
      [email, numero_identificacao]
    );
    if (checkDup.rows.length > 0)
      return res.status(409).json({ error: 'Já existe um registo com este e-mail ou número de identificação.' });

    const result = await query(
      `INSERT INTO membros (nome_completo, email, telefone, clube, posicao, data_nascimento, numero_identificacao, mensagem)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [nome_completo, email, telefone, clube, posicao || '', data_nascimento, numero_identificacao, mensagem || '']
    );
    res.status(201).json({ success: true, message: 'Ficha de adesão enviada com sucesso!', membro: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar adesão no servidor.' });
  }
});

/* ==========================================================================
   ADMIN: Gestão de Membros
   ========================================================================== */

app.get('/api/admin/membros', authMiddleware, async (req, res) => {
  try {
    const result = await query('SELECT * FROM membros ORDER BY data_adesao DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar membros.' });
  }
});

app.patch('/api/admin/membros/:id/status', authMiddleware, async (req, res) => {
  const { status } = req.body;
  if (!['pendente', 'aprovado', 'rejeitado'].includes(status))
    return res.status(400).json({ error: 'Status inválido.' });
  try {
    const result = await query('UPDATE membros SET status=$1 WHERE id=$2 RETURNING *', [status, req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Membro não encontrado.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar status do membro.' });
  }
});

app.delete('/api/admin/membros/:id', authMiddleware, async (req, res) => {
  try {
    await query('DELETE FROM membros WHERE id=$1', [req.params.id]);
    res.json({ success: true, message: 'Registo de membro eliminado.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao eliminar membro.' });
  }
});

/* ==========================================================================
   ENTIDADE: CONTACTO (Público)
   ========================================================================== */

app.post('/api/contactos', async (req, res) => {
  const { nome, email, assunto, mensagem } = req.body;
  if (!nome || !email || !assunto || !mensagem)
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  try {
    const result = await query(
      `INSERT INTO contactos (nome, email, assunto, mensagem) VALUES ($1,$2,$3,$4) RETURNING *`,
      [nome, email, assunto, mensagem]
    );
    res.status(201).json({ success: true, message: 'Mensagem enviada com sucesso!', contacto: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao enviar mensagem.' });
  }
});

/* ==========================================================================
   ADMIN: Gestão de Contactos
   ========================================================================== */

app.get('/api/admin/contactos', authMiddleware, async (req, res) => {
  try {
    const result = await query('SELECT * FROM contactos ORDER BY data_envio DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar contactos.' });
  }
});

app.patch('/api/admin/contactos/:id/lido', authMiddleware, async (req, res) => {
  try {
    const result = await query('UPDATE contactos SET lido=true WHERE id=$1 RETURNING *', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao marcar contacto como lido.' });
  }
});

app.delete('/api/admin/contactos/:id', authMiddleware, async (req, res) => {
  try {
    await query('DELETE FROM contactos WHERE id=$1', [req.params.id]);
    res.json({ success: true, message: 'Mensagem eliminada.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao eliminar contacto.' });
  }
});

/* --------------------------------------------------------------------------
   ADMIN: Responder a mensagem de contacto via email
   -------------------------------------------------------------------------- */
app.post('/api/admin/contactos/:id/responder', authMiddleware, async (req, res) => {
  const { resposta } = req.body;
  if (!resposta || !resposta.trim())
    return res.status(400).json({ error: 'A resposta não pode estar vazia.' });

  try {
    // Buscar o contacto
    const contactoResult = await query('SELECT * FROM contactos WHERE id=$1', [req.params.id]);
    if (contactoResult.rows.length === 0)
      return res.status(404).json({ error: 'Mensagem não encontrada.' });

    const contacto = contactoResult.rows[0];

    // Guardar a resposta na BD
    const updated = await query(
      `UPDATE contactos SET lido=true, respondido=true, resposta=$1, data_resposta=NOW() WHERE id=$2 RETURNING *`,
      [resposta, req.params.id]
    );

    // Obter as configurações de email da base de dados
    const configResult = await query(
      "SELECT chave, valor FROM configuracoes WHERE chave IN ('email_smtp_host', 'email_smtp_port', 'email_smtp_user', 'email_smtp_pass', 'email_from')"
    );
    const cfg = {};
    configResult.rows.forEach(r => { cfg[r.chave] = r.valor; });

    const smtpHost = cfg.email_smtp_host || process.env.EMAIL_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(cfg.email_smtp_port || process.env.EMAIL_PORT) || 587;
    const smtpUser = cfg.email_smtp_user || process.env.EMAIL_USER;
    const smtpPass = cfg.email_smtp_pass || process.env.EMAIL_PASS;
    const emailFrom = cfg.email_from || process.env.EMAIL_FROM || '"SNJ-GB" <noreply@snj-gb.org>';

    // Enviar email se credenciais configuradas
    let emailEnviado = false;
    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });
        await transporter.sendMail({
          from: emailFrom,
          to: `${contacto.nome} <${contacto.email}>`,
          subject: `Re: ${contacto.assunto}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #0a0f1e; padding: 24px; border-radius: 8px 8px 0 0;">
                <img src="https://snj-gb.org/logo.png" alt="SNJ-GB" style="height: 50px;" />
                <h2 style="color: #FCD116; margin: 16px 0 0;">Sindicato Nacional dos Jogadores de Futebol da Guiné-Bissau</h2>
              </div>
              <div style="background: #f9f9f9; padding: 28px; border: 1px solid #eee;">
                <p style="color: #333; font-size: 16px;">Olá, <strong>${contacto.nome}</strong>!</p>
                <p style="color: #555;">Em resposta à sua mensagem com assunto: <strong>"${contacto.assunto}"</strong></p>
                <div style="background: #fff; border-left: 4px solid #CE1126; padding: 16px 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                  <p style="color: #333; line-height: 1.7; margin: 0; white-space: pre-wrap;">${resposta}</p>
                </div>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="color: #888; font-size: 13px;">A sua mensagem original:</p>
                <p style="color: #aaa; font-size: 13px; font-style: italic;">"${contacto.mensagem}"</p>
              </div>
              <div style="background: #0a0f1e; padding: 16px 24px; border-radius: 0 0 8px 8px; text-align: center;">
                <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 0;">SNJ-GB — Sindicato Nacional dos Jogadores de Futebol da Guiné-Bissau</p>
              </div>
            </div>
          `,
        });
        emailEnviado = true;
      } catch (emailErr) {
        console.warn('Aviso: não foi possível enviar o email:', emailErr.message);
      }
    }

    res.json({
      success: true,
      emailEnviado,
      contacto: updated.rows[0],
      message: emailEnviado
        ? 'Resposta guardada e email enviado com sucesso!'
        : 'Resposta guardada. (Email não enviado — configuração SMTP em falta.)',
    });
  } catch (err) {
    console.error('Erro ao responder contacto:', err.message);
    res.status(500).json({ error: 'Erro ao processar resposta.' });
  }
});

/* ==========================================================================
   ADMIN: Configurações do Site
   ========================================================================== */

// GET — todas as configurações
app.get('/api/admin/configuracoes', authMiddleware, async (req, res) => {
  try {
    const result = await query('SELECT * FROM configuracoes ORDER BY chave');
    // Converter para objeto { chave: valor }
    const cfg = {};
    result.rows.forEach(r => { cfg[r.chave] = r.valor; });
    res.json(cfg);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao carregar configurações.' });
  }
});

// PUT — atualizar configurações (em batch)
app.put('/api/admin/configuracoes', authMiddleware, async (req, res) => {
  const entries = Object.entries(req.body);
  if (entries.length === 0)
    return res.status(400).json({ error: 'Nenhuma configuração fornecida.' });
  try {
    for (const [chave, valor] of entries) {
      await query(
        `INSERT INTO configuracoes (chave, valor) VALUES ($1, $2)
         ON CONFLICT (chave) DO UPDATE SET valor=$2, updated_at=NOW()`,
        [chave, valor]
      );
    }
    res.json({ success: true, message: 'Configurações atualizadas com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar configurações.' });
  }
});

/* ==========================================================================
   ADMIN: Dashboard Stats
   ========================================================================== */

app.get('/api/admin/stats', authMiddleware, async (req, res) => {
  try {
    const [noticias, membros, contactos, pendentes, naoLidos, naoRespondidos] = await Promise.all([
      query('SELECT COUNT(*) FROM noticias'),
      query('SELECT COUNT(*) FROM membros'),
      query('SELECT COUNT(*) FROM contactos'),
      query("SELECT COUNT(*) FROM membros WHERE status='pendente'"),
      query('SELECT COUNT(*) FROM contactos WHERE lido=false'),
      query('SELECT COUNT(*) FROM contactos WHERE respondido=false'),
    ]);
    res.json({
      totalNoticias: parseInt(noticias.rows[0].count),
      totalMembros: parseInt(membros.rows[0].count),
      totalContactos: parseInt(contactos.rows[0].count),
      membrosPendentes: parseInt(pendentes.rows[0].count),
      contactosNaoLidos: parseInt(naoLidos.rows[0].count),
      contactosNaoRespondidos: parseInt(naoRespondidos.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao carregar estatísticas.' });
  }
});

// Iniciar base de dados e servidor
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor backend rodando em http://localhost:${PORT}`);
    console.log(`🔐 Admin: http://localhost:5173/admin`);
  });
}).catch(err => {
  console.error('Erro ao inicializar base de dados:', err.message);
  process.exit(1);
});
