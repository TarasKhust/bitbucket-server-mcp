# @tarasrushchak/bitbucket-server-mcp

MCP (Model Context Protocol) server for **Bitbucket Server / Data Center** (formerly Stash).

> **Note:** This package is for Bitbucket **Server/Data Center**, NOT Bitbucket Cloud. The APIs are different.

## Setup

### Claude Code

```bash
claude mcp add bitbucket-server -e BITBUCKET_URL=https://your-bitbucket.com -e BITBUCKET_TOKEN=your-token -- npx -y @tarasrushchak/bitbucket-server-mcp
```

### Manual config (`~/.claude.json` or `~/.claude/mcp.json`)

```json
{
  "mcpServers": {
    "bitbucket-server": {
      "command": "npx",
      "args": ["-y", "@tarasrushchak/bitbucket-server-mcp"],
      "env": {
        "BITBUCKET_URL": "https://your-bitbucket-server.com",
        "BITBUCKET_TOKEN": "your-personal-access-token"
      }
    }
  }
}
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `BITBUCKET_URL` | Yes | Base URL of your Bitbucket Server instance |
| `BITBUCKET_TOKEN` | Yes | Personal access token (HTTP access tokens) |

### Generating a token

1. Go to your Bitbucket Server profile: **Manage account > HTTP access tokens**
2. Create a token with **Repository read/write** and **Pull request read/write** permissions

## Available Tools

### Pull Requests
| Tool | Description |
|------|-------------|
| `create_pull_request` | Create a new pull request |
| `get_pull_request` | Get details of a specific PR |
| `get_pull_request_diff` | Get the diff/changes of a PR |
| `list_pull_requests` | List PRs in a repository (filter by state) |
| `approve_pull_request` | Approve a PR |
| `decline_pull_request` | Decline a PR |
| `merge_pull_request` | Merge a PR |

### Comments
| Tool | Description |
|------|-------------|
| `add_comment` | Add a general comment to a PR |
| `add_inline_comment` | Add an inline comment on a specific file/line |
| `add_suggested_change` | Add an inline suggested change with an Apply suggestion action |
| `get_pull_request_comments` | Get all comments on a PR, including threaded replies |
| `resolve_comment` | Resolve or reopen a PR comment thread |

### Repositories
| Tool | Description |
|------|-------------|
| `list_repositories` | List repositories in a project |
| `get_repository` | Get repository details |
| `list_branches` | List branches (with optional filter) |

### Projects
| Tool | Description |
|------|-------------|
| `list_projects` | List all projects |
| `get_project` | Get project details |

## Usage Examples

Once configured, you can use natural language in Claude Code:

```
> Create a PR from feature/my-branch to main in PROJECT/my-repo
> Review PR #42 in PROJECT/repo-name
> Approve PR #100
> Add a comment to PR #55 with my review notes
```

## License

MIT
