export type Creator = {
  id: string
  created_at: string
  updated_at: string
  name: string
  pronouns: string | null
  categories: string[] | null
  country: string | null
  timezone: string | null
  email: string | null
  phone: string | null
  agent_name: string | null
  agent_email: string | null
  description: string | null
  tags: string[] | null
  avatar_url: string | null
  cover_url: string | null
  consent_on_file: boolean | null
  consent_file_url: string | null
}

export type SocialLink = {
  id: string
  creator_id: string
  platform: string
  url: string
  followers: number | null
}

export type MediaAsset = {
  id: string
  creator_id: string
  type: 'image' | 'video' | 'file'
  url: string
  title: string | null
  caption: string | null
  created_at: string
}

export type WorkItem = {
  id: string
  creator_id: string
  title: string
  campaign: string | null
  status: 'Planned' | 'In progress' | 'Completed'
  start_date: string | null
  end_date: string | null
  deliverables: string[] | null
  links: string[] | null
  outcomes: any
  created_at: string
  updated_at: string
}

export type Note = {
  id: string
  creator_id: string | null
  work_item_id: string | null
  author: string
  body: string
  created_at: string
}

export type Rating = {
  id: string
  creator_id: string
  stars: number
  rater_name: string
  comment: string | null
  created_at: string
}
