// src/stores/pendingBooking.ts
import { ref } from 'vue';

interface PendingBookingState {
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  price: number;
  // Adiciona outros campos que possas precisar
}

const pendingBooking = ref<PendingBookingState | null>(null);

export function usePendingBooking() {
  // Carregar do localStorage ao iniciar
  const loadFromStorage = () => {
    const stored = localStorage.getItem('pending_booking_state');
    if (stored) {
      try {
        pendingBooking.value = JSON.parse(stored);
      } catch {
        pendingBooking.value = null;
      }
    }
  };

  const savePendingBooking = (booking: PendingBookingState) => {
    pendingBooking.value = booking;
    localStorage.setItem('pending_booking_state', JSON.stringify(booking));
  };

  const getPendingBooking = () => {
    if (!pendingBooking.value) {
      loadFromStorage();
    }
    return pendingBooking.value;
  };

  const clearPendingBooking = () => {
    pendingBooking.value = null;
    localStorage.removeItem('pending_booking_state');
  };

  // Inicializar
  loadFromStorage();

  return {
    savePendingBooking,
    getPendingBooking,
    clearPendingBooking
  };
}