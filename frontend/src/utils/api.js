import axios from 'axios';

const API = axios.create({ baseURL: 'http://127.0.0.1:5000/api' });

export const getRecommendations = (mood, genres = []) =>
  API.post('/recommend', { mood, n: 10, genres }).then(r => r.data);

export const getSimilar = (trackId) =>
  API.get(`/similar/${trackId}`).then(r => r.data);

export const searchTracks = (q) =>
  API.get('/search', { params: { q } }).then(r => r.data);

export const getGenres = () =>
  API.get('/genres').then(r => r.data);

export const getAllTracks = (genre) =>
  API.get('/tracks', { params: genre ? { genre } : {} }).then(r => r.data);

export default API;