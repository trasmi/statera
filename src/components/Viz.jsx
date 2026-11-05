import { motion } from 'framer-motion'

const W = 380, H = 214, L = 44, R = 16, T = 16, B = 36
const P = 'var(--primary)', TL = 'var(--teal)', M = 'var(--muted-foreground)', G = 'var(--border)', F = 'var(--foreground)'
const px = (v, a, b) => L + ((v - a) / (b - a)) * (W - L - R)
const py = (v, a, b) => H - B - ((v - a) / (b - a)) * (H - B - T)
function rng(seed) { let a = seed; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }
const gauss = (r) => { let s = 0; for (let i = 0; i < 6; i++) s += r(); return (s - 3) / 0.7 }

const Axes = ({ xl, yl }) => (
  <g>
    <line x1={L} y1={T} x2={L} y2={H - B} stroke={G} strokeWidth="1.5" />
    <line x1={L} y1={H - B} x2={W - R} y2={H - B} stroke={G} strokeWidth="1.5" />
    {xl && <text x={(L + W - R) / 2} y={H - 8} textAnchor="middle" fontSize="10.5" fill={M}>{xl}</text>}
    {yl && <text x={-(H - B + T) / 2} y={13} transform="rotate(-90)" textAnchor="middle" fontSize="10.5" fill={M}>{yl}</text>}
  </g>
)
const Lbl = ({ x, y, children, anchor = 'middle', size = 10.5, fill = M, weight }) => (
  <text x={x} y={y} textAnchor={anchor} fontSize={size} fill={fill} fontWeight={weight}>{children}</text>
)
const grow = (i = 0) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.08 * i, duration: 0.45, ease: 'easeOut' } })
const draw = (d = 0) => ({ initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { delay: d, duration: 0.9, ease: 'easeInOut' } })

function Box({ cx, w = 54, min, q1, med, q3, max, color, a = 0, b = 100, i = 0 }) {
  return (
    <motion.g {...grow(i)}>
      <line x1={cx} x2={cx} y1={py(max, a, b)} y2={py(min, a, b)} stroke={color} strokeWidth="1.8" />
      <line x1={cx - w / 4} x2={cx + w / 4} y1={py(max, a, b)} y2={py(max, a, b)} stroke={color} strokeWidth="1.8" />
      <line x1={cx - w / 4} x2={cx + w / 4} y1={py(min, a, b)} y2={py(min, a, b)} stroke={color} strokeWidth="1.8" />
      <rect x={cx - w / 2} y={py(q3, a, b)} width={w} height={py(q1, a, b) - py(q3, a, b)} rx="6" fill={color} fillOpacity=".18" stroke={color} strokeWidth="1.8" />
      <line x1={cx - w / 2} x2={cx + w / 2} y1={py(med, a, b)} y2={py(med, a, b)} stroke={color} strokeWidth="3" />
    </motion.g>
  )
}

