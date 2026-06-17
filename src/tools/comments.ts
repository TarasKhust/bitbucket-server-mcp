import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { getClient } from '../client.js'
import {
  PullRequestSchema,
  AddCommentSchema,
  AddInlineCommentSchema,
  DeleteCommentSchema,
  ResolveCommentSchema,
} from '../types.js'

export function buildResolveCommentBody(
  comment: { version?: number | null },
  resolved = true,
  version?: number
): Record<string, unknown> {
  const currentVersion = version ?? comment.version
  if (currentVersion === undefined || currentVersion === null) {
    throw new Error('Comment version is required to resolve a comment thread')
  }

  return {
    version: currentVersion,
    threadResolved: resolved,
  }
}

export function formatPullRequestComment(comment: any, parentId?: number): Record<string, unknown> {
  return {
    id: comment?.id,
    parentId: parentId ?? comment?.parent?.id ?? null,
    author: comment?.author?.displayName || comment?.author?.name,
    text: comment?.text,
    createdDate: comment?.createdDate ? new Date(comment.createdDate).toISOString() : null,
    updatedDate: comment?.updatedDate ? new Date(comment.updatedDate).toISOString() : null,
    threadResolved: comment?.threadResolved ?? null,
    state: comment?.state ?? null,
    anchor: comment?.anchor
      ? {
          path: comment.anchor.path,
          line: comment.anchor.line,
          lineType: comment.anchor.lineType,
          orphaned: comment.anchor.orphaned,
        }
      : null,
    replies: (comment?.comments ?? []).map((reply: any) =>
      formatPullRequestComment(reply, comment?.id)
    ),
  }
}

export function registerCommentTools(server: McpServer) {
  server.tool(
    'get_pull_request_comments',
    'Get comments and activity on a pull request',
    PullRequestSchema.shape,
    async ({ projectKey, repoSlug, prId }) => {
      try {
        const client = getClient()
        const { data } = await client.get(
          `/projects/${projectKey}/repos/${repoSlug}/pull-requests/${prId}/activities`,
          { params: { limit: 100 } }
        )

        const activities = data.values
          ?.filter((a: any) => a.action === 'COMMENTED')
          .map((a: any) => formatPullRequestComment(a.comment))

        return {
          content: [{ type: 'text' as const, text: JSON.stringify(activities || [], null, 2) }],
        }
      } catch (error: any) {
        const msg = error.response?.data?.errors?.[0]?.message || error.message
        return { content: [{ type: 'text' as const, text: `Error: ${msg}` }] }
      }
    }
  )

  server.tool(
    'delete_comment',
    'Delete a comment from a pull request',
    DeleteCommentSchema.shape,
    async ({ projectKey, repoSlug, prId, commentId, version }) => {
      try {
        const client = getClient()
        await client.delete(
          `/projects/${projectKey}/repos/${repoSlug}/pull-requests/${prId}/comments/${commentId}`,
          { params: { version: version ?? -1 } }
        )

        return {
          content: [
            {
              type: 'text' as const,
              text: `Comment #${commentId} deleted from PR #${prId}`,
            },
          ],
        }
      } catch (error: any) {
        const msg = error.response?.data?.errors?.[0]?.message || error.message
        return { content: [{ type: 'text' as const, text: `Error: ${msg}` }] }
      }
    }
  )

  server.tool(
    'resolve_comment',
    'Resolve or reopen a pull request comment thread',
    ResolveCommentSchema.shape,
    async ({ projectKey, repoSlug, prId, commentId, resolved, version }) => {
      try {
        const client = getClient()
        const url = `/projects/${projectKey}/repos/${repoSlug}/pull-requests/${prId}/comments/${commentId}`
        const comment =
          version === undefined
            ? (await client.get(url)).data
            : { version }

        const isResolved = resolved ?? true
        const { data } = await client.put(url, buildResolveCommentBody(comment, isResolved, version))

        const status = data.threadResolved ? 'resolved' : 'reopened'
        return {
          content: [
            {
              type: 'text' as const,
              text: `Comment thread #${commentId} ${status} on PR #${prId}`,
            },
          ],
        }
      } catch (error: any) {
        const msg = error.response?.data?.errors?.[0]?.message || error.message
        return { content: [{ type: 'text' as const, text: `Error: ${msg}` }] }
      }
    }
  )

  server.tool(
    'add_comment',
    'Add a general comment to a pull request',
    AddCommentSchema.shape,
    async ({ projectKey, repoSlug, prId, text, parentId }) => {
      try {
        const client = getClient()
        const body: Record<string, unknown> = { text }
        if (parentId) body.parent = { id: parentId }
        const { data } = await client.post(
          `/projects/${projectKey}/repos/${repoSlug}/pull-requests/${prId}/comments`,
          body
        )

        return {
          content: [
            {
              type: 'text' as const,
              text: `Comment #${data.id} added to PR #${prId}`,
            },
          ],
        }
      } catch (error: any) {
        const msg = error.response?.data?.errors?.[0]?.message || error.message
        return { content: [{ type: 'text' as const, text: `Error: ${msg}` }] }
      }
    }
  )

  server.tool(
    'add_inline_comment',
    'Add an inline comment on a specific file and line in a pull request',
    AddInlineCommentSchema.shape,
    async ({ projectKey, repoSlug, prId, text, filePath, line, lineType }) => {
      try {
        const client = getClient()
        const { data } = await client.post(
          `/projects/${projectKey}/repos/${repoSlug}/pull-requests/${prId}/comments`,
          {
            text,
            anchor: {
              path: filePath,
              line,
              lineType: lineType || 'ADDED',
              fileType: 'TO',
            },
          }
        )

        return {
          content: [
            {
              type: 'text' as const,
              text: `Inline comment #${data.id} added on ${filePath}:${line} in PR #${prId}`,
            },
          ],
        }
      } catch (error: any) {
        const msg = error.response?.data?.errors?.[0]?.message || error.message
        return { content: [{ type: 'text' as const, text: `Error: ${msg}` }] }
      }
    }
  )
}
