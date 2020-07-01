import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

export const withScrollDisabler = (WrappedComponent) => {
  const Wrapper = (props) => {
    const scrollDisablingComponentsList = useSelector((state) => state.scrollDisablingComponents.list)
    const scrollToRef = (ref, paddingTop = 10) => {
      if (ref.current) {
        window.scrollTo({
          top: ref.current.offsetTop - paddingTop,
          behavior: 'smooth',
        })
      }
    }

    useEffect(() => {
      const shouldDisable = scrollDisablingComponentsList.length > 0

      document.body.style.overflow = shouldDisable ? 'hidden' : 'auto'
      document.body.style.position = shouldDisable ? 'fixed' : null
      document.body.style.left = shouldDisable ? '0' : null
      document.body.style.right = shouldDisable ? '0' : null
    }, [scrollDisablingComponentsList.length])

    return <WrappedComponent {...props} scrollToRef={scrollToRef} />
  }

  return Wrapper
}
