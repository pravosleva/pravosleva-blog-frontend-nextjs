import { useState, useEffect } from 'react'
// https://gist.github.com/joshuacerbito/ea318a6a7ca4336e9fadb9ae5bbb87f4

export const useScroll = () => {
  // Set a single object `{ x: ..., y: ..., direction: ... }` once on init
  const [scroll, setScroll] = useState({
    x: typeof window === 'undefined' || !window.document ? 0 : document.body.getBoundingClientRect().left,
    y: typeof window === 'undefined' || !window.document ? 0 : document.body.getBoundingClientRect().top,
    direction: '',
  })

  const listener = (e) => {
    // `prev` provides us the previous state: https://reactjs.org/docs/hooks-reference.html#functional-updates
    setScroll((prev) => ({
      x: typeof window === 'undefined' || !window.document ? 0 : document.body.getBoundingClientRect().left,
      y: typeof window === 'undefined' || !window.document ? 0 : -document.body.getBoundingClientRect().top,
      // Here we’re comparing the previous state to the current state to get the scroll direction
      direction:
        prev.y > (typeof window === 'undefined' || !window.document ? 0 : -document.body.getBoundingClientRect().top)
          ? 'up'
          : 'down',
    }))
  }

  useEffect(() => {
    window.addEventListener('scroll', listener)
    // cleanup function occurs on unmount
    return () => window.removeEventListener('scroll', listener)
    // Run `useEffect` only once on mount, so add `, []` after the closing curly brace }
  }, [])

  return scroll
}
