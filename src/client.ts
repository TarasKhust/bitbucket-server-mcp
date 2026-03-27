import axios, { type AxiosInstance } from 'axios'
import { getConfig } from './config.js'

let client: AxiosInstance | null = null

export function getClient(): AxiosInstance {
  if (client) return client

  const config = getConfig()
  if (!config) {
    throw new Error(
      'Bitbucket not configured. Set BITBUCKET_URL and BITBUCKET_TOKEN environment variables.'
    )
  }

  client = axios.create({
    baseURL: `${config.url}/rest/api/1.0`,
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  })

  return client
}