const kinds = {
  bars: () => {
    const obs = [52, 31, 37], exp = 40, mx = 70
    return (
      <>
        <Axes yl="Effectif" />
        {obs.map((v, i) => {
          const x = L + 30 + i * 100, h = H - B - py(v, 0, mx)
          return (
            <g key={i}>
              <motion.rect x={x} width="56" rx="7" fill={P} fillOpacity={i === 0 ? 1 : 0.75} initial={{ height: 0, y: H - B }} animate={{ height: h, y: py(v, 0, mx) }} transition={{ delay: 0.1 * i, duration: 0.6, ease: 'easeOut' }} />
              <Lbl x={x + 28} y={py(v, 0, mx) - 6} fill={F} weight="600">{v}</Lbl>
              <Lbl x={x + 28} y={H - B + 16}>Modalité {'ABC'[i]}</Lbl>
            </g>
          )
        })}
        <motion.line x1={L} x2={W - R} y1={py(exp, 0, mx)} y2={py(exp, 0, mx)} stroke={TL} strokeWidth="2.2" strokeDasharray="6 5" {...draw(0.4)} />
        <Lbl x={W - R} y={py(exp, 0, mx) - 6} anchor="end" fill="var(--teal-ink)" weight="600">attendu = 40</Lbl>
      </>
    )
  },
  grouped: () => {
    const g = [[38, 22, 14], [20, 30, 36]], mx = 50
    return (
      <>
        <Axes yl="Effectif" />
        {['Filière A', 'Filière B', 'Filière C'].map((n, c) => (
          <g key={c}>
            {g.map((row, r) => {
              const x = L + 22 + c * 104 + r * 36, v = row[c]
              return <motion.rect key={r} x={x} width="30" rx="6" fill={r ? TL : P} initial={{ height: 0, y: H - B }} animate={{ height: H - B - py(v, 0, mx), y: py(v, 0, mx) }} transition={{ delay: 0.07 * (c * 2 + r), duration: 0.55 }} />
            })}
            <Lbl x={L + 22 + c * 104 + 33} y={H - B + 16}>{n}</Lbl>
          </g>
        ))}
        <rect x={W - 108} y={T - 4} width="10" height="10" rx="3" fill={P} /><Lbl x={W - 94} y={T + 5} anchor="start">Femmes</Lbl>
        <rect x={W - 108} y={T + 12} width="10" height="10" rx="3" fill={TL} /><Lbl x={W - 94} y={T + 21} anchor="start">Hommes</Lbl>
      </>
    )
  },
  table2: () => {
    const cells = [[34, 6], [14, 26]]
    return (
      <g>
        <Lbl x={W / 2 + 28} y={22} fill={F} weight="600">Après</Lbl>
        <Lbl x={W / 2 - 14} y={46}>Oui</Lbl><Lbl x={W / 2 + 76} y={46}>Non</Lbl>
        <text x={44} y={H / 2 + 10} fontSize="10.5" fill={F} fontWeight="600" textAnchor="middle" transform={`rotate(-90 44 ${H / 2 + 10})`}>Avant</text>
        <Lbl x={92} y={86} anchor="end">Oui</Lbl><Lbl x={92} y={148} anchor="end">Non</Lbl>
        {cells.map((row, r) => row.map((v, c) => {
          const diag = r === c
          return (
            <motion.g key={`${r}${c}`} {...grow(r * 2 + c)}>
              <rect x={104 + c * 90} y={56 + r * 62} width="84" height="56" rx="10" fill={diag ? 'var(--muted)' : 'var(--teal-soft)'} stroke={diag ? G : TL} strokeWidth={diag ? 1 : 2} />
              <Lbl x={146 + c * 90} y={90 + r * 62} size={20} fill={diag ? M : 'var(--teal-ink)'} weight="700">{v}</Lbl>
              <Lbl x={146 + c * 90} y={50 + r * 62 + 60} size={9.5} fill={M}>{diag ? '' : r === 0 ? 'b' : 'c'}</Lbl>
            </motion.g>
          )
        }))}
        <Lbl x={W / 2 + 28} y={H - 6} fill="var(--teal-ink)" size={10.5}>Seuls les changements (b et c) comptent</Lbl>
      </g>
    )
  },
  box2: () => (
    <>
      <Axes yl="Score" />
      <Box cx={L + 90} min={28} q1={42} med={52} q3={62} max={78} color={P} i={0} />
      <Box cx={L + 220} min={40} q1={56} med={66} q3={76} max={92} color={TL} i={1} />
      <Lbl x={L + 90} y={H - B + 16}>Groupe A</Lbl><Lbl x={L + 220} y={H - B + 16}>Groupe B</Lbl>
    </>
  ),
  strip2: () => {
    const r = rng(7)
    const mk = (m, s, n) => Array.from({ length: n }, () => Math.max(6, Math.min(96, m + gauss(r) * s + (r() < 0.12 ? 22 : 0))))
    const A = mk(40, 12, 22), Bv = mk(60, 12, 22)
    const med = (arr) => [...arr].sort((a, b) => a - b)[Math.floor(arr.length / 2)]
    return (
      <>
        <Axes yl="Score (rangs)" />
        {[A, Bv].map((arr, g) => {
          const cx = L + 90 + g * 130
          return (
            <g key={g}>
              {arr.map((v, i) => <motion.circle key={i} cx={cx + (r() - 0.5) * 70} cy={py(v, 0, 100)} r="4.2" fill={g ? TL : P} fillOpacity=".8" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.015 * i, duration: 0.3 }} />)}
              <motion.line x1={cx - 42} x2={cx + 42} y1={py(med(arr), 0, 100)} y2={py(med(arr), 0, 100)} stroke={F} strokeWidth="3" strokeLinecap="round" {...draw(0.5)} />
              <Lbl x={cx} y={H - B + 16}>{g ? 'Groupe B' : 'Groupe A'}</Lbl>
            </g>
          )
        })}
        <Lbl x={W - R} y={T + 4} anchor="end" size={10}>— médiane</Lbl>
      </>
    )
  },
  paired: () => {
    const r = rng(11)
    const pts = Array.from({ length: 9 }, () => { const a = 30 + r() * 30; return [a, a + 8 + gauss(r) * 7] })
    const m0 = pts.reduce((s, p) => s + p[0], 0) / pts.length, m1 = pts.reduce((s, p) => s + p[1], 0) / pts.length
    const x0 = L + 70, x1 = L + 230
    return (
      <>
        <Axes yl="Score" />
        {pts.map((p, i) => <motion.line key={i} x1={x0} x2={x1} y1={py(p[0], 0, 100)} y2={py(p[1], 0, 100)} stroke={M} strokeOpacity=".5" strokeWidth="1.4" {...draw(0.04 * i)} />)}
        {pts.map((p, i) => <g key={i}><circle cx={x0} cy={py(p[0], 0, 100)} r="4" fill={P} /><circle cx={x1} cy={py(p[1], 0, 100)} r="4" fill={TL} /></g>)}
        <motion.line x1={x0} x2={x1} y1={py(m0, 0, 100)} y2={py(m1, 0, 100)} stroke={F} strokeWidth="3.4" strokeLinecap="round" {...draw(0.5)} />
        <Lbl x={x0} y={H - B + 16}>Avant</Lbl><Lbl x={x1} y={H - B + 16}>Après</Lbl>
      </>
    )
  },
  diffs: () => {
    const bins = [1, 2, 4, 6, 9, 13, 12, 8, 4, 2], z = 4.5
    const bw = (W - L - R - 20) / bins.length, mx = 14
    return (
      <>
        <Axes xl="Différence (après − avant)" yl="Effectif" />
        {bins.map((v, i) => (
          <motion.rect key={i} x={L + 10 + i * bw + 2} width={bw - 4} rx="4" fill={i + 0.5 >= z ? TL : P} fillOpacity=".85" initial={{ height: 0, y: H - B }} animate={{ height: H - B - py(v, 0, mx), y: py(v, 0, mx) }} transition={{ delay: 0.05 * i, duration: 0.5 }} />
        ))}
        <motion.line x1={L + 10 + z * bw} x2={L + 10 + z * bw} y1={T} y2={H - B} stroke={F} strokeWidth="2" strokeDasharray="5 4" {...draw(0.4)} />
        <Lbl x={L + 10 + z * bw - 6} y={T + 8} anchor="end" size={10}>0 : pas de changement</Lbl>
      </>
    )
  },
  box3: () => (
    <>
      <Axes yl="Score" />
      <Box cx={L + 62} w={46} min={26} q1={36} med={46} q3={56} max={68} color={P} i={0} />
      <Box cx={L + 150} w={46} min={42} q1={52} med={62} q3={72} max={84} color={TL} i={1} />
      <Box cx={L + 238} w={46} min={30} q1={40} med={50} q3={58} max={72} color="var(--amber-ink)" i={2} />
      {['A', 'B', 'C'].map((n, i) => <Lbl key={n} x={L + 62 + i * 88} y={H - B + 16}>Groupe {n}</Lbl>)}
      {['a', 'b', 'a'].map((n, i) => <Lbl key={i} x={L + 62 + i * 88} y={T + 4} fill={F} weight="700">{n}</Lbl>)}
    </>
  ),
  lines: ({ variant }) => {
    const r = rng(5), ranks = variant === 'ranks'
    const means = ranks ? [1.4, 2.0, 2.6] : [48, 58, 70]
    const a = ranks ? 1 : 0, b = ranks ? 3 : 100
    const xs = [L + 56, L + 148, L + 240]
    const ind = Array.from({ length: 8 }, () => { const o = (r() - 0.5) * (ranks ? 1.1 : 28); return means.map((m, i) => Math.max(a + 0.05, Math.min(b - 0.05, m + o + gauss(r) * (ranks ? 0.2 : 4)))) })
    const d = means.map((m, i) => `${i ? 'L' : 'M'}${xs[i]},${py(m, a, b)}`).join(' ')
    return (
      <>
        <Axes yl={ranks ? 'Rang moyen' : 'Score moyen'} />
        {ind.map((row, k) => <motion.path key={k} d={row.map((v, i) => `${i ? 'L' : 'M'}${xs[i]},${py(v, a, b)}`).join(' ')} fill="none" stroke={M} strokeOpacity=".28" strokeWidth="1.3" {...draw(0.03 * k)} />)}
        {means.map((m, i) => <motion.line key={i} x1={xs[i]} x2={xs[i]} y1={py(m + (ranks ? 0.28 : 6), a, b)} y2={py(m - (ranks ? 0.28 : 6), a, b)} stroke={P} strokeWidth="2.4" {...draw(0.5)} />)}
        <motion.path d={d} fill="none" stroke={P} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" {...draw(0.3)} />
        {means.map((m, i) => <motion.circle key={i} cx={xs[i]} cy={py(m, a, b)} r="6" fill="var(--card)" stroke={P} strokeWidth="3" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.12 }} />)}
        {['T1', 'T2', 'T3'].map((n, i) => <Lbl key={n} x={xs[i]} y={H - B + 16}>{n}</Lbl>)}
      </>
    )
  },
  interaction: () => {
    const xs = [L + 70, L + 220]
    const A = [42, 78], Bv = [66, 52]
    const line = (v, c, d) => <><motion.path d={`M${xs[0]},${py(v[0], 0, 100)} L${xs[1]},${py(v[1], 0, 100)}`} stroke={c} strokeWidth="3.6" strokeLinecap="round" fill="none" {...draw(d)} />{v.map((y, i) => <circle key={i} cx={xs[i]} cy={py(y, 0, 100)} r="6" fill="var(--card)" stroke={c} strokeWidth="3" />)}</>
    return (
      <>
        <Axes yl="Score moyen" />
        {line(A, P, 0)}{line(Bv, TL, 0.25)}
        <Lbl x={xs[0]} y={H - B + 16}>Méthode 1</Lbl><Lbl x={xs[1]} y={H - B + 16}>Méthode 2</Lbl>
        <circle cx={W - 112} cy={T + 2} r="5" fill={P} /><Lbl x={W - 102} y={T + 6} anchor="start">Collège</Lbl>
        <circle cx={W - 112} cy={T + 20} r="5" fill={TL} /><Lbl x={W - 102} y={T + 24} anchor="start">Lycée</Lbl>
      </>
    )
  },
  scatter: () => {
    const r = rng(3), pts = Array.from({ length: 34 }, () => { const x = r() * 100; return [x, 14 + x * 0.72 + gauss(r) * 9] })
    return (
      <>
        <Axes xl="Variable X" yl="Variable Y" />
        {pts.map((p, i) => <motion.circle key={i} cx={px(p[0], 0, 100)} cy={py(p[1], 0, 100)} r="4.4" fill={P} fillOpacity=".78" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.018 * i }} />)}
        <Lbl x={W - R} y={T + 6} anchor="end" fill="var(--teal-ink)" size={13} weight="700">r ≈ +.82</Lbl>
      </>
    )
  },
  scatterRank: () => {
    const r = rng(9), pts = Array.from({ length: 30 }, () => { const x = 4 + r() * 96; return [x, 100 * Math.pow(x / 100, 0.38) * 0.9 + gauss(r) * 4] })
    const d = Array.from({ length: 40 }, (_, i) => { const x = 4 + (i / 39) * 96; return `${i ? 'L' : 'M'}${px(x, 0, 100)},${py(Math.min(98, 100 * Math.pow(x / 100, 0.38) * 0.9), 0, 100)}` }).join(' ')
    return (
      <>
        <Axes xl="Variable X" yl="Variable Y" />
        {pts.map((p, i) => <motion.circle key={i} cx={px(p[0], 0, 100)} cy={py(Math.max(2, Math.min(98, p[1])), 0, 100)} r="4.4" fill={P} fillOpacity=".78" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.018 * i }} />)}
        <motion.path d={d} fill="none" stroke={TL} strokeWidth="3" strokeLinecap="round" strokeDasharray="1 0" {...draw(0.4)} />
        <Lbl x={W - R} y={T + 6} anchor="end" fill="var(--teal-ink)" size={13} weight="700">ρs ≈ +.91</Lbl>
      </>
    )
  },
  scatterLine: () => {
    const r = rng(21), pts = Array.from({ length: 28 }, () => { const x = 6 + r() * 88; return [x, 18 + x * 0.6 + gauss(r) * 8] })
    return (
      <>
        <Axes xl="Prédicteur X" yl="VD Y" />
        <motion.path d={`M${px(0, 0, 100)},${py(14, 0, 100)} L${px(100, 0, 100)},${py(86, 0, 100)} L${px(100, 0, 100)},${py(98, 0, 100)} L${px(0, 0, 100)},${py(22, 0, 100)} Z`} fill={TL} fillOpacity=".16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} />
        {pts.map((p, i) => <g key={i}><line x1={px(p[0], 0, 100)} x2={px(p[0], 0, 100)} y1={py(p[1], 0, 100)} y2={py(18 + p[0] * 0.6, 0, 100)} stroke={M} strokeOpacity=".35" strokeDasharray="2 3" /><motion.circle cx={px(p[0], 0, 100)} cy={py(p[1], 0, 100)} r="4.2" fill={P} fillOpacity=".8" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.015 * i }} /></g>)}
        <motion.line x1={px(0, 0, 100)} y1={py(18, 0, 100)} x2={px(100, 0, 100)} y2={py(78, 0, 100)} stroke={TL} strokeWidth="3.4" strokeLinecap="round" {...draw(0.35)} />
        <Lbl x={L + 10} y={T + 8} anchor="start" fill="var(--teal-ink)" weight="700" size={12}>Y = a + b·X</Lbl>
      </>
    )
  },
  coef: () => {
    const rows = [['Heures de révision', 0.9, 0.35], ['Niveau initial', 0.55, 0.28], ['Sommeil', 0.25, 0.3], ['Trajet', -0.35, 0.22]]
    const a = -1.2, b = 1.5, x = (v) => L + 70 + ((v - a) / (b - a)) * (W - L - R - 80)
    return (
      <g>
        <line x1={x(0)} x2={x(0)} y1={T} y2={H - B + 4} stroke={F} strokeWidth="1.6" strokeDasharray="4 4" />
        {rows.map(([n, v, e], i) => {
          const y = T + 22 + i * 40, sig = Math.abs(v) > e
          return (
            <motion.g key={n} {...grow(i)}>
              <Lbl x={L + 62} y={y + 4} anchor="end" size={10.5} fill={F}>{n}</Lbl>
              <line x1={x(v - e)} x2={x(v + e)} y1={y} y2={y} stroke={sig ? P : M} strokeWidth="3.4" strokeLinecap="round" />
              <circle cx={x(v)} cy={y} r="6" fill={sig ? P : 'var(--card)'} stroke={sig ? P : M} strokeWidth="2.4" />
            </motion.g>
          )
        })}
        <Lbl x={x(0)} y={H - 10} size={10}>effet nul (β = 0)</Lbl>
      </g>
    )
  },
  sigmoid: () => {
    const r = rng(2)
    const f = (x) => 1 / (1 + Math.exp(-(x - 50) / 9))
    const d = Array.from({ length: 50 }, (_, i) => { const x = (i / 49) * 100; return `${i ? 'L' : 'M'}${px(x, 0, 100)},${py(f(x) * 100, 0, 100)}` }).join(' ')
    const pts = Array.from({ length: 30 }, () => { const x = r() * 100; return [x, r() < f(x) ? 100 : 0] })
    return (
      <>
        <Axes xl="Prédicteur (heures de révision)" yl="Probabilité de réussite" />
        {pts.map((p, i) => <motion.circle key={i} cx={px(p[0], 0, 100)} cy={py(p[1] ? 97 : 3, 0, 100)} r="3.8" fill={p[1] ? TL : P} fillOpacity=".7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.015 * i }} />)}
        <motion.path d={d} fill="none" stroke={F} strokeWidth="3.4" strokeLinecap="round" {...draw(0.3)} />
        <line x1={L} x2={W - R} y1={py(50, 0, 100)} y2={py(50, 0, 100)} stroke={M} strokeDasharray="3 4" strokeOpacity=".6" />
        <Lbl x={L - 4} y={py(50, 0, 100) + 3} anchor="end" size={9.5}>.5</Lbl>
      </>
    )
  },
}

export function Viz({ kind, variant, caption }) {
  const Draw = kinds[kind] || kinds.bars
  return (
    <figure className="m-0">
      <div className="rounded-xl border border-border bg-muted/50 p-3">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={caption} className="h-auto w-full">
          <Draw variant={variant} />
        </svg>
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted-foreground">{caption}</figcaption>
    </figure>
  )
}
