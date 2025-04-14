import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-xs font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#7F56D9] text-white border border-[#7F56D9] hover:bg-[#7F56D9]/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        "secondary-gray":
          "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
        "secondary-color":
          "bg-white border border-[#D6BBFB] text-[#7F56D9] hover:bg-gray-50",
        "tertiary-gray": "text-gray-600 hover:bg-gray-50",
        "tertiary-color": "text-[#7F56D9] hover:bg-gray-50",
        "link-gray": "text-gray-600 hover:underline p-0",
        "link-color": "text-[#7F56D9] hover:underline p-0",
        ghost: "hover:bg-gray-50 text-gray-500",
      },
      size: {
        default: "px-3.5 py-2",
        sm: "px-2.5 py-1.5",
        lg: "px-4 py-2.5",
        icon: "h-8 w-8 p-0",
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
