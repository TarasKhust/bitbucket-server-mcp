import dotenv from 'dotenv'

dotenv.config()

export interface BitbucketConfig {
  url: string
  token: string
}

export function getConfig(): BitbucketConfig | null {
  const url = process.env.BITBUCKET_URL
  const token = process.env.BITBUCKET_TOKEN

  if (!url || !token) {
    return null
  }

  return {
    url: url.replace(/\/+$/, ''),
    token,
  }
}
