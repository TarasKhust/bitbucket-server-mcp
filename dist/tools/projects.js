import { getClient } from '../client.js';
import { ProjectKeySchema } from '../types.js';
import { z } from 'zod';
export function registerProjectTools(server) {
    server.tool('list_projects', 'List all Bitbucket projects accessible to you', { limit: z.coerce.number().optional().describe('Max results. Defaults to 25') }, async ({ limit }) => {
        try {
            const client = getClient();
            const { data } = await client.get('/projects', {
                params: { limit: limit || 25 },
            });
            const projects = data.values.map((p) => ({
                key: p.key,
                name: p.name,
                description: p.description || '',
                public: p.public,
            }));
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(projects, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            const msg = error.response?.data?.errors?.[0]?.message || error.message;
            return { content: [{ type: 'text', text: `Error: ${msg}` }] };
        }
    });
    server.tool('get_project', 'Get details of a specific Bitbucket project', ProjectKeySchema.shape, async ({ projectKey }) => {
        try {
            const client = getClient();
            const { data } = await client.get(`/projects/${projectKey}`);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            key: data.key,
                            name: data.name,
                            description: data.description || '',
                            public: data.public,
                            links: data.links?.self?.[0]?.href,
                        }, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            const msg = error.response?.data?.errors?.[0]?.message || error.message;
            return { content: [{ type: 'text', text: `Error: ${msg}` }] };
        }
    });
}
//# sourceMappingURL=projects.js.map