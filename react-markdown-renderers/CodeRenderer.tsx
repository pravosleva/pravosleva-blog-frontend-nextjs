import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
// @ts-ignore
import { synthwave84, materialDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

export const CodeRendererSynthwave84 = ({ language, value }: any) => {
  return <SyntaxHighlighter showLineNumbers={false} style={synthwave84} language={language} children={value} />
}

export const CodeRendererMaterialDark = ({ language, value }: any) => {
  return <SyntaxHighlighter showLineNumbers={false} style={materialDark} language={language} children={value} />
}