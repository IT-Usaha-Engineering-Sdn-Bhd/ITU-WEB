import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Rich Text', plural: 'Rich Text Blocks' },
  fields: [{ name: 'content', type: 'richText', editor: lexicalEditor() }],
}

export const FeatureCardsBlock: Block = {
  slug: 'featureCards',
  labels: { singular: 'Feature Cards', plural: 'Feature Cards Blocks' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'intro', type: 'textarea' },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: ['2', '3', '4'],
    },
    {
      name: 'cards',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'icon', type: 'text', admin: { description: 'Icon name, e.g. from lucide-react' } },
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
        { name: 'link', type: 'text' },
      ],
    },
  ],
}

export const StatsBlock: Block = {
  slug: 'stats',
  labels: { singular: 'Stats', plural: 'Stats Blocks' },
  fields: [
    {
      name: 'stats',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      fields: [
        { name: 'value', type: 'number', required: true },
        { name: 'suffix', type: 'text', admin: { description: 'e.g. "+"' } },
        { name: 'label', type: 'text', required: true },
      ],
    },
  ],
}

export const ImageTextBlock: Block = {
  slug: 'imageText',
  labels: { singular: 'Image + Text', plural: 'Image + Text Blocks' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'imagePosition', type: 'select', defaultValue: 'left', options: ['left', 'right'] },
    { name: 'heading', type: 'text' },
    { name: 'content', type: 'richText', editor: lexicalEditor() },
  ],
}

export const BulletListBlock: Block = {
  slug: 'bulletList',
  labels: { singular: 'Bullet List', plural: 'Bullet List Blocks' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [{ name: 'text', type: 'text', required: true }],
    },
  ],
}

export const EquipmentGridBlock: Block = {
  slug: 'equipmentGrid',
  labels: { singular: 'Equipment Grid', plural: 'Equipment Grid Blocks' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'intro', type: 'textarea' },
    {
      name: 'equipment',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'name', type: 'text', required: true },
        { name: 'unitCount', type: 'number' },
      ],
    },
  ],
}

export const WhyChooseUsBlock: Block = {
  slug: 'whyChooseUs',
  labels: { singular: 'Why Choose Us', plural: 'Why Choose Us Blocks' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Why Choose Us' },
    {
      name: 'reasons',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'icon', type: 'text' },
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
      ],
    },
  ],
}

export const CtaBlock: Block = {
  slug: 'cta',
  labels: { singular: 'CTA', plural: 'CTA Blocks' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    { name: 'buttonLabel', type: 'text', defaultValue: 'Contact Us' },
    { name: 'buttonHref', type: 'text', defaultValue: '/contact-us/' },
  ],
}

export const contentBlocks: Block[] = [
  RichTextBlock,
  FeatureCardsBlock,
  StatsBlock,
  ImageTextBlock,
  BulletListBlock,
  EquipmentGridBlock,
  WhyChooseUsBlock,
  CtaBlock,
]
