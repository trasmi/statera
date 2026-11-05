import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
const Progress = React.forwardRef(({ className, value = 0, ...p }, ref) => (
  <ProgressPrimitive.Root ref={ref} value={value} className={cn('relative h-1.5 w-full overflow-hidden rounded-full bg-muted', className)} {...p}>
    <ProgressPrimitive.Indicator asChild>
      <motion.div className="h-full rounded-full bg-primary" initial={false} animate={{ width: `${value}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
    </ProgressPrimitive.Indicator>
  </ProgressPrimitive.Root>
))
Progress.displayName = 'Progress'
export { Progress }
