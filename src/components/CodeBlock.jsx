import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from './ui/button'
import { copyText } from '../lib/utils'

export function CodeBlock({ code, lang }) {
  const [ok, setOk] = useState(false)
  const onCopy = async () => {
    const r = await copyText(code)
    if (r) { setOk(true); setTimeout(() => setOk(false), 1600) }
  }
  const lines = code.split('\n')
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-[#06323A]">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5">
        <span className="font-mono text-[12px] text-[#A9C4C5]">{lang}</span>
        <Button variant="ghost" size="sm" onClick={onCopy} className="h-8 text-[#D6E6E4] hover:bg-white/10 hover:text-white" aria-label={`Copier le code ${lang}`}>
          {ok ? <Check className="text-[#5EEAD4]" /> : <Copy />}
          {ok ? 'Copié' : 'Copier'}
        </Button>
      </div>
      <pre className="m-0 max-h-[420px] overflow-auto p-4 font-mono text-[12.5px] leading-6 text-[#EAF2F0]">
        <code>
          {lines.map((l, i) => {
            const t = l.trimStart()
            const isComment = t.startsWith('#') || t.startsWith('*') || t.startsWith('//')
            return <div key={i} className={isComment ? 'text-[#7FE3D4]' : undefined}>{l || ' '}</div>
          })}
        </code>
      </pre>
    </div>
  )
}
