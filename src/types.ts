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
  prId: z.coerce.number().describe('Pull request ID'),
})

export const PullRequestDiffSchema = z.object({
  projectKey: z.string().describe('Bitbucket project key'),
  repoSlug: z.string().describe('Repository slug'),
  prId: z.coerce.number().describe('Pull request ID'),
  filePath: z.string().optional().describe('Filter diff to a specific file path'),
  start: z.coerce.number().optional().describe('Start index for file pagination (0-based). Defaults to 0'),
  limit: z.coerce.number().optional().describe('Max number of files to return in diff. Defaults to 25'),
  contextLines: z.coerce.number().optional().describe('Number of context lines around changes. Defaults to 5'),
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
  draft: z.boolean().optional().describe('Create as draft/WIP pull request. Defaults to false'),
})

export const ConvertToDraftSchema = z.object({
  projectKey: z.string().describe('Bitbucket project key'),
  repoSlug: z.string().describe('Repository slug'),
  prId: z.coerce.number().describe('Pull request ID'),
  draft: z.boolean().optional().describe('true = convert to draft, false = mark as ready for review. Defaults to true'),
})

export const UpdateReviewersSchema = z.object({
  projectKey: z.string().describe('Bitbucket project key'),
  repoSlug: z.string().describe('Repository slug'),
  prId: z.coerce.number().describe('Pull request ID'),
  reviewers: z.array(z.string()).describe('Array of reviewer usernames'),
})

export const AddCommentSchema = z.object({
  projectKey: z.string().describe('Bitbucket project key'),
  repoSlug: z.string().describe('Repository slug'),
  prId: z.coerce.number().describe('Pull request ID'),
  text: z.string().describe('Comment text (supports markdown)'),
  parentId: z.coerce.number().optional().describe('Parent comment ID to reply to (creates a threaded reply)'),
})

export const DeleteCommentSchema = z.object({
  projectKey: z.string().describe('Bitbucket project key'),
  repoSlug: z.string().describe('Repository slug'),
  prId: z.coerce.number().describe('Pull request ID'),
  commentId: z.coerce.number().describe('Comment ID to delete'),
  version: z.coerce.number().optional().describe('Comment version for concurrency check. Defaults to -1'),
})

export const ResolveCommentSchema = z.object({
  projectKey: z.string().describe('Bitbucket project key'),
  repoSlug: z.string().describe('Repository slug'),
  prId: z.coerce.number().describe('Pull request ID'),
  commentId: z.coerce.number().describe('Comment ID whose thread should be resolved'),
  resolved: z.boolean().optional().describe('true = resolve the comment thread, false = reopen it. Defaults to true'),
  version: z.coerce.number().optional().describe('Comment version for concurrency check. If omitted, the tool fetches the current version first'),
})

export const AddInlineCommentSchema = z.object({
  projectKey: z.string().describe('Bitbucket project key'),
  repoSlug: z.string().describe('Repository slug'),
  prId: z.coerce.number().describe('Pull request ID'),
  text: z.string().describe('Comment text'),
  filePath: z.string().describe('Path to the file to comment on'),
  line: z.coerce.number().describe('Line number to comment on'),
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
  limit: z.coerce.number().optional().describe('Max results to return. Defaults to 25'),
})

export const ListSchema = z.object({
  projectKey: z.string().describe('Bitbucket project key'),
  limit: z.coerce.number().optional().describe('Max results to return. Defaults to 25'),
})

export const BranchesSchema = z.object({
  projectKey: z.string().describe('Bitbucket project key'),
  repoSlug: z.string().describe('Repository slug'),
  filterText: z.string().optional().describe('Filter branches by name'),
  limit: z.coerce.number().optional().describe('Max results to return. Defaults to 25'),
})
