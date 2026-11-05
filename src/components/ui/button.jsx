import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm hover:brightness-110 active:scale-[.98]',
        secondary: 'bg-muted text-foreground hover:bg-border',
        outline: 'border border-border bg-card text-foreground hover:bg-muted',
        ghost: 'text-foreground hover:bg-muted',
        teal: 'bg-teal text-[#04201C] shadow-sm hover:brightness-105 active:scale-[.98]',
      },
      size: { default: 'h-11 px-4', sm: 'h-9 px-3 text-[13px]', lg: 'h-12 px-6 text-[15px]', icon: 'size-11', iconSm: 'size-9' },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)
const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
})
Button.displayName = 'Button'
export { Button, buttonVariants }
