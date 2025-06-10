import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-0 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-800",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500 dark:bg-red-600 dark:hover:bg-red-700 dark:active:bg-red-800",
        success:
          "bg-green-600 text-white shadow-sm hover:bg-green-700 active:bg-green-800 focus-visible:ring-green-500 dark:bg-green-600 dark:hover:bg-green-700 dark:active:bg-green-800",
        warning:
          "bg-amber-600 text-white shadow-sm hover:bg-amber-700 active:bg-amber-800 focus-visible:ring-amber-500 dark:bg-amber-600 dark:hover:bg-amber-700 dark:active:bg-amber-800",
        outline:
          "border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100 focus-visible:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white dark:active:bg-gray-600",
        "outline-destructive":
          "border border-red-300 bg-white text-red-700 shadow-sm hover:bg-red-50 hover:text-red-800 hover:border-red-400 active:bg-red-100 focus-visible:ring-red-500 dark:border-red-700 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 dark:hover:border-red-600 dark:active:bg-red-900/30",
        "outline-success":
          "border border-green-300 bg-white text-green-700 shadow-sm hover:bg-green-50 hover:text-green-800 hover:border-green-400 active:bg-green-100 focus-visible:ring-green-500 dark:border-green-700 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-green-900/20 dark:hover:text-green-300 dark:hover:border-green-600 dark:active:bg-green-900/30",
        secondary:
          "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200 active:bg-gray-300 focus-visible:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 dark:active:bg-gray-500",
        ghost: 
          "text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 focus-visible:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white dark:active:bg-gray-700",
        "ghost-destructive":
          "text-red-600 hover:bg-red-50 hover:text-red-700 active:bg-red-100 focus-visible:ring-red-500 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 dark:active:bg-red-900/30",
        link: 
          "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700 active:text-blue-800 focus-visible:ring-blue-500 dark:text-blue-400 dark:hover:text-blue-300 dark:active:text-blue-200",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-9 w-9",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
