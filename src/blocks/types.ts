import type { Media } from '@/payload-types'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type Img = Media | number | null | undefined

export type RichTextBlockData = { blockType: 'richText'; id?: string | null; content?: SerializedEditorState | null }

export type FeatureCardsBlockData = {
  blockType: 'featureCards'
  id?: string | null
  heading?: string | null
  intro?: string | null
  columns?: '2' | '3' | '4' | null
  cards?: { icon?: string | null; title: string; body?: string | null; link?: string | null; id?: string | null }[] | null
}

export type StatsBlockData = {
  blockType: 'stats'
  id?: string | null
  stats?: { value: number; suffix?: string | null; label: string; id?: string | null }[] | null
}

export type ImageTextBlockData = {
  blockType: 'imageText'
  id?: string | null
  image?: Img
  imagePosition?: 'left' | 'right' | null
  heading?: string | null
  content?: SerializedEditorState | null
}

export type BulletListBlockData = {
  blockType: 'bulletList'
  id?: string | null
  heading?: string | null
  items?: { text: string; id?: string | null }[] | null
}

export type EquipmentGridBlockData = {
  blockType: 'equipmentGrid'
  id?: string | null
  heading?: string | null
  intro?: string | null
  equipment?: { image?: Img; name: string; unitCount?: number | null; id?: string | null }[] | null
}

export type WhyChooseUsBlockData = {
  blockType: 'whyChooseUs'
  id?: string | null
  heading?: string | null
  reasons?: { icon?: string | null; title: string; body?: string | null; id?: string | null }[] | null
}

export type CtaBlockData = {
  blockType: 'cta'
  id?: string | null
  heading: string
  body?: string | null
  buttonLabel?: string | null
  buttonHref?: string | null
}

export type ContentBlockData =
  | RichTextBlockData
  | FeatureCardsBlockData
  | StatsBlockData
  | ImageTextBlockData
  | BulletListBlockData
  | EquipmentGridBlockData
  | WhyChooseUsBlockData
  | CtaBlockData
