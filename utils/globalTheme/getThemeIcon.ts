export const getThemeIcon = (currentTheme: string) => {
  switch (currentTheme) {
    case 'dark':
      return 'fas fa-moon'
    case 'gray':
      return 'fas fa-adjust'
    case 'light':
    default:
      return 'fas fa-lightbulb'
  }
}
