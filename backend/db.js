const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5433,
  database: process.env.DB_NAME || 'snj_gb_institucional',
  user: process.env.DB_USER || 'Badjalo',
  password: process.env.DB_PASSWORD || 'Badjalo25',
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on('connect', () => {
  console.log('🔗 Conectado ao PostgreSQL (snj_gb_institucional)');
});

pool.on('error', (err) => {
  console.error('❌ Erro no Pool de Conexões:', err.message);
});

// Inicialização das Tabelas e Dados Iniciais
const initDatabase = async () => {
  const initSql = `
    -- Tabela de Notícias
    CREATE TABLE IF NOT EXISTS noticias (
      id SERIAL PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      resumo TEXT NOT NULL,
      conteudo TEXT NOT NULL,
      categoria VARCHAR(100) NOT NULL,
      imagem_url VARCHAR(512),
      autor VARCHAR(150) DEFAULT 'Direção SNJ-GB',
      data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(50) DEFAULT 'publicado'
    );

    -- Tabela de Membros (Fichas de Adesão)
    CREATE TABLE IF NOT EXISTS membros (
      id SERIAL PRIMARY KEY,
      nome_completo VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      telefone VARCHAR(50) NOT NULL,
      clube VARCHAR(255) NOT NULL,
      posicao VARCHAR(100),
      data_nascimento DATE NOT NULL,
      numero_identificacao VARCHAR(100) NOT NULL,
      mensagem TEXT,
      status VARCHAR(50) DEFAULT 'pendente',
      data_adesao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabela de Contactos (Mensagens de Contacto)
    CREATE TABLE IF NOT EXISTS contactos (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      assunto VARCHAR(255) NOT NULL,
      mensagem TEXT NOT NULL,
      lido BOOLEAN DEFAULT FALSE,
      respondido BOOLEAN DEFAULT FALSE,
      resposta TEXT,
      data_resposta TIMESTAMP,
      data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabela de Configurações do Site
    CREATE TABLE IF NOT EXISTS configuracoes (
      id SERIAL PRIMARY KEY,
      chave VARCHAR(100) NOT NULL UNIQUE,
      valor TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabela de Administradores
    CREATE TABLE IF NOT EXISTS administradores (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const client = await pool.connect();
  try {
    await client.query(initSql);

    // Migrações seguras para tabelas existentes
    const migrations = [
      `ALTER TABLE contactos ADD COLUMN IF NOT EXISTS respondido BOOLEAN DEFAULT FALSE`,
      `ALTER TABLE contactos ADD COLUMN IF NOT EXISTS resposta TEXT`,
      `ALTER TABLE contactos ADD COLUMN IF NOT EXISTS data_resposta TIMESTAMP`,
    ];
    for (const migration of migrations) {
      await client.query(migration);
    }

    console.log('✅ Tabelas criadas ou já existentes.');

    // Seed de notícias se a tabela estiver vazia
    const checkNews = await client.query('SELECT COUNT(*) FROM noticias');
    if (parseInt(checkNews.rows[0].count) === 0) {
      console.log('🌱 Alimentando base de dados com notícias iniciais...');
      const seedSql = `
        INSERT INTO noticias (titulo, resumo, conteudo, categoria, imagem_url, autor, data_publicacao) VALUES
        (
          'SNJ-GB Exige Melhores Condições de Jogo e Segurança para os Atletas da Guiné-Bissau',
          'O sindicato reuniu-se com a Federação para propor novas diretrizes de segurança física, assistência médica e melhorias urgentes nos campos locais.',
          'O Sindicato Nacional dos Jogadores da Guiné-Bissau (SNJ-GB) reuniu-se esta segunda-feira com representantes da Federação de Futebol e do Ministério do Desporto para apresentar um memorando de exigências. As principais preocupações centram-se na falta de assistência médica adequada nos estádios de futebol durante os jogos do campeonato nacional, na degradação acelerada dos relvados sintéticos e na ausência de seguros de saúde obrigatórios para atletas profissionais.\\n\\nO presidente do SNJ-GB frisou que "a integridade física dos nossos futebolistas não pode ser secundarizada. É imperativo que os clubes garantam contratos formais de trabalho que incluam proteção em caso de lesão grave". Uma comissão conjunta será criada para monitorizar as infraestruturas desportivas nas próximas semanas.',
          'Comunicados',
          'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
          'Gabinete de Imprensa',
          NOW() - INTERVAL '1 day'
        ),
        (
          'Assembleia Geral Histórica Reúne Atletas Nacionais de Todas as Divisões',
          'Jogadores debateram a constituição do Fundo de Solidariedade Social e aprovaram o novo regulamento interno com ampla participação.',
          'Num dia histórico para a defesa dos direitos dos futebolistas na Guiné-Bissau, mais de 120 jogadores de clubes da primeira e segunda divisões reuniram-se em Assembleia Geral Ordinária. O tema central foi a ativação do novo Fundo de Solidariedade Social do SNJ-GB, destinado a dar suporte financeiro temporário a atletas desempregados ou que sofram lesões de longa duração.\\n\\nDurante a reunião, também foi debatido e votado por unanimidade o novo regulamento de conduta e representatividade jurídica do sindicato. "Estamos mais unidos do que nunca. A nossa voz conjunta é a única forma de garantir respeito profissional e dignidade dentro e fora de campo", declarou um dos capitães de equipa presentes.',
          'Eventos',
          'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
          'Direção SNJ-GB',
          NOW() - INTERVAL '3 days'
        ),
        (
          'Parceria Internacional Estabelecida para Apoiar Jogadores em Fim de Carreira',
          'SNJ-GB assina protocolo com instituto europeu de formação para disponibilizar cursos profissionais aos atletas guineenses.',
          'Pensando no futuro dos atletas após pendurarem as botas, o Sindicato Nacional dos Jogadores da Guiné-Bissau (SNJ-GB) oficializou um acordo de cooperação técnica e pedagógica com um prestigiado instituto internacional de formação desportiva e executiva.\\n\\nEste protocolo inovador vai garantir bolsas de estudo a 100% em cursos online e semipresenciais de Gestão Desportiva, Treino de Futebol, Análise de Jogo e Empreendedorismo. "A carreira de futebolista é curta e a transição pós-carreira é um desafio enorme. Queremos preparar os nossos filiados para que continuem a contribuir positivamente para a sociedade guineense mesmo após a retirada dos relvados", explicou o Diretor de Relações Externas do sindicato.',
          'Formação',
          'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
          'Parcerias',
          NOW() - INTERVAL '5 days'
        ),
        (
          'Lançamento Oficial da Nova Carteira Digital de Membro do Sindicato',
          'Filiados agora podem aceder ao cartão oficial de filiação através da plataforma digital, usufruindo de descontos exclusivos.',
          'O SNJ-GB deu mais um passo decisivo rumo à modernização administrativa com o lançamento oficial da sua Carteira Digital de Membro. A partir de hoje, todos os futebolistas inscritos e com quotas regularizadas podem aceder, gerar e descarregar o seu cartão digital de identificação diretamente da plataforma oficial.\\n\\nEste novo cartão contém um código QR dinâmico que certifica a validade da inscrição para as épocas desportivas e assegura acesso imediato aos acordos de benefícios firmados com clínicas médicas, seguradoras, centros de fisioterapia e estabelecimentos parceiros em todo o território nacional.',
          'Tecnologia',
          'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=1200&q=80',
          'Departamento Técnico',
          NOW() - INTERVAL '10 days'
        );
      `;
      await client.query(seedSql);
      console.log('🌱 Notícias iniciais inseridas com sucesso.');
    }

    // Seed de configurações se a tabela estiver vazia
    const checkConfig = await client.query('SELECT COUNT(*) FROM configuracoes');
    if (parseInt(checkConfig.rows[0].count) === 0) {
      console.log('🌱 Alimentando base de dados com configurações iniciais...');
      const seedConfigSql = `
        INSERT INTO configuracoes (chave, valor) VALUES
        ('site_nome', 'Sindicato Nacional dos Jogadores de Futebol da Guiné-Bissau'),
        ('site_sigla', 'SNJF-GB'),
        ('site_email', 'contacto@snjf-gb.gw'),
        ('site_telefone', '+245 95 628 00 00'),
        ('site_endereco', 'Estádio Lino Correia, Bissau, Guiné-Bissau'),
        ('site_descricao', 'O SNJF-GB defende os direitos e interesses dos jogadores de futebol da Guiné-Bissau.'),
        ('redes_facebook', 'https://facebook.com'),
        ('redes_instagram', 'https://instagram.com'),
        ('redes_twitter', 'https://twitter.com'),
        ('redes_youtube', ''),
        ('stat_1_valor', '100+'),
        ('stat_1_label', 'Atletas Filiados'),
        ('stat_2_valor', '3'),
        ('stat_2_label', 'Anos de Luta'),
        ('stat_3_valor', '24h'),
        ('stat_3_label', 'Apoio Jurídico'),
        ('email_smtp_host', 'smtp.gmail.com'),
        ('email_smtp_port', '587'),
        ('email_smtp_user', ''),
        ('email_smtp_pass', ''),
        ('email_from', '"SNJF-GB" <noreply@snjf-gb.org>');
      `;
      await client.query(seedConfigSql);
      console.log('🌱 Configurações iniciais inseridas com sucesso.');
    }

    // Seed de administradores se a tabela estiver vazia
    const checkAdmins = await client.query('SELECT COUNT(*) FROM administradores');
    if (parseInt(checkAdmins.rows[0].count) === 0) {
      console.log('🌱 Alimentando base de dados com administrador inicial...');
      const bcrypt = require('bcryptjs');
      const defaultUser = process.env.ADMIN_USER || 'admin';
      const defaultPass = process.env.ADMIN_PASS || 'snj2025@admin';
      const hashedPass = await bcrypt.hash(defaultPass, 10);
      
      await client.query(
        'INSERT INTO administradores (username, password, role) VALUES ($1, $2, $3)',
        [defaultUser, hashedPass, 'admin']
      );
      console.log(`🌱 Administrador inicial '${defaultUser}' criado com sucesso.`);
    }
  } catch (err) {
    console.error('❌ Erro durante a inicialização da base de dados:', err.message);
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  initDatabase,
};
