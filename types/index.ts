export interface DirectoryLink {
  id: string
  title: string
  description: string
  url: string
  displayUrl: string
  badge?: string
  isEmail?: boolean
  status?: 'online' | 'beta' | 'coming-soon' | 'external'
  icon?: string
}

export interface DirectoryCategory {
  id: string
  name: string
  description?: string
  links: DirectoryLink[]
}

export interface DirectoryData {
  siteTitle: string
  siteTagline: string
  disclaimer: string
  maintainerNotice: string
  bannerAnnouncement?: {
    enabled: boolean
    text: string
    type: 'info' | 'warning' | 'alert'
    link?: string
  }
  categories: DirectoryCategory[]
  updatedAt?: string
}

export interface GameRole {
  id: string
  name: string
  category: 'Executive' | 'Government' | 'Scientist' | 'Military' | 'Security' | 'Safety' | 'Logistics' | 'Rebellion' | 'Neutral'
  side: 'Facility' | 'Rebellion' | 'Neutral'
  clearanceLevel: string
  hasLaunchKeycard?: boolean
  isPaid?: boolean
  costRobux?: number
  spawnLocation: string
  purpose: string
  responsibilities: string[]
  equipment?: string[]
}

export interface FacilityLocation {
  id: string
  name: string
  category: 'Exterior' | 'Interior' | 'Executive/Government' | 'Science & Reactor' | 'Military'
  clearanceRequired: string
  description: string
  associatedRoles: string[]
  keyFeatures: string[]
}

export interface TerminalLocation {
  id: string
  name: string
  location: string
  description: string
}

export interface GamepassItem {
  name: string
  role: string
  robux: number
  description: string
}

export interface OfficialLoreData {
  developerNotice: string
  creator: string
  facts: {
    id: string
    title: string
    statement: string
  }[]
  discordInfo: {
    text: string
    url: string
    displayUrl: string
  }
}

export interface WwwSiteData {
  siteTitle: string
  siteTagline: string
  heroDescription: string
  robloxExperienceUrl: string
  discordUrl: string
  bannerAlert?: {
    enabled: boolean
    level: 'NOMINAL' | 'DEFCON 3' | 'DEFCON 2' | 'LEVEL 5 EMERGENCY'
    message: string
  }
  roles: GameRole[]
  locations: FacilityLocation[]
  sabotageTerminals: TerminalLocation[]
  gamepasses: GamepassItem[]
  officialLore?: OfficialLoreData
  updatedAt?: string
}
