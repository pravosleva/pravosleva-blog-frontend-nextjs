import { create } from '@storybook/theming/create'

export default create({
  base: 'light',

  colorPrimary: '#01AEEF',
  colorSecondary: 'deepskyblue',

  // UI
  appBg: '#f8f8f8',
  appContentBg: '#fff',
  appBorderColor: '#333',
  appBorderRadius: 6,

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: '#333',
  textInverseColor: '#fff',

  // Toolbar default and active colors
  barTextColor: '#fff',
  barSelectedColor: '#000',
  barBg: '#01AEEF',

  // Form colors
  inputBg: '#fff',
  inputBorder: '#333',
  inputTextColor: '#000',
  inputBorderRadius: 6,

  brandTitle: 'My custom storybook',
  brandUrl: 'https://example.com',
  brandImage: 'https://uremont.com/static/img/logo-uremont-black.svg',
})
