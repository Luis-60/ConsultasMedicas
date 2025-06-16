import api from './api';

// Serviço administrativo para clientes
export const clienteAdminService = {
  cadastrar: async (cliente) => {
    try {
      // Validações básicas
      if (typeof cliente !== 'object') throw new Error('Dados inválidos');
      if (!cliente.Nome?.trim()) throw new Error('Nome é obrigatório');
      if (!cliente.Email?.trim()) throw new Error('Email é obrigatório');
      if (!cliente.Telefone?.trim()) throw new Error('Telefone é obrigatório');
      if (!cliente.CPF?.trim()) throw new Error('CPF é obrigatório');
      if (!cliente.Senha?.trim()) throw new Error('Senha é obrigatória');
      if (!cliente.IdSexo) throw new Error('Sexo é obrigatório');

      // Prepara os dados para envio
      const clienteToSend = {
        ...cliente,
        Telefone: cliente.Telefone.replace(/\D/g, ''),
        CPF: cliente.CPF.replace(/\D/g, ''),
        IdSexo: Number(cliente.IdSexo)
      };

      const response = await api.post('/ClientesAPI', clienteToSend);
      return response;
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      if (error.response?.data) {
        throw typeof error.response.data === 'string' 
          ? new Error(error.response.data)
          : error.response.data;
      }
      throw error;
    }
  },

  atualizar: async (id, cliente) => {
    try {
      if (!id) throw new Error('ID do cliente é obrigatório');
      if (!cliente.Nome?.trim()) throw new Error('Nome é obrigatório');
      if (!cliente.Email?.trim()) throw new Error('Email é obrigatório');
      if (!cliente.Telefone?.trim()) throw new Error('Telefone é obrigatório');

      // Prepara os dados para atualização (usando apenas os campos permitidos)
      const clienteToSend = {
        IdCliente: Number(id),
        Nome: cliente.Nome.trim(),
        Email: cliente.Email.trim(),
        Telefone: String(cliente.Telefone).replace(/\D/g, ''), // Remove não-dígitos
        // Campos somente leitura - mantém os valores existentes
        CPF: cliente.CPF,
        IdSexo: cliente.IdSexo || 1
      };

      // Só inclui a senha se foi fornecida
      if (cliente.Senha?.trim()) {
        clienteToSend.Senha = cliente.Senha.trim();
      }

      const response = await api.put(`/ClientesAPI/${id}`, clienteToSend);
      return response;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      if (error.response?.data) {
        throw typeof error.response.data === 'string' 
          ? new Error(error.response.data)
          : error.response.data;
      }
      throw error;
    }
  },

  obterPorId: async (id) => {
    try {
      if (!id) throw new Error('ID do cliente é obrigatório');

      const response = await api.get(`/ClientesAPI/${id}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      if (error.response?.data) {
        throw typeof error.response.data === 'string' 
          ? new Error(error.response.data)
          : error.response.data;
      }
      throw error;
    }
  },

  listar: async () => {
    try {
      const response = await api.get('/ClientesAPI');
      return response;
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      if (error.response?.data) {
        throw typeof error.response.data === 'string' 
          ? new Error(error.response.data)
          : error.response.data;
      }
      throw error;
    }
  }
};
