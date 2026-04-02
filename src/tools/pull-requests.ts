import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { getClient } from '../client.js'
import {
  ListPullRequestsSchema,
  PullRequestSchema,
  CreatePullRequestSchema,
  UpdateReviewersSchema,
} from '../types.js'

function formatPR(pr: any) {
  return {
    id: pr.id,
    title: pr.title,
    description: pr.description || '',
    state: pr.state,
    author: pr.author?.user?.displayName || pr.author?.user?.name,
    fromBranch: pr.fromRef?.displayId,
    toBranch: pr.toRef?.displayId,
    reviewers: pr.reviewers?.map((r: any) => ({
      name: r.user?.displayName || r.user?.name,
      approved: r.approved,
      status: r.status,
    })),
    createdDate: pr.createdDate ? new Date(pr.createdDate).toISOString() : null,
    updatedDate: pr.updatedDate ? new Date(pr.updatedDate).toISOString() : null,
    link: pr.links?.self?.[0]?.href,
  }
}

export function registerPullRequestTools(server: McpServer) {
  server.tool(
    'list_pull_requests',
    'List pull requests in a repository',
    ListPullRequestsSchema.shape,
    async ({ projectKey, repoSlug, state, limit }) => {
      try {
        const client = getClient()
        const { data } = await client.get(
          `/projects/${projectKey}/repos/${repoSlug}/pull-requests`,
          {
            params: {
              limit: limit || 25,
              ...(state && state !== 'ALL' ? { state } : {}),
            },
          }
        )

        const prs = data.values.map(formatPR)
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(prs, null, 2) }],
        }
      } catch (error: any) {
        const msg = error.response?.data?.errors?.[0]?.message || error.message
        return { content: [{ type: 'text' as const, text: `Error: ${msg}` }] }
      }
    }
  )

  server.tool(
    'get_pull_request',
    'Get details of a specific pull request',
    PullRequestSchema.shape,
    async ({ projectKey, repoSlug, prId }) => {
      try {
        const client = getClient()
        const { data } = await client.get(
          `/projects/${projectKey}/repos/${repoSlug}/pull-requests/${prId}`
        )

        return {
          content: [{ type: 'text' as const, text: JSON.stringify(formatPR(data), null, 2) }],
        }
      } catch (error: any) {
        const msg = error.response?.data?.errors?.[0]?.message || error.message
        return { content: [{ type: 'text' as const, text: `Error: ${msg}` }] }
      }
    }
  )

  server.tool(
    'get_pull_request_diff',
    'Get the diff/changes of a pull request',
    PullRequestSchema.shape,
    async ({ projectKey, repoSlug, prId }) => {
      try {
        const client = getClient()
        const { data } = await client.get(
          `/projects/${projectKey}/repos/${repoSlug}/pull-requests/${prId}/diff`,
          { params: { contextLines: 5 } }
        )

        const diffs = data.diffs?.map((d: any) => {
          const path =
            d.destination?.toString || d.source?.toString || 'unknown'
          const hunks = d.hunks?.map((h: any) =>
            h.segments
              ?.map((s: any) =>
                s.lines?.map((l: any) => {
                  const prefix =
                    s.type === 'ADDED' ? '+' : s.type === 'REMOVED' ? '-' : ' '
                  return `${prefix} ${l.line}`
                })
              )
              .flat()
              .join('\n')
          )
          return `--- ${d.source?.toString || '/dev/null'}\n+++ ${d.destination?.toString || '/dev/null'}\n${hunks?.join('\n') || ''}`
        })

        return {
          content: [
            { type: 'text' as const, text: diffs?.join('\n\n') || 'No changes' },
          ],
        }
      } catch (error: any) {
        const msg = error.response?.data?.errors?.[0]?.message || error.message
        return { content: [{ type: 'text' as const, text: `Error: ${msg}` }] }
      }
    }
  )

  server.tool(
    'create_pull_request',
    'Create a new pull request',
    CreatePullRequestSchema.shape,
    async ({ projectKey, repoSlug, title, description, fromBranch, toBranch, reviewers }) => {
      try {
        const client = getClient()
        const body: any = {
          title,
          description: description || '',
          fromRef: { id: `refs/heads/${fromBranch}`, repository: { slug: repoSlug, project: { key: projectKey } } },
          toRef: { id: `refs/heads/${toBranch}`, repository: { slug: repoSlug, project: { key: projectKey } } },
        }

        if (reviewers?.length) {
          body.reviewers = reviewers.map((username) => ({ user: { name: username } }))
        }

        const { data } = await client.post(
          `/projects/${projectKey}/repos/${repoSlug}/pull-requests`,
          body
        )

        return {
          content: [
            {
              type: 'text' as const,
              text: `Pull request #${data.id} created: ${data.links?.self?.[0]?.href || data.title}`,
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
    'update_pull_request_reviewers',
    'Add or replace reviewers on a pull request',
    UpdateReviewersSchema.shape,
    async ({ projectKey, repoSlug, prId, reviewers }) => {
      try {
        const client = getClient()
        const prResp = await client.get(
          `/projects/${projectKey}/repos/${repoSlug}/pull-requests/${prId}`
        )
        const pr = prResp.data

        const { data } = await client.put(
          `/projects/${projectKey}/repos/${repoSlug}/pull-requests/${prId}`,
          {
            title: pr.title,
            description: pr.description || '',
            reviewers: reviewers.map((username) => ({ user: { name: username } })),
            version: pr.version,
          }
        )

        const updatedReviewers = data.reviewers?.map((r: any) => r.user?.displayName || r.user?.name)
        return {
          content: [
            {
              type: 'text' as const,
              text: `Reviewers updated on PR #${prId}: ${updatedReviewers?.join(', ') || 'none'}`,
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
    'merge_pull_request',
    'Merge a pull request',
    PullRequestSchema.shape,
    async ({ projectKey, repoSlug, prId }) => {
      try {
        const client = getClient()
        const prResp = await client.get(
          `/projects/${projectKey}/repos/${repoSlug}/pull-requests/${prId}`
        )
        const version = prResp.data.version

        const { data } = await client.post(
          `/projects/${projectKey}/repos/${repoSlug}/pull-requests/${prId}/merge`,
          {},
          { params: { version } }
        )

        return {
          content: [
            { type: 'text' as const, text: `Pull request #${prId} merged successfully. State: ${data.state}` },
          ],
        }
      } catch (error: any) {
        const msg = error.response?.data?.errors?.[0]?.message || error.message
        return { content: [{ type: 'text' as const, text: `Error: ${msg}` }] }
      }
    }
  )

  server.tool(
    'approve_pull_request',
    'Approve a pull request',
    PullRequestSchema.shape,
    async ({ projectKey, repoSlug, prId }) => {
      try {
        const client = getClient()
        await client.post(
          `/projects/${projectKey}/repos/${repoSlug}/pull-requests/${prId}/approve`
        )

        return {
          content: [{ type: 'text' as const, text: `Pull request #${prId} approved.` }],
        }
      } catch (error: any) {
        const msg = error.response?.data?.errors?.[0]?.message || error.message
        return { content: [{ type: 'text' as const, text: `Error: ${msg}` }] }
      }
    }
  )

  server.tool(
    'decline_pull_request',
    'Decline a pull request',
    PullRequestSchema.shape,
    async ({ projectKey, repoSlug, prId }) => {
      try {
        const client = getClient()
        const prResp = await client.get(
          `/projects/${projectKey}/repos/${repoSlug}/pull-requests/${prId}`
        )
        const version = prResp.data.version

        await client.post(
          `/projects/${projectKey}/repos/${repoSlug}/pull-requests/${prId}/decline`,
          {},
          { params: { version } }
        )

        return {
          content: [{ type: 'text' as const, text: `Pull request #${prId} declined.` }],
        }
      } catch (error: any) {
        const msg = error.response?.data?.errors?.[0]?.message || error.message
        return { content: [{ type: 'text' as const, text: `Error: ${msg}` }] }
      }
    }
  )
}
