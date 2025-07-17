type Status = "DRAFT" | "PUBLISHED" | "SCHEDULED"
type Visibility = "INTERNAL" | "PUBLIC"
type IsoDate = string
type AuthorId = string
type PhotoId = string
type UserId = number

export type Locale = [value: string, label: string]

export type Article = {
  pk: string
  tags: Array<Tag>
  fields: {
    slug: string
    title: string
    subtitle?: string
    locale: Locale[0]
    status: Status
    visibility: Visibility
    created_at: IsoDate
    updated_at: IsoDate
    published_at?: IsoDate
    author: AuthorId
    excerpt?: string
    code_injection_head?: string
    code_injection_foot?: string
    featured: boolean
    feature_image?: PhotoId
    og_image?: PhotoId
    og_title?: string
    og_description?: string
    twitter_image?: PhotoId
    twitter_title?: string
    twitter_description?: string
    meta_title?: string
    meta_description?: string
  }
}

export type Tag = {
  pk: string
  fields: {
    name: string
    slug: string
    locale: Locale[0]
    description?: string
    feature_image?: PhotoId
    feature_image_alt?: string
    feature_image_caption?: string
    og_image?: PhotoId
    og_title?: string
    og_description?: string
    twitter_image?: PhotoId
    twitter_title?: string
    twitter_description?: string
    meta_title?: string
    meta_description?: string
    code_injection_head?: string
    code_injection_foot?: string
    created_at?: IsoDate
    updated_at?: IsoDate
  }
}

export type Author = {
  pk: string
  fields: {
    user: UserId
    name: string
    active: boolean
    profile_image?: PhotoId
    cover_image?: PhotoId
  }
}
