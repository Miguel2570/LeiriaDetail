// api/src/Settings/SettingsManager.ts
import { server } from '../Helpers/DatabaseConnectionHelper';

class SettingsManager {
    
    static async get(key: string): Promise<string | null> {
        const result = await server.query('SELECT value FROM settings WHERE key = $1', [key]);
        return result.rows[0]?.value || null;
    }

    static async getBoolean(key: string): Promise<boolean> {
        const value = await this.get(key);
        return value === 'true';
    }

    static async getNumber(key: string): Promise<number> {
        const value = await this.get(key);
        return parseFloat(value || '0');
    }

    static async set(key: string, value: string): Promise<void> {
        await server.query(
            `INSERT INTO settings (key, value, updated_at) VALUES ($1, $2, NOW()) 
             ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
            [key, value]
        );
    }

    static async getAll(): Promise<Record<string, string>> {
        const result = await server.query('SELECT key, value FROM settings ORDER BY key');
        const settings: Record<string, string> = {};
        result.rows.forEach((row: any) => { settings[row.key] = row.value; });
        return settings;
    }
}

export default SettingsManager;