import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'
const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogClose = DialogPrimitive.Close
const DialogContent = React.forwardRef(({ className, children, container, ...p }, ref) => (
  <DialogPrimitive.Portal container={container}>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#04262A]/60" />
    <DialogPrimitive.Content ref={ref} className={cn('fixed left-1/2 top-1/2 z-50 grid w-[calc(100vw-24px)] max-w-3xl -translate-x-1/2 -translate-y-1/2 gap-4 rounded-2xl border border-border bg-card p-5 text-foreground shadow-2xl focus:outline-none', className)} {...p}>
      {children}
      <DialogPrimitive.Close aria-label="Fermer" className="absolute right-3 top-3 inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><X className="size-4" /></DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
const DialogTitle = React.forwardRef(({ className, ...p }, ref) => <DialogPrimitive.Title ref={ref} className={cn('text-lg font-semibold tracking-tight', className)} {...p} />)
const DialogDescription = React.forwardRef(({ className, ...p }, ref) => <DialogPrimitive.Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...p} />)
export { Dialog, DialogTrigger, DialogClose, DialogContent, DialogTitle, DialogDescription }
