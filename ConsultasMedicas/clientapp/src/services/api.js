import axios from 'axios';
import dayjs from 'dayjs';

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
export const authService = {  loginCliente: async (credentials) => {
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

      return response.data;
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

      return response.data;
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
export const consultasService = {
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
    // Garante que o ID da consulta está incluído no objeto
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

// Exportando os serviços de médicos
export { default as medicoPublicService } from './medicoPublicService';
export { default as medicoAdminService } from './medicoAdminService';

// Serviços para clientes
export const clientesService = {
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

  atualizarPerfil: async (id, dados) => {
    try {
      console.log('Atualizando perfil:', id);
      console.log('Dados enviados:', dados);

      // Prepara os dados conforme esperado pelo backend
      const dadosAtualizacao = {
        IdCliente: id,
        Nome: dados.Nome,
        Telefone: dados.Telefone.replace(/\D/g, ''), // Remove formatação do telefone
        Senha: dados.Senha || undefined // Só envia se foi fornecida
      };

      console.log('Dados formatados para envio:', dadosAtualizacao);
      
      const response = await api.put(`/ClientesAPI/${id}`, dadosAtualizacao);
      console.log('Resposta da atualização:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default api;
