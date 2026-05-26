// src/services/api.ts (Super Admin - porta 5175)
import { Cache } from '@/services/cachemanager';

const API_BASE = ''; // usa o proxy do Vite, URLs relativas

export async function apiFetch(url: string, options: RequestInit = {}): Promise<any> {
    const sessionKey = Cache.Session?.value;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>)
    };

    if (sessionKey && sessionKey !== '1234') {
        headers['Session-Key'] = sessionKey;
    }

    const response = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers
    });

    return response.json();
}