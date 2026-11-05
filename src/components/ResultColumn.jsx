import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { BookOpen, Flag, GraduationCap, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { LEVELS, TESTS, SHORT, GROUPS } from '../data/tests'
import { TREE, ALL_TESTS } from '../data/tree'
import { cn } from '../lib/utils'

export function ResultColumn({ path, current, candidates, isLeaf, teaching, expert }) {
  const node = TREE.nodes[current]
  const n = candidates.length
  const final = isLeaf ? TESTS[node.test] : null
  const concepts = path.map((p) => TREE.nodes[p.nodeId].concept)
  if (!isLeaf) concepts.push(node.concept)
  const uniq = concepts.filter((c, i) => concepts.findIndex((d) => d.title === c.title) === i)

  return (
    <div className="space-y-4">
      <Card className={cn('overflow-hidden transition-colors', isLeaf && 'border-teal/60')}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            {isLeaf ? <Flag className="size-4 text-teal-ink" /> : <Sparkles className="size-4 text-primary" />}
            {isLeaf ? 'Test recommandé' : 'Recommandation provisoire'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait" initial={false}>
            {isLeaf ? (
              <motion.div key="final" initial={{ opacity: 0, scale: 0.94, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 20 }}>
                <div className="rounded-xl bg-[#06525C] p-4 text-white dark:bg-[#0F4149]">
                  <div className="text-[12px] font-semiboldr text-white/75">Votre test</div>
                  <div className="mt-1 text-[19px] font-semibold leading-snug">{final.name}</div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium">{final.family === 'param' ? 'Paramétrique' : 'Non paramétrique'}</span>
                    <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium">{LEVELS[final.level].label}</span>
                  </div>
                </div>
                <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{final.objectif}</p>
              </motion.div>
            ) : (
              <motion.div key="prov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-end gap-3">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span key={n} initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -18, opacity: 0 }} transition={{ duration: 0.3 }} className="bg-gradient-to-br from-primary to-teal bg-clip-text text-[52px] font-bold leading-none tracking-tight text-transparent">{n}</motion.span>
                  </AnimatePresence>
                  <span className="pb-1 text-[14px] leading-snug text-muted-foreground">{n === 17 ? 'tests possibles. Répondez pour affiner.' : n === 2 ? 'tests possibles. Dernière question !' : n === 1 ? 'test possible.' : 'tests encore possibles'}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between gap-2">
            <span>Tests encore en lice</span>
            <span className="text-xs font-normal text-muted-foreground">{n} / {ALL_TESTS.length}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3.5">
          <LayoutGroup>
            {GROUPS.map((g) => (
              <div key={g.label}>
                <div className="mb-1.5 text-[12px] font-semibold text-muted-foreground">{g.label}</div>
                <div className="flex flex-wrap gap-1.5">
                  {g.tests.map((t) => {
                    const on = candidates.includes(t)
                    const sel = isLeaf && node.test === t
                    return (
                      <motion.span key={t} layout animate={{ opacity: on ? 1 : 0.4, scale: sel ? 1.06 : 1 }} transition={{ duration: 0.35 }}
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium',
                          sel ? 'border-teal bg-teal text-[#04201C]' : on ? 'border-primary/35 bg-soft text-primary' : 'border-border bg-muted text-muted-foreground line-through decoration-1'
                        )}>
                        {expert && <span className={cn('size-1.5 rounded-full', TESTS[t].family === 'param' ? 'bg-primary' : 'bg-amber-ink')} aria-hidden="true" />}
                        {SHORT[t]}
                      </motion.span>
                    )
                  })}
                </div>
              </div>
            ))}
          </LayoutGroup>
          {expert && (
            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-3 text-[12px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" /> paramétrique</span>
              <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-amber-ink" /> non paramétrique</span>
            </div>
          )}
        </CardContent>
      </Card>

      {path.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle>Ce que l’on sait déjà</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              <AnimatePresence initial={false}>
                {path.map((p) => {
                  const q = TREE.nodes[p.nodeId]
                  return (
                    <motion.span key={p.nodeId} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                      <Badge variant="secondary" className="max-w-full">{q.options.find((o) => o.id === p.optionId).short}</Badge>
                    </motion.span>
                  )
                })}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      )}

      {teaching && uniq.length > 0 && (
        <Card className="border-primary/25">
          <CardHeader className="pb-1"><CardTitle className="flex items-center gap-2"><GraduationCap className="size-4 text-primary" /> Notions abordées</CardTitle></CardHeader>
          <CardContent>
            <Accordion type="single" collapsible defaultValue={uniq[uniq.length - 1].title}>
              {uniq.map((c) => (
                <AccordionItem key={c.title} value={c.title}>
                  <AccordionTrigger><span className="flex items-center gap-2"><BookOpen className="size-3.5 text-primary" />{c.title}</span></AccordionTrigger>
                  <AccordionContent>{c.body}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {expert && (
        <Card>
          <CardHeader className="pb-2"><CardTitle>Chemin dans l’arbre</CardTitle></CardHeader>
          <CardContent>
            <p className="break-words font-mono text-[11.5px] leading-relaxed text-muted-foreground">
              {path.length ? path.map((p) => `${p.nodeId}:${p.optionId}`).join(' › ') + ' › ' + current : current}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
