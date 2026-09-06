import api from './api';

export const analyzeProblem = async (problemData) => {
  const response = await api.post('/ai/analyze', problemData);
  return response.data;
};

export const findSimilarProblems = async (problemId) => {
  const response = await api.get(`/ai/similar/${problemId}`);
  return response.data;
};

export const matchTeams = async (problemId) => {
  const response = await api.get(`/ai/match-teams/${problemId}`);
  return response.data;
};

export const getSolutionRecommendations = async (problemData) => {
  const response = await api.post('/ai/recommend-solution', problemData);
  return response.data;
};

export const predictProblemPattern = async (filters = {}) => {
  const response = await api.get('/ai/predict-patterns', { params: filters });
  return response.data;
};