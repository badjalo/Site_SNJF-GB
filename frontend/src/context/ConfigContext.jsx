import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const ConfigContext = createContext(null);

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({
    site_nome: 'Sindicato Nacional dos Jogadores de Futebol da Guiné-Bissau',
    site_sigla: 'SNJF-GB',
    site_email: 'contacto@snj-gb.gw',
    site_telefone: '+245 95 628 00 00',
    site_endereco: 'Estádio Lino Correia, Bissau, Guiné-Bissau',
    site_descricao: 'O SNJF-GB defende os direitos e interesses dos jogadores de futebol da Guiné-Bissau.',
    redes_facebook: 'https://facebook.com',
    redes_instagram: 'https://instagram.com',
    redes_twitter: 'https://twitter.com',
    redes_youtube: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await api.getConfiguracoes();
        // Mesclar com os valores padrão para garantir que nenhuma chave fique indefinida
        setConfig(prev => ({ ...prev, ...data }));
      } catch (err) {
        console.error('Erro ao carregar configurações públicas:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, loading }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig deve ser utilizado dentro de um ConfigProvider');
  }
  return context;
};
