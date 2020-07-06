import { useState, useEffect } from 'react'
import useDebounce from './use-debounce'

export const useDeviceWidth = () => {
  const [monitorWidth, setMonitorWidth] = useState<number>(window.innerWidth)
  const debouncedCurrentWidth = useDebounce(monitorWidth, 500)

  useEffect(() => {
    const setDevice = () => {
      // eslint-disable-next-line no-console
      console.log('CALLED')
      const currentWidth = window.innerWidth

      setMonitorWidth(currentWidth)
    }

    setDevice() // First call only;
    window.addEventListener('resize', setDevice)

    return () => {
      window.removeEventListener('resize', setDevice)
    }
  }, [])

  return {
    width: debouncedCurrentWidth,
  }
}
