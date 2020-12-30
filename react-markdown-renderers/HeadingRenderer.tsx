import React from 'react'
import slugify from 'slugify'

function flatten(text: string, child: any): React.ReactElement {
  // @ts-ignore
  return typeof child === 'string' ? text + child : React.Children.toArray(child.props.children).reduce(flatten, text)
}

export function HeadingRenderer(props: any) {
  const children = React.Children.toArray(props.children)
  const text = children.reduce(flatten, '')
  const slug = slugify(`${props.level}-${text}`).toLowerCase() // .replace(/\W/g, '-')

  return React.createElement('h' + props.level, { id: slug }, props.children)
}