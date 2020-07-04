import React, { useState, useCallback, useMemo, useEffect } from 'react'
import DesktopHeader from './Header/Desktop'
import MobileHeader from './Header/Mobile'
import '@/css/block-quotes.css'
import '@/css/react-image-lightbox.css'
import '@/css/react-photo-gallery.css'
import '@/css/custom-breadcrumbs.css'
import '@/css/standart-form.css'
import '@/css/tags.css'
import '@/css/tiles.css'
import '@/css/article.css'
import '@/css/global-theming.css'
import '@/css/search-panel.css'
import { withSocketApi } from '@/hocs/with-socket-api'
import { ScrollTopBtn } from './ScrollTopBtn'
import { useScroll } from '@/hooks/use-scroll'
import { useGlobalTheming } from '@/hooks/use-global-theming'

// 1. From each link in article to new browser tab:
function linkInNewTab(e) {
  try {
    const { tagName } = e?.originalTarget

    if (!tagName) return

    if (tagName === 'A') {
      e.preventDefault()
      const newLink = window.document.createElement('a')

      newLink.setAttribute('href', e.originalTarget.href)
      newLink.setAttribute('target', '_blank')
      newLink.click()
    }
  } catch (err) {
    return
  }
}
// 2. Rippled button tap effect:
function rippleEffect(e) {
  try {
    // const { classList } = e.originalTarget
    const classList = e.originalTarget?.className.split(/\s+/)
    // const { classList: parentNodeClassList } = e.originalTarget.parentNode
    const parentNodeClassList = e.originalTarget?.parentNode?.className.split(/\s+/)

    if (classList.includes('link-as-rippled-btn') || classList.includes('rippled-btn')) {
      const x = e.clientX - e.target.offsetLeft
      const ripples = document.createElement('span')

      ripples.classList.add('ripples')
      ripples.style.left = x + 'px'
      ripples.style.top = '50%'
      e.originalTarget.appendChild(ripples)
      setTimeout(() => {
        ripples.remove()
      }, 1000)
    } else if (parentNodeClassList.includes('link-as-rippled-btn') || parentNodeClassList.includes('rippled-btn')) {
      const x = e.clientX - e.originalTarget.parentNode.offsetLeft
      const ripples = document.createElement('span')

      ripples.classList.add('ripples')
      ripples.style.left = x + 'px'
      ripples.style.top = '50%'
      e.originalTarget.parentNode.appendChild(ripples)
      setTimeout(() => {
        ripples.remove()
      }, 1000)
    }
  } catch (error) {
    return
  }
}

const LayoutConnected = ({ children }) => {
  const [showScroll, setShowScroll] = useState(false)
  const isBrowser = useMemo(() => typeof window !== 'undefined', [typeof window])
  const scroll = useScroll()
  const { currentTheme } = useGlobalTheming()

  useEffect(() => {
    if (scroll.y > 200) {
      setShowScroll(true)
    } else {
      setShowScroll(false)
    }
  }, [scroll])
  useEffect(() => {
    if (isBrowser) {
      // 1.
      const articleBody = document.querySelector('.article-body')
      if (!!articleBody) articleBody.addEventListener('click', linkInNewTab)
      const galleriesWrapper = document.querySelector('.galleries-wrapper')
      if (!!galleriesWrapper) galleriesWrapper.addEventListener('click', linkInNewTab)

      // 2.
      const clickListenedSpace = document.querySelector('.universal-container')

      if (!!clickListenedSpace) clickListenedSpace.addEventListener('click', rippleEffect, true)

      return () => {
        if (isBrowser) {
          if (!!articleBody) articleBody.removeEventListener('click', linkInNewTab)
          if (!!galleriesWrapper) galleriesWrapper.removeEventListener('click', linkInNewTab)
          if (!!clickListenedSpace) clickListenedSpace.removeEventListener('click', rippleEffect)
        }
      }
    }
  }, [])

  const scrollTop = useCallback(() => {
    if (isBrowser) window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [isBrowser])
  const fullYear = useMemo(() => new Date().getFullYear(), [])

  return (
    <>
      <DesktopHeader />
      <MobileHeader />
      <div className="universal-container">
        <main style={{ padding: '20px 0 20px 0' }}>{children}</main>
      </div>
      <footer>
        <div style={{ margin: '0 auto', maxWidth: 960 + 40, lineHeight: '50px' }}>
          <span style={{ margin: '0 20px 0 20px' }}>© {fullYear}</span>
        </div>
      </footer>
      <ScrollTopBtn onClick={scrollTop} isShowed={showScroll} themeName={currentTheme}>
        <i className="fas fa-arrow-up"></i>
      </ScrollTopBtn>
    </>
  )
}

export const Layout = withSocketApi(LayoutConnected)
