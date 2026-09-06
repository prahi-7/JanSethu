import api from './api';

// Named exports
export const createProblem = async (problemData) => {
  const response = await api.post('/problems', problemData);
  return response.data;
};

export const getAllProblems = async (filters = {}) => {
  const response = await api.get('/problems', { params: filters });
  return response.data;
};

export const getProblemById = async (id) => {
  const response = await api.get(`/problems/${id}`);
  return response.data;
};

export const updateProblem = async (id, data) => {
  const response = await api.put(`/problems/${id}`, data);
  return response.data;
};

export const deleteProblem = async (id) => {
  const response = await api.delete(`/problems/${id}`);
  return response.data;
};

export const getCitizenProblems = async () => {
  const response = await api.get('/problems/citizen');
  return response.data;
};

export const saveOfflineProblem = async (problemData) => {
  console.log('Saving offline:', problemData);
  return { success: true, offline: true };
};

export const getOfflineProblems = async () => {
  return [];
};

export const removeOfflineProblem = async (id) => {
  return { success: true };
};

// DEFAULT EXPORT - This is what you were missing
const problemService = {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  getCitizenProblems,
  saveOfflineProblem,
  getOfflineProblems,
  removeOfflineProblem,
};

export default problemService;