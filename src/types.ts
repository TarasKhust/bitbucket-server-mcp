import { z } from 'zod'

export const ProjectKeySchema = z.object({
  projectKey: z.string().describe('Bitbucket project key (e.g., "CIBDX", "DATA_TEAM")'),
})

export const RepoSchema = z.object({
  projectKey: z.string().describe('Bitbucket project key'),
  repoSlug: z.string().describe('Repository slug (URL-friendly name)'),
})

export const PullRequestSchema = z.object({
  projectKey: z.string().describe('Bitbucket project key'),
  repoSlug: z.string().describe('Repository slug'),
  prId: z.number().describe('Pull request ID'),
})

export const CreatePullRequestSchema = z.object({
  projectKey: z.string().describe('Bitbucket project key'),
  repoSlug: z.string().describe('Repository slug'),
  title: z.string().describe('Pull request title'),
  description: z.string().optional().describe('Pull request description'),
  fromBranch: z.string().describe('Source branch name'),
  toBranch: z.string().describe('Target branch name (e.g., "main", "develop")'),
  reviewers: z
    .array(z.string())
    .optional()
    .describe('Array of reviewer usernames'),
})

export const AddCommentSchema = z.object({
  projectKey: z.string().describe('Bitbucket project key'),
  repoSlug: z.string().describe('Repository slug'),
  prId: z.number().describe('Pull request ID'),
  text: z.string().describe('Comment text (supports markdown)'),
})

export const AddInlineCommentSchema = z.object({
  projectKey: z.string().describe('Bitbucket project key'),
  repoSlug: z.string().describe('Repository slug'),
  prId: z.number().describe('Pull request ID'),
  text: z.string().describe('Comment text'),
  filePath: z.string().describe('Path to the file to comment on'),
  line: z.number().describe('Line number to comment on'),
  lineType: z
    .enum(['ADDED', 'REMOVED', 'CONTEXT'])
    .optional()
    .describe('Type of line (ADDED, REMOVED, or CONTEXT). Defaults to ADDED'),
})

export const ListPullRequestsSchema = z.object({
  projectKey: z.string().describe('Bitbucket project key'),
  repoSlug: z.string().describe('Repository slug'),
  state: z
    .enum(['OPEN', 'MERGED', 'DECLINED', 'ALL'])
    .optional()
    .describe('Filter by PR state. Defaults to OPEN'),
  limit: z.number().optional().describe('Max results to return. Defaults to 25'),
})

export const ListSchema = z.object({
  projectKey: z.string().describe('Bitbucket project key'),
  limit: z.number().optional().describe('Max results to return. Defaults to 25'),
})

export const BranchesSchema = z.object({
  projectKey: z.string().describe('Bitbucket project key'),
  repoSlug: z.string().describe('Repository slug'),
  filterText: z.string().optional().describe('Filter branches by name'),
  limit: z.number().optional().describe('Max results to return. Defaults to 25'),
})
