import React from 'react'
import { PulseLoader } from 'react-spinners'
import { getLoaderColorByThemeName } from '@/utils/globalTheme/getLoaderColorByThemeName'
import { useGlobalTheming } from '@/hooks/use-global-theming'

interface IProps {
  isForImage?: boolean
}

export const Loader = ({ isForImage }: IProps) => {
  const { currentTheme } = useGlobalTheming()

  return (
    <div className={`fade-in-effect ${isForImage ? 'loader-wrapper loader-wrapper-for-image' : 'loader-wrapper'}`}>
      <PulseLoader size={15} margin={5} color={getLoaderColorByThemeName(currentTheme)} loading={true} />
    </div>
  )
}
