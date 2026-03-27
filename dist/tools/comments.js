import { getClient } from '../client.js';
import { PullRequestSchema, AddCommentSchema, AddInlineCommentSchema } from '../types.js';
export function registerCommentTools(server) {
    server.tool('get_pull_request_comments', 'Get comments and activity on a pull request', PullRequestSchema.shape, async ({ projectKey, repoSlug, prId }) => {
        try {
            const client = getClient();
            const { data } = await client.get(`/projects/${projectKey}/repos/${repoSlug}/pull-requests/${prId}/activities`, { params: { limit: 100 } });
            const activities = data.values
                ?.filter((a) => a.action === 'COMMENTED')
                .map((a) => ({
                id: a.comment?.id,
                author: a.comment?.author?.displayName || a.comment?.author?.name,
                text: a.comment?.text,
                createdDate: a.comment?.createdDate
                    ? new Date(a.comment.createdDate).toISOString()
                    : null,
                anchor: a.comment?.anchor
                    ? {
                        path: a.comment.anchor.path,
                        line: a.comment.anchor.line,
                        lineType: a.comment.anchor.lineType,
                    }
                    : null,
            }));
            return {
                content: [{ type: 'text', text: JSON.stringify(activities || [], null, 2) }],
            };
        }
        catch (error) {
            const msg = error.response?.data?.errors?.[0]?.message || error.message;
            return { content: [{ type: 'text', text: `Error: ${msg}` }] };
        }
    });
    server.tool('add_comment', 'Add a general comment to a pull request', AddCommentSchema.shape, async ({ projectKey, repoSlug, prId, text }) => {
        try {
            const client = getClient();
            const { data } = await client.post(`/projects/${projectKey}/repos/${repoSlug}/pull-requests/${prId}/comments`, { text });
            return {
                content: [
                    {
                        type: 'text',
                        text: `Comment #${data.id} added to PR #${prId}`,
                    },
                ],
            };
        }
        catch (error) {
            const msg = error.response?.data?.errors?.[0]?.message || error.message;
            return { content: [{ type: 'text', text: `Error: ${msg}` }] };
        }
    });
    server.tool('add_inline_comment', 'Add an inline comment on a specific file and line in a pull request', AddInlineCommentSchema.shape, async ({ projectKey, repoSlug, prId, text, filePath, line, lineType }) => {
        try {
            const client = getClient();
            const { data } = await client.post(`/projects/${projectKey}/repos/${repoSlug}/pull-requests/${prId}/comments`, {
                text,
                anchor: {
                    path: filePath,
                    line,
                    lineType: lineType || 'ADDED',
                    fileType: 'TO',
                },
            });
            return {
                content: [
                    {
                        type: 'text',
                        text: `Inline comment #${data.id} added on ${filePath}:${line} in PR #${prId}`,
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
//# sourceMappingURL=comments.js.map