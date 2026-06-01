import PendingBookingsManager from '../Payment/Pending/PendingBookingManager';
import logger from '../Helpers/Logger';

const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutos

export function startCleanupCron() {
    const intervalMinutes = CLEANUP_INTERVAL / 60000; // Converter para minutos

    const cleanup = async () => {
        try {
            const count = await PendingBookingsManager.cleanupExpired();
            if (count > 0) {
                logger.info(`🧹 ${count} pending bookings expirados limpos.`);
            }
        } catch (error: any) {
            if (!error.message?.includes('relation') && !error.message?.includes('does not exist')) {
                logger.error('Erro ao limpar pending bookings:', error.message);
            }
        }
    };

    cleanup();
    setInterval(cleanup, CLEANUP_INTERVAL);
    logger.info(`⏰ Cron de limpeza de pending bookings iniciado (a cada ${intervalMinutes} minuto(s))`);
}