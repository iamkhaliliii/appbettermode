import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import {
  AnimatePresence as FramerAnimatePresence,
  HTMLMotionProps,
  TargetAndTransition,
  motion as framerMotion,
  useMotionValue as framerUseMotionValue,
  useSpring as framerUseSpring,
} from "framer-motion"
import useMeasure from "react-use-measure"

import { cn } from "@/lib/utils"

const springConfig = { stiffness: 200, damping: 20, bounce: 0.2 }

interface ExpandableContextType {
  isExpanded: boolean
  toggleExpand: () => void
  expandDirection: "vertical" | "horizontal" | "both"
  expandBehavior: "replace" | "push"
  transitionDuration: number
  easeType: string
  initialDelay: number
  onExpandEnd?: () => void
  onCollapseEnd?: () => void
}

const ExpandableContext = createContext<ExpandableContextType>({
  isExpanded: false,
  toggleExpand: () => {},
  expandDirection: "vertical",
  expandBehavior: "replace",
  transitionDuration: 0.3,
  easeType: "easeInOut",
  initialDelay: 0,
})

const useExpandable = () => useContext(ExpandableContext)

type ExpandablePropsBase = Omit<HTMLMotionProps<"div">, "children">

interface ExpandableProps extends ExpandablePropsBase {
  children: ReactNode | ((props: { isExpanded: boolean }) => ReactNode)
  expanded?: boolean
  onToggle?: () => void
  transitionDuration?: number
  easeType?: string
  expandDirection?: "vertical" | "horizontal" | "both"
  expandBehavior?: "replace" | "push"
  initialDelay?: number
  onExpandStart?: () => void
  onExpandEnd?: () => void
  onCollapseStart?: () => void
  onCollapseEnd?: () => void
}

export const Expandable = React.forwardRef<HTMLDivElement, ExpandableProps>(
  (
    {
      children,
      expanded,
      onToggle,
      transitionDuration = 0.3,
      easeType = "easeInOut",
      expandDirection = "vertical",
      expandBehavior = "replace",
      initialDelay = 0,
      onExpandStart,
      onExpandEnd,
      onCollapseStart,
      onCollapseEnd,
      ...props
    },
    ref
  ) => {
    const [isExpandedInternal, setIsExpandedInternal] = useState(false)
    const isExpanded = expanded !== undefined ? expanded : isExpandedInternal
    const toggleExpand =
      onToggle || (() => setIsExpandedInternal((prev) => !prev))

    useEffect(() => {
      if (isExpanded) {
        onExpandStart?.()
      } else {
        onCollapseStart?.()
      }
    }, [isExpanded, onExpandStart, onCollapseStart])

    const contextValue: ExpandableContextType = {
      isExpanded,
      toggleExpand,
      expandDirection,
      expandBehavior,
      transitionDuration,
      easeType,
      initialDelay,
      onExpandEnd,
      onCollapseEnd,
    }

    return (
      <ExpandableContext.Provider value={contextValue}>
        <framerMotion.div
          ref={ref}
          initial={false}
          animate={{
            transition: {
              duration: transitionDuration,
              ease: easeType,
              delay: initialDelay,
            },
          }}
          {...props}
        >
          {typeof children === "function" ? children({ isExpanded }) : children}
        </framerMotion.div>
      </ExpandableContext.Provider>
    )
  }
)
Expandable.displayName = "Expandable"

type AnimationPreset = {
  initial: { [key: string]: any }
  animate: { [key: string]: any }
  exit: { [key: string]: any }
}

const ANIMATION_PRESETS: Record<string, AnimationPreset> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "slide-up": {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  "slide-down": {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  "slide-left": {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  "slide-right": {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  rotate: {
    initial: { opacity: 0, rotate: -10 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: -10 },
  },
  "blur-sm": {
    initial: { opacity: 0, filter: "blur(4px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(4px)" },
  },
  "blur-md": {
    initial: { opacity: 0, filter: "blur(8px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(8px)" },
  },
  "blur-lg": {
    initial: { opacity: 0, filter: "blur(16px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(16px)" },
  },
}

interface AnimationProps {
  initial?: TargetAndTransition
  animate?: TargetAndTransition
  exit?: TargetAndTransition
  transition?: any
}

const getAnimationProps = (
  preset: keyof typeof ANIMATION_PRESETS | undefined,
  animateIn?: AnimationProps,
  animateOut?: AnimationProps
) => {
  const defaultAnimation = {
    initial: {},
    animate: {},
    exit: {},
  }

  const presetAnimation = preset ? ANIMATION_PRESETS[preset] : defaultAnimation

  return {
    initial: presetAnimation.initial,
    animate: presetAnimation.animate,
    exit: animateOut?.exit || presetAnimation.exit,
  }
}

export const ExpandableContent = React.forwardRef<
  HTMLDivElement,
  Omit<HTMLMotionProps<"div">, "ref"> & {
    preset?: keyof typeof ANIMATION_PRESETS
    animateIn?: AnimationProps
    animateOut?: AnimationProps
    stagger?: boolean
    staggerChildren?: number
    keepMounted?: boolean
  }
>(
  (
    {
      children,
      preset,
      animateIn,
      animateOut,
      stagger = false,
      staggerChildren = 0.1,
      keepMounted = false,
      ...props
    },
    ref
  ) => {
    const { isExpanded, transitionDuration, easeType } = useExpandable()
    const [measureRef, { height: measuredHeight }] = useMeasure()
    const animatedHeight = framerUseMotionValue(0)
    const smoothHeight = framerUseSpring(animatedHeight, springConfig)

    useEffect(() => {
      if (isExpanded) {
        animatedHeight.set(measuredHeight)
      } else {
        animatedHeight.set(0)
      }
    }, [isExpanded, measuredHeight, animatedHeight])

    const animationProps = getAnimationProps(preset, animateIn, animateOut)

    return (
      <framerMotion.div
        ref={ref}
        style={{
          height: smoothHeight,
          overflow: "hidden",
        }}
        transition={{ duration: transitionDuration, ease: easeType }}
        {...props}
      >
        <FramerAnimatePresence initial={false}>
          {(isExpanded || keepMounted) && (
            <framerMotion.div
              ref={measureRef}
              initial={animationProps.initial}
              animate={animationProps.animate}
              exit={animationProps.exit}
              transition={{ duration: transitionDuration, ease: easeType }}
            >
              {stagger ? (
                <framerMotion.div
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: staggerChildren,
                      },
                    },
                  }}
                  initial="hidden"
                  animate="visible"
                >
                  {React.Children.map(
                    children as React.ReactNode,
                    (child, index) => (
                      <framerMotion.div
                        key={index}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                      >
                        {child}
                      </framerMotion.div>
                    )
                  )}
                </framerMotion.div>
              ) : (
                children
              )}
            </framerMotion.div>
          )}
        </FramerAnimatePresence>
      </framerMotion.div>
    )
  }
)
ExpandableContent.displayName = "ExpandableContent"

export const ExpandableTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  const { toggleExpand } = useExpandable()
  return (
    <div ref={ref} onClick={toggleExpand} className="cursor-pointer" {...props}>
      {children}
    </div>
  )
})
ExpandableTrigger.displayName = "ExpandableTrigger"

export { useExpandable } 