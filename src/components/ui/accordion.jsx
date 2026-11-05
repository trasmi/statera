import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'
const Accordion = AccordionPrimitive.Root
const AccordionItem = React.forwardRef(({ className, ...p }, ref) => <AccordionPrimitive.Item ref={ref} className={cn('border-b border-border last:border-0', className)} {...p} />)
const AccordionTrigger = React.forwardRef(({ className, children, ...p }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger ref={ref} className={cn('flex min-h-11 flex-1 cursor-pointer items-center justify-between gap-3 py-3 text-left text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&[data-state=open]>svg]:rotate-180', className)} {...p}>
      {children}
      <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
const AccordionContent = React.forwardRef(({ className, children, ...p }, ref) => (
  <AccordionPrimitive.Content ref={ref} className="overflow-hidden text-sm data-[state=closed]:animate-[acc-up_.2s_ease-out] data-[state=open]:animate-[acc-down_.2s_ease-out]" {...p}>
    <div className={cn('pb-4 text-muted-foreground', className)}>{children}</div>
  </AccordionPrimitive.Content>
))
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
