import * as React from 'react'
import { cn } from '../../lib/utils'
const Card = React.forwardRef(({ className, ...p }, ref) => (
  <div ref={ref} className={cn('rounded-2xl border border-border bg-card text-foreground shadow-soft', className)} {...p} />
))
const CardHeader = ({ className, ...p }) => <div className={cn('flex flex-col gap-1.5 p-5 pb-3', className)} {...p} />
const CardTitle = ({ className, ...p }) => <h3 className={cn('text-[15px] font-semibold leading-tight tracking-tight', className)} {...p} />
const CardDescription = ({ className, ...p }) => <p className={cn('text-sm text-muted-foreground', className)} {...p} />
const CardContent = ({ className, ...p }) => <div className={cn('p-5 pt-0', className)} {...p} />
export { Card, CardHeader, CardTitle, CardDescription, CardContent }
