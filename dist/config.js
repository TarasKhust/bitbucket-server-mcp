import dotenv from 'dotenv';
dotenv.config();
export function getConfig() {
    const url = process.env.BITBUCKET_URL;
    const token = process.env.BITBUCKET_TOKEN;
    if (!url || !token) {
        return null;
    }
    return {
        url: url.replace(/\/+$/, ''),
        token,
    };
}
//# sourceMappingURL=config.js.map