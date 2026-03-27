import { getClient } from '../client.js';
import { ListSchema, RepoSchema, BranchesSchema } from '../types.js';
export function registerRepositoryTools(server) {
    server.tool('list_repositories', 'List repositories in a Bitbucket project', ListSchema.shape, async ({ projectKey, limit }) => {
        try {
            const client = getClient();
            const { data } = await client.get(`/projects/${projectKey}/repos`, {
                params: { limit: limit || 25 },
            });
            const repos = data.values.map((r) => ({
                slug: r.slug,
                name: r.name,
                description: r.description || '',
                state: r.state,
                forkable: r.forkable,
                cloneUrl: r.links?.clone?.find((c) => c.name === 'http')?.href,
            }));
            return {
                content: [{ type: 'text', text: JSON.stringify(repos, null, 2) }],
            };
        }
        catch (error) {
            const msg = error.response?.data?.errors?.[0]?.message || error.message;
            return { content: [{ type: 'text', text: `Error: ${msg}` }] };
        }
    });
    server.tool('get_repository', 'Get details of a specific repository', RepoSchema.shape, async ({ projectKey, repoSlug }) => {
        try {
            const client = getClient();
            const { data } = await client.get(`/projects/${projectKey}/repos/${repoSlug}`);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            slug: data.slug,
                            name: data.name,
                            description: data.description || '',
                            state: data.state,
                            project: data.project?.key,
                            forkable: data.forkable,
                            archived: data.archived,
                            defaultBranch: data.links?.clone?.find((c) => c.name === 'http')?.href,
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
    server.tool('list_branches', 'List branches of a repository', BranchesSchema.shape, async ({ projectKey, repoSlug, filterText, limit }) => {
        try {
            const client = getClient();
            const { data } = await client.get(`/projects/${projectKey}/repos/${repoSlug}/branches`, {
                params: {
                    limit: limit || 25,
                    ...(filterText ? { filterText } : {}),
                },
            });
            const branches = data.values.map((b) => ({
                name: b.displayId,
                latestCommit: b.latestCommit,
                isDefault: b.isDefault || false,
            }));
            return {
                content: [{ type: 'text', text: JSON.stringify(branches, null, 2) }],
            };
        }
        catch (error) {
            const msg = error.response?.data?.errors?.[0]?.message || error.message;
            return { content: [{ type: 'text', text: `Error: ${msg}` }] };
        }
    });
}
//# sourceMappingURL=repositories.js.map