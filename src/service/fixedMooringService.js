
import { api } from 'boot/axios.js';

export async function getAllRequests() {
  return await api.get('/fixed-mooring-requests');
}

export async function getPendingRequests() {
  return await api.get('/fixed-mooring-requests/pending');
}

export async function getRequestById(requestId) {
  return await api.get(`/fixed-mooring-requests/${requestId}`);
}

export async function reviewRequest(requestId, data) {
  return await api.patch(`/fixed-mooring-requests/${requestId}/review`, data);
}

export async function cancelRequest(requestId) {
  return await api.delete(`/fixed-mooring-requests/${requestId}`);
}
