import { configure } from '@storybook/react'

const req = require.context('../ui-kit', true, /.stories.(t|j)sx$/)
function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module)
