import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '../../lib/utils'
const Tabs = TabsPrimitive.Root
const TabsList = React.forwardRef(({ className, ...p }, ref) => (
  <TabsPrimitive.List ref={ref} className={cn('inline-flex items-center gap-1 rounded-xl bg-muted p-1 text-muted-foreground', className)} {...p} />
))
const TabsTrigger = React.forwardRef(({ className, ...p }, ref) => (
  <TabsPrimitive.Trigger ref={ref} className={cn('inline-flex min-h-9 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-[13px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm [&_svg]:size-4', className)} {...p} />
))
const TabsContent = React.forwardRef(({ className, ...p }, ref) => (
  <TabsPrimitive.Content ref={ref} className={cn('mt-4 focus-visible:outline-none', className)} {...p} />
))
export { Tabs, TabsList, TabsTrigger, TabsContent }
