import axios from 'axios';
import { getConfig } from './config.js';
let client = null;
export function getClient() {
    if (client)
        return client;
    const config = getConfig();
    if (!config) {
        throw new Error('Bitbucket not configured. Set BITBUCKET_URL and BITBUCKET_TOKEN environment variables.');
    }
    client = axios.create({
        baseURL: `${config.url}/rest/api/1.0`,
        headers: {
            Authorization: `Bearer ${config.token}`,
            'Content-Type': 'application/json',
        },
        timeout: 30000,
    });
    return client;
}
//# sourceMappingURL=client.js.map