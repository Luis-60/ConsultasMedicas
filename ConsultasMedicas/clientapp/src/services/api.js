import axios from 'axios';

// Criando uma instância do axios com configurações base
const api = axios.create({
  baseURL: 'http://localhost:5255/api', // porta padrão do ASP.NET
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
export const authService = {
  loginCliente: async (credentials) => {
    const params = new URLSearchParams({
      email: credentials.Email,
      senha: credentials.Senha
    });
    console.log('Fazendo requisição para:', `/ClientesAPI/login?${params}`);
    const response = await api.get(`/ClientesAPI/login?${params}`);
    return response.data;
  },

  loginMedico: async (credentials) => {
    const params = new URLSearchParams({
      email: credentials.Email,
      senha: credentials.Senha
    });
    console.log('Fazendo requisição para:', `/MedicosAPI/login?${params}`);
    const response = await api.get(`/MedicosAPI/login?${params}`);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
  }
};

// Serviço para consultas
export const consultasService = {
  listarTodas: () => api.get('/ConsultasAPI'),
  
  listarPorCliente: (clienteId) => 
    api.get(`/ConsultasAPI/cliente/${clienteId}`),
  
  listarPorMedico: (medicoId) => 
    api.get(`/ConsultasAPI/medico/${medicoId}`),
  
  agendar: (consultaData) => 
    api.post('/ConsultasAPI', {
      ...consultaData,
      status: 'Agendada'
    }),
  
  atualizar: (id, consultaData) => 
    api.put(`/ConsultasAPI/${id}`, consultaData),
  
  cancelar: (id) => 
    api.delete(`/ConsultasAPI/${id}`),

  buscarHorariosDisponiveis: (medicoId, data) =>
    api.get(`/ConsultasAPI/horarios-disponiveis/${medicoId}?data=${data}`)
};

// Serviço para médicos
export const medicosService = {
  listar: () => api.get('/MedicosAPI'),
  buscarPorId: (id) => api.get(`/MedicosAPI/${id}`),
  buscarPorEspecialidade: (especialidadeId) => 
    api.get(`/MedicosAPI/especialidade/${especialidadeId}`),
  atualizar: (id, medicoData) => 
    api.put(`/MedicosAPI/${id}`, medicoData)
};

// Serviço para clientes
export const clientesService = {
  buscarPorId: (id) => api.get(`/ClientesAPI/${id}`),
  atualizar: (id, clienteData) => api.put(`/ClientesAPI/${id}`, clienteData)
};

export default api;
