import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import {
  getAllRequests,
  getPendingRequests,
  getRequestById,
  reviewRequest,
  cancelRequest,
} from '../service/fixedMooringService.js';

const isOk = (resp) => resp?.status >= 200 && resp?.status < 300;

const onError = (e, msg) =>
  Notify.create({
    type: 'negative',
    position: 'top-right',
    message: e?.response?.data?.message ?? e?.message ?? msg,
  });

const onSuccess = (msg) =>
  Notify.create({
    type: 'positive',
    position: 'top-right',
    message: msg,
  });

export const useFixedMooringRequestStore = defineStore('fixedMooringRequest', {
  state: () => ({
    requests: [],
    pendingRequests: [],
    currentRequest: null,
  }),

  actions: {
    async getAllRequests() {
      try {
        const resp = await getAllRequests();
        if (!isOk(resp)) throw new Error();
        this.requests = resp.data;
        return this.requests;
      } catch (e) {
        onError(e, 'Error al obtener las solicitudes.');
        return [];
      }
    },

    async getPendingRequests() {
      try {
        const resp = await getPendingRequests();
        if (!isOk(resp)) throw new Error();
        this.pendingRequests = resp.data;
        return this.pendingRequests;
      } catch (e) {
        onError(e, 'Error al obtener las solicitudes pendientes.');
        return [];
      }
    },

    async getRequestById(requestId) {
      try {
        const resp = await getRequestById(requestId);
        if (!isOk(resp)) throw new Error();
        this.currentRequest = resp.data;
        return this.currentRequest;
      } catch (e) {
        onError(e, 'Error al obtener la solicitud.');
        return null;
      }
    },

    async reviewRequest(requestId, data) {
      try {
        const resp = await reviewRequest(requestId, data);
        if (!isOk(resp)) throw new Error();
        const index = this.pendingRequests.findIndex(r => r.id === requestId);
        if (index !== -1) {
          this.pendingRequests.splice(index, 1);
        }

        onSuccess(data.action === 'APPROVE' ? 'Solicitud aprobada' : 'Solicitud rechazada');
        return resp.data;
      } catch (e) {
        onError(e, 'Error al revisar la solicitud.');
        throw e;
      }
    },
    async cancelRequest(requestId) {
      try {
        const resp = await cancelRequest(requestId);
        if (!isOk(resp)) throw new Error();
        const index = this.pendingRequests.findIndex(r => r.id === requestId);
        if (index !== -1) {
          this.pendingRequests.splice(index, 1);
        }

        onSuccess('Solicitud cancelada');
      } catch (e) {
        onError(e, 'Error al cancelar la solicitud.');
        throw e;
      }
    }
  }
});
