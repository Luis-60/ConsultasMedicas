import axios from 'axios';
import dayjs from 'dayjs';
import { default as medicoAdminService } from './medicoAdminService';

// Criando uma instância do axios com configurações base
const api = axios.create({
  baseURL: 'http://localhost:5255/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Serviços para autenticação
const authService = {
  loginCliente: async (credentials) => {
    try {
      const params = new URLSearchParams({
        email: credentials.Email,
        senha: credentials.Senha
      });
      console.log('Fazendo requisição para:', `/ClientesAPI/login?${params}`);
      const response = await api.get(`/ClientesAPI/login?${params}`);
      
      if (!response.data) {
        throw new Error('Dados de usuário não encontrados na resposta');
      }

      return response;
    } catch (error) {
      console.error('Erro no login do cliente:', error);
      throw error;
    }
  },

  loginMedico: async (credentials) => {
    try {
      const params = new URLSearchParams({
        email: credentials.Email,
        senha: credentials.Senha
      });
      console.log('Fazendo requisição para:', `/MedicosAPI/login?${params}`);
      const response = await api.get(`/MedicosAPI/login?${params}`);
      
      if (!response.data) {
        throw new Error('Dados do médico não encontrados na resposta');
      }

      return response;
    } catch (error) {
      console.error('Erro no login do médico:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
  },
};

// Serviços para consultas
const consultasService = {
  listar: async () => {
    return await api.get('/ConsultasAPI');
  },
  
  agendar: async (consulta) => {
    return await api.post('/ConsultasAPI', consulta);
  },

  detalhar: async (id) => {
    return await api.get(`/ConsultasAPI/${id}`);
  },

  atualizar: async (id, consulta) => {
    const consultaAtualizada = {
      ...consulta,
      idConsulta: id
    };
    return await api.put(`/ConsultasAPI/${id}`, consultaAtualizada);
  },

  cancelar: async (id) => {
    return await api.delete(`/ConsultasAPI/${id}`);
  }
};

// Serviços públicos para médicos (não requer autenticação)
const medicoPublicService = {
  listar: async () => {
    try {
      console.log('Carregando lista de médicos...');
      const response = await api.get('/MedicosAPI');
      
      if (!response.data) {
        throw new Error('Nenhum médico encontrado');
      }

      // Normaliza os dados dos médicos
      const medicosNormalizados = response.data.map(medico => {
        const especialidade = medico.especialidade || medico.Especialidade || {};
        const especialidadeNormalizada = {
          id: especialidade.idEspecialidade || especialidade.IdEspecialidade,
          nome: especialidade.nome || especialidade.Nome || 'Não especificada'
        };

        return {
          idMedico: medico.idMedico || medico.IdMedico,
          nome: medico.nome || medico.Nome || '',
          email: medico.email || medico.Email || '',
          telefone: medico.telefone || medico.Telefone || '',
          crm: medico.crm || medico.CRM || '',
          especialidade: especialidadeNormalizada
        };
      });

      console.log('Médicos carregados:', medicosNormalizados);
      return { ...response, data: medicosNormalizados };
    } catch (error) {
      console.error('Erro ao carregar médicos:', error);
      throw error;
    }
  },

  obterPorId: async (id) => {
    try {
      const response = await api.get(`/MedicosAPI/${id}`);
      
      if (!response.data) {
        throw new Error('Médico não encontrado');
      }

      return response;
    } catch (error) {
      console.error('Erro ao carregar médico:', error);
      throw error;
    }
  }
};

// Serviços para clientes
const clientesService = {
  cadastrar: async (cliente) => {
    try {
      console.log('Dados do cliente sendo enviados:', cliente);
      const response = await api.post('/ClientesAPI', cliente);
      return response.data;
    } catch (error) {
      console.error('Erro detalhado do cadastro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        data: error.response?.data,
        error: error
      });
      throw error;
    }
  },

  listarSexos: async () => {
    try {
      const response = await api.get('/SexosAPI');
      console.log('Resposta da API de sexos:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar sexos:', error);
      throw error;
    }
  },

  obterPerfil: async (id) => {
    try {
      console.log('Obtendo perfil do cliente:', id);
      const response = await api.get(`/ClientesAPI/${id}`);
      console.log('Resposta obtida:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      throw error;
    }
  },
  
  deletarPerfil: async (id) => {
    try {
      console.log('Iniciando processo de deleção do cliente:', id);
      const response = await api.delete(`/ClientesAPI/${id}`);
      console.log('Resposta da deleção:', response);
      return response.data;
    } catch (error) {
      console.error('Erro detalhado ao deletar cliente:', {
        id: id,
        error: error,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Não é possível excluir o perfil no momento.');
      }
      
      if (error.response?.status === 404) {
        throw new Error('Cliente não encontrado.');
      }
      
      throw new Error('Erro ao excluir o perfil.');
    }
  },
  
  atualizarPerfil: async (id, dados) => {
    try {
      console.log('Atualizando perfil do cliente:', id);
      console.log('Dados recebidos:', dados);

      if (!dados.Nome && !dados.nome) throw new Error('Nome é obrigatório');
      if (!dados.Telefone && !dados.telefone) throw new Error('Telefone é obrigatório');

      const dadosAtualizacao = {
        IdCliente: parseInt(id),
        Nome: (dados.nome || dados.Nome || '').trim(),
        Telefone: (dados.telefone || dados.Telefone || '').replace(/\D/g, ''),
        Senha: dados.senha || dados.Senha || undefined
      };

      if (!dadosAtualizacao.Nome) throw new Error('Nome é obrigatório');
      if (!dadosAtualizacao.Telefone) throw new Error('Telefone é obrigatório');

      console.log('Dados normalizados para envio:', dadosAtualizacao);
      const response = await api.put(`/ClientesAPI/${id}`, dadosAtualizacao);
      console.log('Resposta da atualização:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error.response?.data);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join(', ');
        throw new Error(errorMessages);
      } else if (error.response?.data?.title) {
        throw new Error(error.response.data.title);
      } else {
        throw new Error(error.message || 'Erro ao atualizar perfil');
      }
    }
  }
};

// Exportando os serviços
export {
  api as default,
  authService,
  clientesService,
  consultasService,
  medicoPublicService,
  medicoAdminService
};
