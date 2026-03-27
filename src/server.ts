#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { getConfig } from './config.js'
import { registerProjectTools } from './tools/projects.js'
import { registerRepositoryTools } from './tools/repositories.js'
import { registerPullRequestTools } from './tools/pull-requests.js'
import { registerCommentTools } from './tools/comments.js'

const config = getConfig()
if (!config) {
  console.error(
    'Warning: BITBUCKET_URL and BITBUCKET_TOKEN not set. Tools will return configuration instructions.'
  )
}

const server = new McpServer({
  name: 'bitbucket-server-mcp',
  version: '1.0.0',
})

// Register all tool groups
registerProjectTools(server)
registerRepositoryTools(server)
registerPullRequestTools(server)
registerCommentTools(server)

// Connect via stdio
const transport = new StdioServerTransport()
await server.connect(transport)

// Graceful shutdown
process.on('SIGINT', async () => {
  await server.close()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await server.close()
  process.exit(0)
})
