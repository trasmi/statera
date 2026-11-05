import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'
const badgeVariants = cva('inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap [&_svg]:size-3', {
  variants: {
    variant: {
      default: 'border-transparent bg-soft text-primary',
      secondary: 'border-transparent bg-muted text-muted-foreground',
      outline: 'border-border text-muted-foreground',
      teal: 'border-transparent bg-teal-soft text-teal-ink',
      amber: 'border-transparent bg-amber-soft text-amber-ink',
    },
  },
  defaultVariants: { variant: 'default' },
})
function Badge({ className, variant, ...props }) { return <span className={cn(badgeVariants({ variant }), className)} {...props} /> }
export { Badge, badgeVariants }
