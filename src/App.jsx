import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { History, ListChecks, MessagesSquare } from 'lucide-react'
import { TooltipProvider } from './components/ui/tooltip'
import { Header } from './components/Header'
import { HistoryColumn } from './components/HistoryColumn'
import { QuestionCard } from './components/QuestionCard'
import { ResultColumn } from './components/ResultColumn'
import { Fiche } from './components/Fiche'
import { TREE, reachableTests, minDepth, maxDepth } from './data/tree'
import { cn, lsGet, lsSet } from './lib/utils'

const slide = {
  enter: (d) => ({ opacity: 0, x: d * 48, scale: 0.985 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (d) => ({ opacity: 0, x: -d * 48, scale: 0.985 }),
}

function useTheme() {
  const [theme, setTheme] = useState(() => {
    const s = lsGet('statera-theme', null)
    if (s === 'dark' || s === 'light') return s
    try { return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' } catch (e) { return 'light' }
  })
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    lsSet('statera-theme', theme)
  }, [theme])
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))]
}

export default function App() {
  const [path, setPath] = useState([])
  const [dir, setDir] = useState(1)
  const [teaching, setTeaching] = useState(() => lsGet('statera-teaching', false))
  const [expert, setExpert] = useState(() => lsGet('statera-expert', false))
  const [theme, toggleTheme] = useTheme()
  const [tab, setTab] = useState('question')

  useEffect(() => lsSet('statera-teaching', teaching), [teaching])
  useEffect(() => lsSet('statera-expert', expert), [expert])

  const current = useMemo(() => {
    if (!path.length) return TREE.root
    const last = path[path.length - 1]
    return TREE.nodes[last.nodeId].options.find((o) => o.id === last.optionId).next
  }, [path])
  const node = TREE.nodes[current]
  const isLeaf = node.type === 'leaf'
  const candidates = useMemo(() => reachableTests(current), [current])
  const remaining = minDepth(current)
  const progress = isLeaf ? 100 : Math.round((path.length / (path.length + remaining)) * 100)

  const answer = useCallback((optionId) => { setDir(1); setPath((p) => [...p, { nodeId: current, optionId }]) }, [current])
  const back = useCallback(() => { setDir(-1); setPath((p) => p.slice(0, -1)) }, [])
  const jump = useCallback((i) => { setDir(-1); setPath((p) => p.slice(0, i)); setTab('question') }, [])
  const reset = useCallback(() => { setDir(-1); setPath([]); setTab('question') }, [])

  useEffect(() => { try { if (window.scrollY > 100) window.scrollTo({ top: 0, behavior: 'smooth' }) } catch (e) { /* ignore */ } }, [current])

  const col = (name) => cn(tab === name ? 'block' : 'hidden', 'lg:block')

  return (
    <TooltipProvider delayDuration={150}>
      <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[460px] overflow-hidden" aria-hidden="true">
          <div className="absolute -left-24 -top-40 size-[420px] rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -right-20 -top-32 size-[380px] rounded-full bg-teal/15 blur-3xl" />
        </div>

        <Header teaching={teaching} setTeaching={setTeaching} expert={expert} setExpert={setExpert} theme={theme} toggleTheme={toggleTheme} onReset={reset} progress={progress} />

        <main className="relative mx-auto max-w-[1560px] px-4 pb-28 pt-5 lg:px-6 lg:pb-10 lg:pt-6">
          <div className="lg:grid lg:grid-cols-[300px_minmax(0,1fr)_340px] lg:items-start lg:gap-5 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
            <aside aria-label="Historique des réponses" className={cn(col('history'), 'lg:sticky lg:top-[92px] lg:max-h-[calc(100vh-110px)] lg:overflow-y-auto lg:pr-1')}>
              <HistoryColumn path={path} current={current} expert={expert} teaching={teaching} theme={theme} onJump={jump} />
            </aside>

            <section aria-label="Question courante" aria-live="polite" className={cn(col('question'), 'min-w-0')}>
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.div key={current} custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}>
                  {isLeaf ? (
                    <Fiche testId={node.test} variant={node.variant} path={path} teaching={teaching} expert={expert} onBack={back} onReset={reset} />
                  ) : (
                    <QuestionCard key={current} node={node} step={path.length + 1} totalMin={path.length + remaining} totalMax={path.length + maxDepth(current)} onAnswer={answer} onBack={back} canBack={path.length > 0} teaching={teaching} expert={expert} />
                  )}
                </motion.div>
              </AnimatePresence>
            </section>

            <aside aria-label="Résultat provisoire" className={cn(col('result'), 'lg:sticky lg:top-[92px] lg:max-h-[calc(100vh-110px)] lg:overflow-y-auto lg:pr-1')}>
              <ResultColumn path={path} current={current} candidates={candidates} isLeaf={isLeaf} teaching={teaching} expert={expert} />
            </aside>
          </div>
          <footer className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border pt-5 text-center text-[13px] text-muted-foreground sm:flex-row sm:text-left">
            <p>Conçu par <b className="font-semibold text-foreground">Tijani Rasmi</b> · Université de Lille</p>
            <p>Arbre de décision d’après F. Guillemot, Nantes Université (2023), HAL hal-04292194</p>
          </footer>
        </main>

        <nav aria-label="Navigation mobile" className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/90 px-3 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">
          <div className="mx-auto grid max-w-md grid-cols-3 gap-1">
            {[['history', 'Parcours', History, path.length], ['question', isLeaf ? 'Fiche' : 'Question', MessagesSquare, 0], ['result', 'Résultat', ListChecks, candidates.length]].map(([id, label, I, n]) => (
              <button key={id} type="button" onClick={() => setTab(id)} aria-current={tab === id ? 'page' : undefined}
                className={cn('relative flex min-h-12 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl text-[11.5px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', tab === id ? 'bg-soft text-primary' : 'text-muted-foreground hover:bg-muted')}>
                <I className="size-5" aria-hidden="true" />
                {label}
                {n > 0 && <span className="absolute right-3 top-1 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">{n}</span>}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </TooltipProvider>
  )
}
