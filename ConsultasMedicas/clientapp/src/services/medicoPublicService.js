import api from './api';

// Serviço público para médicos (acesso do cliente)
export const medicoPublicService = {
  listar: async () => {
    try {
      console.log('Listando todos os médicos (acesso público)');      const response = await api.get('/MedicosAPI');
      return response;
    } catch (error) {
      console.error('Erro ao listar médicos:', error);
      throw error;
    }
  },

  obterPorId: async (id) => {
    try {
      console.log('Buscando médico por ID (acesso público):', id);      const response = await api.get(`/MedicosAPI/${id}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar médico:', error);
      throw error;
    }
  },

  listarPorEspecialidade: async (especialidadeId) => {
    try {
      console.log('Listando médicos por especialidade:', especialidadeId);      const response = await api.get(`/MedicosAPI?especialidade=${especialidadeId}`);
      return response;
    } catch (error) {
      console.error('Erro ao listar médicos por especialidade:', error);
      throw error;
    }
  }
};

export default medicoPublicService;
