import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

/** Minimal valid Lexical doc from plain paragraphs — enough for seeded placeholder copy. */
export function richText(paragraphs: string[]): SerializedEditorState {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: [{ type: 'text', format: 0, style: '', mode: 'normal', detail: 0, version: 1, text }],
      })),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any
}
