import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Start with a sensible default value of false instead of undefined
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Check if window is available (client-side rendering)
    if (typeof window !== "undefined") {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      const onChange = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }
      
      // Set initial value
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      
      // Modern approach to event listeners
      try {
        mql.addEventListener("change", onChange)
        return () => mql.removeEventListener("change", onChange)
      } catch (e) {
        // Fallback for older browsers
        mql.addListener(onChange)
        return () => mql.removeListener(onChange)
      }
    }
  }, [])

  return isMobile
}
