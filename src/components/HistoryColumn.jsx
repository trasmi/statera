import { AnimatePresence, motion } from 'framer-motion'
import { History, Maximize2, Route, Undo2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from './ui/dialog'
import { PathFlow } from './PathFlow'
import { Icon } from '../lib/icons'
import { TREE } from '../data/tree'
import { cn } from '../lib/utils'

export function HistoryColumn({ path, current, expert, teaching, theme, onJump }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2"><History className="size-4 text-primary" /> Vos réponses</CardTitle>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{path.length}</span>
        </CardHeader>
        <CardContent>
          {path.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-5 text-center">
              <div className="mx-auto mb-2 grid size-10 place-items-center rounded-full bg-soft text-primary"><Route className="size-5" /></div>
              <p className="text-sm font-medium">Aucune réponse pour l’instant</p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Chaque réponse s’ajoute ici. Vous pourrez revenir à n’importe quelle étape.</p>
            </div>
          ) : (
            <ol className="relative space-y-2">
              <span className="absolute bottom-3 left-[15px] top-3 w-px bg-border" aria-hidden="true" />
              <AnimatePresence initial={false}>
                {path.map((p, i) => {
                  const q = TREE.nodes[p.nodeId]
                  const o = q.options.find((x) => x.id === p.optionId)
                  const last = i === path.length - 1
                  return (
                    <motion.li key={p.nodeId + p.optionId} layout initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16, height: 0 }} transition={{ duration: 0.35 }} className="relative">
                      <button type="button" onClick={() => onJump(i)} aria-label={`Revenir à l’étape ${i + 1} : ${q.criterion}`}
                        className={cn('group flex w-full cursor-pointer items-start gap-3 rounded-xl p-2 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', last && 'bg-teal-soft/60')}>
                        <span className={cn('relative z-10 grid size-[30px] shrink-0 place-items-center rounded-full border-2 text-[12px] font-semibold', last ? 'border-teal bg-teal text-[#04201C]' : 'border-primary/40 bg-card text-primary')}>{i + 1}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[12px] font-medium text-muted-foreground">{q.criterion}</span>
                          <span className="block text-[14px] font-semibold leading-snug">{o.label}</span>
                          {teaching && <span className="mt-1 block text-[12px] leading-snug text-muted-foreground">Notion : {q.concept.title}</span>}
                        </span>
                        <Undo2 className="mt-1 size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true" />
                      </button>
                    </motion.li>
                  )
                })}
              </AnimatePresence>
            </ol>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="flex items-center gap-2"><Route className="size-4 text-primary" /> {expert ? 'Chemin complet' : 'Chemin suivi'}</CardTitle>
          <Dialog>
            <DialogTrigger asChild><Button variant="ghost" size="iconSm" aria-label="Agrandir le schéma du chemin"><Maximize2 /></Button></DialogTrigger>
            <DialogContent className="max-w-2xl">
              <div><DialogTitle>Chemin suivi dans l’arbre</DialogTitle><DialogDescription>{expert ? 'Les nœuds en pointillés sont les alternatives non choisies à chaque étape.' : 'Seuls les nœuds que vous avez traversés sont affichés.'}</DialogDescription></div>
              <PathFlow path={path} current={current} expert={expert} theme={theme} height={Math.min(560, 150 + path.length * 90)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <PathFlow path={path} current={current} expert={expert} theme={theme} height={320} />
          <p className="mt-2.5 text-[12.5px] leading-relaxed text-muted-foreground">{expert ? 'Mode expert : les branches non empruntées apparaissent en pointillés.' : 'Le chemin se construit au fil de vos réponses.'}</p>
        </CardContent>
      </Card>
    </div>
  )
}
