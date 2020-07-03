import marked from 'marked'
import PlainTextRenderer from 'marked-plaintext'

const plaintextOptions = {
  sanitize: false,
}

export function convertToPlainText(markdownText: string) {
  const renderer = new PlainTextRenderer()

  // renderer.checkbox = (text: string) => {
  //   return text
  // }
  marked.setOptions(plaintextOptions)
  return marked(markdownText, { renderer })
}
