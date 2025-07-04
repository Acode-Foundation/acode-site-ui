import { useQuery } from '@tanstack/react-query'

export interface Plugin {
  id: string
  sku: string
  icon: string
  name: string
  price: number
  author: string
  user_id: number
  version: string
  keywords: string
  license: string
  votes_up: number
  downloads: number
  repository: string | null
  votes_down: number
  comment_count: number
  author_verified: number
  min_version_code: number
}

const fallbackPlugins: Plugin[] = [
  {
    id: "bajrangcoder.acodex",
    sku: "plugin_55610502",
    icon: "https://acode.foxdebug.com/plugin-icon/bajrangcoder.acodex",
    name: "AcodeX - Terminal",
    price: 0,
    author: "Raunak Raj",
    user_id: 2,
    version: "3.1.11",
    keywords: "[\"terminal\",\"acodex\",\"termux\"]",
    license: "MIT",
    votes_up: 28,
    downloads: 157972,
    repository: null,
    votes_down: 3,
    comment_count: 23,
    author_verified: 1,
    min_version_code: -1
  },
  {
    id: "deadlyjack.console",
    sku: "plugin_55610503",
    icon: "https://acode.foxdebug.com/plugin-icon/deadlyjack.console",
    name: "Console",
    price: 0,
    author: "DeadlyJack",
    user_id: 1,
    version: "2.1.0",
    keywords: "[\"console\",\"debug\",\"javascript\"]",
    license: "MIT",
    votes_up: 45,
    downloads: 89532,
    repository: "https://github.com/deadlyjack/console",
    votes_down: 2,
    comment_count: 15,
    author_verified: 1,
    min_version_code: -1
  },
  {
    id: "foxdebug.gitmanager",
    sku: "plugin_55610504",
    icon: "https://acode.foxdebug.com/plugin-icon/foxdebug.gitmanager",
    name: "Git Manager",
    price: 2.99,
    author: "FoxDebug",
    user_id: 3,
    version: "1.5.2",
    keywords: "[\"git\",\"version control\",\"github\"]",
    license: "GPL-3.0",
    votes_up: 67,
    downloads: 124876,
    repository: "https://github.com/foxdebug/git-manager",
    votes_down: 5,
    comment_count: 32,
    author_verified: 1,
    min_version_code: -1
  }
]

const fetchPlugins = async (filter: 'default' | 'most-downloaded' | 'newest' = 'default'): Promise<Plugin[]> => {
  try {
    let url = 'https://acode.app/api/plugins'
    
    switch (filter) {
      case 'default':
        url = 'https://acode.app/api/plugins?explore=random'
        break
      case 'most-downloaded':
        url = 'https://acode.app/api/plugins?orderBy=downloads'
        break
      case 'newest':
        url = 'https://acode.app/api/plugins?orderBy=newest'
        break
    }
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch plugins')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.warn('API fetch failed, using fallback plugins:', error)
    return fallbackPlugins
  }
}

export const usePlugins = (filter: 'default' | 'most-downloaded' | 'newest' = 'default') => {
  return useQuery({
    queryKey: ['plugins', filter],
    queryFn: () => fetchPlugins(filter),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      return failureCount < 2
    }
  })
}

export const useFeaturedPlugins = () => {
  return useQuery({
    queryKey: ['plugins', 'featured'],
    queryFn: async () => {
      const plugins = await fetchPlugins('default')
      return plugins.slice(0, 4) // Return first 4 as featured
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false
  })
}