import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Ban, Check, CircleHelp, GraduationCap, Lightbulb, Microscope } from 'lucide-react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Icon } from '../lib/icons'
import { cn } from '../lib/utils'
import { reachableTests } from '../data/tree'
import { SHORT, TESTS } from '../data/tests'

export function QuestionCard({ node, step, totalMin, totalMax, onAnswer, onBack, canBack, teaching, expert }) {
  const [picked, setPicked] = useState(null)
  const [help, setHelp] = useState(false)

  const choose = (o) => {
    if (picked) return
    setPicked(o.id)
    setTimeout(() => onAnswer(o.id), 480)
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative border-b border-border px-5 pb-5 pt-5 sm:px-7 sm:pt-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge><Icon name={node.icon} /> {node.criterion}</Badge>
          <span className="text-xs font-medium text-muted-foreground">Question {step} · {totalMin === totalMax ? totalMin : `${totalMin} à ${totalMax}`} questions au total</span>
        </div>
        <h2 className="text-balance text-[24px] font-medium leading-tight tracking-[-0.025em] sm:text-[32px]">{node.title}</h2>
        <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-muted-foreground">{node.lead}</p>
      </div>

      <div className="space-y-5 px-5 py-5 sm:px-7 sm:py-6">
        <AnimatePresence initial={false}>
          {teaching && (
            <motion.div key="teach" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="rounded-xl border border-primary/25 bg-soft p-4">
                <div className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-primary"><GraduationCap className="size-4" /> Pourquoi cette question ?</div>
                <p className="text-[14px] leading-relaxed text-foreground/90">{node.why}</p>
                <div className="mt-3 rounded-lg bg-card/70 p-3">
                  <div className="text-[13px] font-semibold">{node.concept.title}</div>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">{node.concept.body}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div role="group" aria-label="Réponses possibles" className="grid gap-3">
          {node.options.map((o, i) => {
            const sel = picked === o.id
            const dim = picked && !sel
            const cands = reachableTests(o.next)
            return (
              <motion.button
                key={o.id} type="button" onClick={() => choose(o)} disabled={!!picked && !sel}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: dim ? 0.38 : 1, y: 0, scale: sel ? 1.012 : 1 }}
                transition={{ delay: picked ? 0 : 0.06 * i + 0.05, duration: 0.35 }}
                whileHover={picked ? undefined : { y: -2 }} whileTap={picked ? undefined : { scale: 0.992 }}
                className={cn(
                  'group relative flex w-full cursor-pointer items-start gap-4 rounded-2xl border bg-card p-4 text-left shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-5',
                  sel ? 'border-primary bg-soft' : 'border-border hover:border-primary/50 hover:bg-soft/60'
                )}
              >
                <span className={cn('grid size-11 shrink-0 place-items-center rounded-xl transition-colors', sel ? 'bg-primary text-primary-foreground' : 'bg-soft text-primary group-hover:bg-primary group-hover:text-primary-foreground')}>
                  {sel ? <Check className="size-5" /> : <Icon name={o.icon} className="size-5" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-semibold leading-snug">{o.label}</span>
                  <span className="mt-1 block text-[13.5px] leading-relaxed text-muted-foreground">{o.desc}</span>
                  {teaching && (
                    <span className="mt-2.5 flex items-start gap-2 rounded-lg bg-muted/70 px-2.5 py-2 text-[12.5px] leading-relaxed text-muted-foreground">
                      <Ban className="mt-0.5 size-3.5 shrink-0" /> <span><b className="font-semibold text-foreground">Branches écartées si vous choisissez ceci :</b> {o.excludes}</span>
                    </span>
                  )}
                  {expert && (
                    <span className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      <span className="text-[12px] font-medium text-muted-foreground">Mène à</span>
                      {cands.map((t) => (
                        <span key={t} className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[12px]', TESTS[t].family === 'param' ? 'border-primary/30 text-primary' : 'border-amber-ink/40 text-amber-ink')}>
                          <span className={cn('size-1.5 rounded-full', TESTS[t].family === 'param' ? 'bg-primary' : 'bg-amber-ink')} />{SHORT[t]}
                        </span>
                      ))}
                    </span>
                  )}
                </span>
                <ArrowRight className="mt-3 size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" aria-hidden="true" />
              </motion.button>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <Button variant="ghost" onClick={onBack} disabled={!canBack || !!picked} className="-ml-2">
            <ArrowLeft /> Retour
          </Button>
          <Button variant={help ? 'default' : 'outline'} onClick={() => setHelp((h) => !h)} aria-expanded={help}>
            <CircleHelp /> Je ne connais pas la réponse
          </Button>
        </div>

        <AnimatePresence initial={false}>
          {help && (
            <motion.div key="help" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
              <div className="rounded-2xl border border-teal/50 bg-teal-soft p-5">
                <div className="mb-2 flex items-center gap-2 text-[15px] font-semibold text-teal-ink"><Lightbulb className="size-4" /> {node.help.title}</div>
                <p className="text-[14.5px] leading-relaxed text-foreground/90">{node.help.body}</p>
                <div className="mt-3 rounded-xl bg-card/80 p-3.5 text-[14px] leading-relaxed">
                  <span className="mb-1 block text-[12px] font-semibold text-muted-foreground">Exemple simple</span>
                  {node.help.example}
                </div>
                <p className="mt-3 text-[13.5px] leading-relaxed text-teal-ink"><b>Astuce :</b> {node.help.tip}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {expert && (
          <div className="rounded-xl border border-dashed border-border p-3.5 font-mono text-[11.5px] leading-relaxed text-muted-foreground">
            <div className="mb-1 flex items-center gap-1.5 font-sans text-[12px] font-semibold text-foreground"><Microscope className="size-3.5" /> Mode expert</div>
            nœud : {node.id} · tests encore atteignables : {reachableTests(node.id).length}/17 · réponses : {node.options.map((o) => o.id).join(' | ')}
          </div>
        )}
      </div>
    </Card>
  )
}
