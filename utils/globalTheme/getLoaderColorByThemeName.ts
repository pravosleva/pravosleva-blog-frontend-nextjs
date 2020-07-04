export const getLoaderColorByThemeName = (themeName: string) => {
  switch (themeName) {
    case 'gray':
    case 'hard-gray':
      return '#fff'
    case 'dark':
      return '#ff9000'
    case 'light':
    default:
      return '#0162c8'
  }
}
