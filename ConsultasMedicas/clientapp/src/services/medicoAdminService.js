import api from './api';

// Serviço administrativo para médicos
export const medicoAdminService = {
  cadastrar: async (medico) => {
    try {
      // Validações básicas
      if (typeof medico !== 'object') throw new Error('Dados inválidos');
      if (!medico.Nome?.trim()) throw new Error('Nome é obrigatório');
      if (!medico.Email?.trim()) throw new Error('Email é obrigatório');
      if (!medico.Telefone?.trim()) throw new Error('Telefone é obrigatório');
      if (!medico.CRM?.trim()) throw new Error('CRM é obrigatório');
      if (!medico.CPF?.trim()) throw new Error('CPF é obrigatório');
      if (!medico.Senha?.trim()) throw new Error('Senha é obrigatória');
      if (!medico.IdConsultorio) throw new Error('Consultório é obrigatório');
      if (!medico.IdEspecialidade) throw new Error('Especialidade é obrigatória');
      if (!medico.IdSexo) throw new Error('Sexo é obrigatório');

      // Prepara os dados para envio
      const medicoToSend = {
        ...medico,
        Telefone: medico.Telefone.replace(/\D/g, ''),
        CPF: medico.CPF.replace(/\D/g, ''),
        IdConsultorio: Number(medico.IdConsultorio),
        IdEspecialidade: Number(medico.IdEspecialidade),
        IdSexo: Number(medico.IdSexo)
      };

      const response = await api.post('/MedicosAPI', medicoToSend);
      return response;
    } catch (error) {
      console.error('Erro ao cadastrar médico:', error);
      if (error.response?.data) {
        throw typeof error.response.data === 'string' 
          ? new Error(error.response.data)
          : error.response.data;
      }
      throw error;
    }
  },  
  atualizar: async (id, medico) => {
    try {
      if (!id) throw new Error('ID do médico é obrigatório');
      if (!medico.Nome?.trim()) throw new Error('Nome é obrigatório');
      if (!medico.Email?.trim()) throw new Error('Email é obrigatório');
      if (!medico.Telefone?.trim()) throw new Error('Telefone é obrigatório');

      // Prepara os dados para atualização (usando apenas os campos permitidos)
      const medicoToSend = {
        IdMedico: Number(id),
        Nome: medico.Nome.trim(),
        Email: medico.Email.trim(),
        Telefone: String(medico.Telefone).replace(/\D/g, ''), // Remove não-dígitos
        // Campos somente leitura - mantém os valores existentes
        CRM: medico.CRM,
        CPF: medico.CPF,
        IdConsultorio: medico.IdConsultorio || 1,
        IdEspecialidade: medico.IdEspecialidade || 1,
        IdSexo: medico.IdSexo || 1
      };

      // Só inclui a senha se foi fornecida
      if (medico.Senha?.trim()) {
        medicoToSend.Senha = medico.Senha.trim();
      }

      const response = await api.put(`/MedicosAPI/${id}`, medicoToSend);
      return response;
    } catch (error) {
      console.error('Erro ao atualizar médico:', error);
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
      if (!id) throw new Error('ID do médico é obrigatório');

      const response = await api.get(`/MedicosAPI/${id}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar médico:', error);
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
      const response = await api.get('/MedicosAPI');
      return response;
    } catch (error) {
      console.error('Erro ao listar médicos:', error);
      if (error.response?.data) {
        throw typeof error.response.data === 'string' 
          ? new Error(error.response.data)
          : error.response.data;
      }
      throw error;
    }
  },

  excluir: async (id) => {
    try {
      if (!id) throw new Error('ID do médico é obrigatório');
      
      const response = await api.delete(`/MedicosAPI/${id}`);
      return response;
    } catch (error) {
      console.error('Erro ao excluir médico:', error);
      if (error.response?.data) {
        throw typeof error.response.data === 'string' 
          ? new Error(error.response.data)
          : error.response.data;
      }
      throw error;
    }
  }
};

export default medicoAdminService;
