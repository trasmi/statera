import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '../../lib/utils'
const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger
const TooltipContent = React.forwardRef(({ className, sideOffset = 6, ...p }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content ref={ref} sideOffset={sideOffset} className={cn('z-50 max-w-xs rounded-lg bg-foreground px-3 py-1.5 text-xs text-background shadow-lg', className)} {...p} />
  </TooltipPrimitive.Portal>
))
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
