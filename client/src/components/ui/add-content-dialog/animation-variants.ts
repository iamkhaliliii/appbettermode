export const slideVariants = {
  initial: (direction: "left" | "right") => ({
    opacity: 0,
    x: direction === "left" ? 20 : -20,
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut"
    }
  },
  exit: (direction: "left" | "right") => ({
    opacity: 0,
    x: direction === "left" ? -20 : 20,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  })
};

export const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { 
    opacity: 1, 
    y: 0
  }
}; 