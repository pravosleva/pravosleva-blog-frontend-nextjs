import { addons } from '@storybook/addons'
// import { themes } from '@storybook/theming'
// EXAMPLE: theme: themes.dark,
import uremontTheme from './uremontTheme'

addons.setConfig({
  theme: uremontTheme,
})
