import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, BarChart3, BookOpen, Brain, Check, ChevronRight, ClipboardCheck, Code2, Copy, FileText, HeartPulse,
  Lightbulb, Microscope, RotateCcw, ShieldCheck, Sparkles, ThumbsDown, ThumbsUp, GraduationCap, Ban,
} from 'lucide-react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { CodeBlock } from './CodeBlock'
import { Viz } from './Viz'
import { LEVELS, TESTS } from '../data/tests'
import { TREE } from '../data/tree'
import { cn, copyText } from '../lib/utils'

const stagger = (i) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.06 * i, duration: 0.4 } })

function Section({ icon: I, title, children, className }) {
  return (
    <section className={className}>
      <h3 className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-muted-foreground"><I className="size-4 text-primary" /> {title}</h3>
      {children}
    </section>
  )
}
const Bullets = ({ items, tone = 'neutral' }) => (
  <ul className="space-y-2">
    {items.map((t, i) => (
      <li key={i} className="flex gap-2.5 text-[14.5px] leading-relaxed">
        <span className={cn('mt-[7px] size-1.5 shrink-0 rounded-full', tone === 'good' ? 'bg-teal' : tone === 'bad' ? 'bg-amber-ink' : 'bg-primary')} aria-hidden="true" />
        <span>{t}</span>
      </li>
    ))}
  </ul>
)

