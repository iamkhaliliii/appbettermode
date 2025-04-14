import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#7F56D9] text-white border-2 border-white/12 shadow-[0px_0px_0px_1px_rgba(16,24,40,0.18)_inset,0px_-2px_0px_0px_rgba(16,24,40,0.05)_inset,0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#7F56D9]/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        "secondary-gray":
          "bg-white border border-[#D0D5DD] shadow-[0px_0px_0px_1px_rgba(16,24,40,0.18)_inset,0px_-2px_0px_0px_rgba(16,24,40,0.05)_inset,0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-gray-50",
        "secondary-color":
          "bg-white border border-[#D6BBFB] shadow-[0px_0px_0px_1px_rgba(16,24,40,0.18)_inset,0px_-2px_0px_0px_rgba(16,24,40,0.05)_inset,0px_1px_2px_0px_rgba(16,24,40,0.05)] text-[#7F56D9] hover:bg-gray-50",
        "tertiary-gray": "text-gray-600 hover:bg-gray-50",
        "tertiary-color": "text-[#7F56D9] hover:bg-gray-50",
        "link-gray": "text-gray-600 underline-offset-4 hover:underline",
        "link-color": "text-[#7F56D9] underline-offset-4 hover:underline",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "px-[14px] py-[10px]",
        sm: "h-9 px-3 py-2",
        lg: "h-11 px-8 py-3",
        icon: "h-10 w-10",
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
