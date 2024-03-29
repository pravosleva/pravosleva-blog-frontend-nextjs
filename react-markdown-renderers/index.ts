import { BlockquoteRenderer } from './BlockquoteRenderer'
import {
  // CodeRendererSynthwave84,
  // CodeRendererMaterialDark,
  CodeRendererMaterialOceanic,
} from './CodeRenderer'
import { HeadingRenderer } from './HeadingRenderer'
import { ImageRenderer } from './ImageRenderer'
import { HtmlRenderer } from './HtmlRenderer'
import { LinkRenderer } from './LinkRenderer'

export * from './BlockquoteRenderer'
export * from './CodeRenderer'
export * from './HeadingRenderer'
export * from './ImageRenderer'
export * from './LinkRenderer'

export const baseRenderers = {
  blockquote: BlockquoteRenderer,
  code: CodeRendererMaterialOceanic,
  heading: HeadingRenderer,
  html: HtmlRenderer,
  image: ImageRenderer,
  link: LinkRenderer,
}