export function Fiche({ testId, variant, path, teaching, expert, onBack, onReset }) {
  const t = TESTS[testId]
  const lvl = LEVELS[t.level]
  const [copied, setCopied] = useState(false)
  const equiv = t.expert.equiv ? TESTS[t.expert.equiv] : null

  const summary = () =>
    `${t.name}\n\nObjectif : ${t.objectif}\nQuand l’utiliser : ${t.quand}\n\nConditions :\n${t.conditions.map((c) => '- ' + c).join('\n')}\n\nH0 : ${t.hypotheses.h0}\nH1 : ${t.hypotheses.h1}\n\nInterprétation : ${t.interpretation}\n\nCode R :\n${t.code.r}\n\nCode Python :\n${t.code.py}\n\nCode SPSS :\n${t.code.spss}\n\nJamovi :\n${t.code.jamovi}`
  const onCopy = async () => { if (await copyText(summary())) { setCopied(true); setTimeout(() => setCopied(false), 1800) } }

  const steps = path.map((p) => {
    const q = TREE.nodes[p.nodeId]
    return { q, o: q.options.find((o) => o.id === p.optionId) }
  })

  return (
    <Card className="overflow-hidden">
      <div className="relative overflow-hidden bg-[#06525C] px-5 pb-6 dark:bg-[#0F4149] pt-6 text-white sm:px-8 sm:pt-8">
        <motion.div {...stagger(0)} className="relative">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal px-2.5 py-1 text-xs font-semibold text-[#04201C]"><Sparkles className="size-3.5" /> Test recommandé</span>
            <span className="rounded-full bg-white/12 px-2.5 py-1 text-xs font-medium text-white/90">{t.family === 'param' ? 'Paramétrique' : 'Non paramétrique'}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-2.5 py-1 text-xs font-medium text-white/90">
              Niveau : {lvl.label}
              <span className="flex gap-0.5" aria-hidden="true">{[1, 2, 3].map((d) => <span key={d} className={cn('size-1.5 rounded-full', d <= lvl.dots ? 'bg-teal' : 'bg-white/25')} />)}</span>
            </span>
          </div>
          <h2 className="text-balance text-[28px] font-medium leading-tight tracking-[-0.025em] sm:text-[38px]">{t.name}</h2>
          <p className="mt-1 text-[14px] text-white/70">{t.alias} · {t.group}</p>
          {variant && <p className="mt-3 inline-block rounded-lg bg-white/10 px-3 py-1.5 text-[13px] text-white/90">{variant}</p>}
          <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-white/90">{t.objectif}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="teal" onClick={onCopy}>{copied ? <Check /> : <Copy />} {copied ? 'Fiche copiée' : 'Copier la fiche'}</Button>
            <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10"><ArrowLeft /> Modifier ma dernière réponse</Button>
            <Button variant="ghost" onClick={onReset} className="text-white hover:bg-white/10"><RotateCcw /> Nouvelle recherche</Button>
          </div>
        </motion.div>
      </div>

      <div className="px-4 py-5 sm:px-7 sm:py-6">
        <Tabs defaultValue="essentiel">
          <div className="-mx-1 overflow-x-auto px-1 pb-1">
            <TabsList className="w-max">
              <TabsTrigger value="essentiel"><FileText /> Essentiel</TabsTrigger>
              <TabsTrigger value="conditions"><ShieldCheck /> Conditions</TabsTrigger>
              <TabsTrigger value="exemples"><Lightbulb /> Exemples</TabsTrigger>
              <TabsTrigger value="code"><Code2 /> Code</TabsTrigger>
              <TabsTrigger value="visuel"><BarChart3 /> Visuel</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="essentiel" className="space-y-6">
            <motion.div {...stagger(0)}><Section icon={ClipboardCheck} title="Quand l’utiliser"><p className="text-[15px] leading-relaxed">{t.quand}</p></Section></motion.div>

            <motion.div {...stagger(1)}>
              <Section icon={ChevronRight} title="Pourquoi ce test ?">
                <ol className="flex flex-wrap items-center gap-x-1 gap-y-2">
                  {steps.map(({ q, o }, i) => (
                    <li key={i} className="flex items-center gap-1">
                      <span className="rounded-lg border border-border bg-muted px-2.5 py-1 text-[12.5px]"><span className="text-muted-foreground">{q.criterion} : </span><b className="font-semibold">{o.short}</b></span>
                      <ChevronRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
                    </li>
                  ))}
                  <li><span className="rounded-lg bg-teal px-2.5 py-1 text-[12.5px] font-semibold text-[#04201C]">{t.name}</span></li>
                </ol>
                {teaching && (
                  <div className="mt-3 space-y-2 rounded-xl border border-primary/25 bg-soft p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary"><GraduationCap className="size-4" /> Branches écartées en chemin</div>
                    {steps.map(({ q, o }, i) => (
                      <p key={i} className="flex gap-2 text-[13.5px] leading-relaxed"><Ban className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" /><span><b className="font-semibold">{o.short} :</b> {o.excludes}</span></p>
                    ))}
                  </div>
                )}
              </Section>
            </motion.div>

            <div className="grid gap-5 md:grid-cols-2">
              <motion.div {...stagger(2)} className="rounded-xl border border-border bg-muted/40 p-4"><Section icon={ThumbsUp} title="Avantages"><Bullets items={t.avantages} tone="good" /></Section></motion.div>
              <motion.div {...stagger(3)} className="rounded-xl border border-border bg-muted/40 p-4"><Section icon={ThumbsDown} title="Limites"><Bullets items={t.limites} tone="bad" /></Section></motion.div>
            </div>

            <motion.div {...stagger(4)}>
              <Section icon={BookOpen} title="Interprétation">
                <div className="rounded-xl border border-teal/50 bg-teal-soft p-4 text-[14.5px] leading-relaxed">{t.interpretation}</div>
              </Section>
            </motion.div>
          </TabsContent>

          <TabsContent value="conditions" className="space-y-6">
            <Section icon={ShieldCheck} title="Conditions d’application"><Bullets items={t.conditions} /></Section>
            <Section icon={FileText} title="Hypothèses statistiques">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-muted/40 p-4"><div className="mb-1 font-mono text-[12px] font-semibold text-primary">H0 · hypothèse nulle</div><p className="text-[14.5px] leading-relaxed">{t.hypotheses.h0}</p></div>
                <div className="rounded-xl border border-border bg-muted/40 p-4"><div className="mb-1 font-mono text-[12px] font-semibold text-teal-ink">H1 · hypothèse alternative</div><p className="text-[14.5px] leading-relaxed">{t.hypotheses.h1}</p></div>
              </div>
              {t.hypotheses.notes.length > 0 && <div className="mt-3"><Bullets items={t.hypotheses.notes} /></div>}
            </Section>

            {expert ? (
              <motion.div {...stagger(0)} className="space-y-5 rounded-2xl border border-primary/30 bg-soft/60 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary"><Microscope className="size-4" /> Mode expert</div>
                <Section icon={ShieldCheck} title={t.family === 'param' ? 'Hypothèses paramétriques' : 'Hypothèses du modèle'}><Bullets items={t.expert.params} /></Section>
                <div className="grid gap-4 md:grid-cols-2">
                  <Section icon={ChevronRight} title={t.family === 'param' ? 'Équivalent non paramétrique' : 'Équivalent paramétrique'}>
                    <p className="text-[14.5px] leading-relaxed">{equiv ? <b>{equiv.name}</b> : 'Pas d’équivalent direct dans cet arbre.'}</p>
                  </Section>
                  <Section icon={Sparkles} title="Taille d’effet"><p className="text-[14.5px] leading-relaxed">{t.expert.effet}</p></Section>
                </div>
                <Section icon={ChevronRight} title="Alternatives possibles"><Bullets items={t.expert.alternatives} /></Section>
                <Section icon={ChevronRight} title="Tests post-hoc / compléments"><p className="text-[14.5px] leading-relaxed">{t.expert.posthoc}</p></Section>
              </motion.div>
            ) : (
              <p className="rounded-xl border border-dashed border-border p-4 text-[13.5px] text-muted-foreground">Activez le <b className="text-foreground">mode expert</b> pour voir les hypothèses paramétriques, l’équivalent non paramétrique, les alternatives et la taille d’effet.</p>
            )}
          </TabsContent>

          <TabsContent value="exemples" className="space-y-4">
            <motion.div {...stagger(0)} className="rounded-2xl bg-[#06525C] p-5 text-white dark:bg-[#0F4149]">
              <div className="mb-1.5 flex items-center gap-2 text-[12px] font-semibold text-white/80"><Lightbulb className="size-4" /> Exemple concret</div>
              <p className="text-[15.5px] leading-relaxed">{t.exemple}</p>
            </motion.div>
            <div className="grid gap-4 md:grid-cols-3">
              {[['Psychologie', Brain, t.exemples.psy], ['Sciences de l’éducation', BookOpen, t.exemples.edu], ['Santé', HeartPulse, t.exemples.sante]].map(([label, I, txt], i) => (
                <motion.div key={label} {...stagger(i + 1)} className="rounded-2xl border border-border bg-muted/40 p-4">
                  <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold"><span className="grid size-8 place-items-center rounded-lg bg-soft text-primary"><I className="size-4" /></span>{label}</div>
                  <p className="text-[14px] leading-relaxed text-muted-foreground">{txt}</p>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="code">
            <Tabs defaultValue="r">
              <TabsList>
                <TabsTrigger value="r">R</TabsTrigger>
                <TabsTrigger value="py">Python</TabsTrigger>
                <TabsTrigger value="spss">SPSS</TabsTrigger>
                <TabsTrigger value="jamovi">Jamovi</TabsTrigger>
              </TabsList>
              <TabsContent value="r"><CodeBlock code={t.code.r} lang="R" /></TabsContent>
              <TabsContent value="py"><CodeBlock code={t.code.py} lang="Python · SciPy / Statsmodels / Pingouin" /></TabsContent>
              <TabsContent value="spss"><CodeBlock code={t.code.spss} lang="SPSS · syntaxe" /></TabsContent>
              <TabsContent value="jamovi"><CodeBlock code={t.code.jamovi} lang="Jamovi · menus (version française)" /></TabsContent>
            </Tabs>
            <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">Adaptez les noms de variables (<code className="rounded bg-muted px-1 font-mono">df</code>, <code className="rounded bg-muted px-1 font-mono">score</code>, <code className="rounded bg-muted px-1 font-mono">groupe</code>…) à votre jeu de données.</p>
          </TabsContent>

          <TabsContent value="visuel">
            <Viz kind={t.viz.kind} variant={t.viz.variant} caption={t.viz.caption} key={t.id} />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  )
}
