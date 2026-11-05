// Génère l'arbre de décision de la page d'accueil à partir de src/data/tree.js,
// pour que le schéma public reste toujours fidèle à l'outil.
// Usage : node scripts/tree-svg.mjs   (réécrit le bloc entre les marqueurs dans public/index.html)
import { readFileSync, writeFileSync } from 'node:fs'
import { TREE } from '../src/data/tree.js'
import { SHORT } from '../src/data/tests.js'

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

// Parcours en profondeur : chaque feuille prend une ligne, chaque question se centre sur ses enfants.
function layout() {
  let row = 0
  const nodes = []
  const paths = []
  const walk = (id, depth, trail, via) => {
    const n = TREE.nodes[id]
    const me = { id, depth, via, leaf: n.type === 'leaf', label: n.type === 'leaf' ? SHORT[n.test] : n.criterion, kids: [] }
    nodes.push(me)
    if (me.leaf) {
      me.row = row++
      paths.push([...trail, me])
    } else {
      me.kids = n.options.map((o) => walk(o.next, depth + 1, [...trail, me], o.short))
      me.row = (me.kids[0].row + me.kids[me.kids.length - 1].row) / 2
    }
    return me
  }
  walk(TREE.root, 0, [], null)
  return { nodes, paths, rows: row, depth: Math.max(...nodes.map((n) => n.depth)) }
}

function svg({ w, h, rowH, top, leafW, cls, title, labels }) {
  const { nodes, paths, depth } = layout()
  const X = (d) => 8 + (d / depth) * (w - leafW - 24)
  // les feuilles sont alignées sur une même colonne, à droite
  const px = (n) => (n.leaf ? w - leafW - 8 : X(n.depth))
  const py = (n) => top + n.row * rowH
  const link = (a, b) => {
    const x1 = px(a), y1 = py(a), x2 = px(b), y2 = py(b), m = x1 + (x2 - x1) * 0.5
    return `M${x1} ${y1}C${m} ${y1} ${m} ${y2} ${x2} ${y2}`
  }
  const edge = paths.map((p, i) => {
    const d = p.slice(1).map((n, j) => {
      const seg = link(p[j], n)
      return j === 0 ? seg : seg.replace(/^M[^C]+/, '')
    }).join('')
    const leaf = p[p.length - 1]
    const route = p.slice(1).map((n) => n.via).join(', ')
    return `<g class="tree__p${i === 4 ? ' tree__p--on' : ''}" tabindex="0" aria-label="${esc(route)} : ${esc(leaf.label)}"><title>${esc(route)}</title><path d="${d}"/><circle cx="${px(leaf)}" cy="${py(leaf)}" r="3.5"/><text x="${px(leaf) + 10}" y="${py(leaf) + 4.5}">${esc(leaf.label)}</text></g>`
  }).join('')
  const dots = nodes.filter((n) => !n.leaf).map((n) => {
    const t = labels && n.depth <= 2 ? `<text class="tree__q" x="${px(n) - 4}" y="${py(n) - 13}">${esc(n.label.replace('Nature de la variable dépendante', 'Variable dépendante').replace('Relation entre les variables', 'Relation'))}</text>` : ''
    return `<circle class="tree__n" cx="${px(n)}" cy="${py(n)}" r="${n.depth ? 4 : 6}"/>${t}`
  }).join('')
  return `<svg class="tree ${cls}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}">${edge}${dots}</svg>`
}

const title = 'Arbre de décision de Statera : 18 chemins qui partent de la variable dépendante et mènent aux 17 tests'
const out = [
  svg({ w: 1280, h: 540, rowH: 29.5, top: 26, leafW: 196, cls: 'tree--wide', title, labels: true }),
  svg({ w: 672, h: 540, rowH: 29.5, top: 20, leafW: 190, cls: 'tree--mid', title, labels: false }),
  svg({ w: 342, h: 450, rowH: 24.5, top: 14, leafW: 168, cls: 'tree--small', title, labels: false }),
].join('\n')

const file = new URL('../public/index.html', import.meta.url)
const page = readFileSync(file, 'utf8')
const next = page.replace(/<!-- tree:start -->[\s\S]*<!-- tree:end -->/, `<!-- tree:start -->\n${out}\n<!-- tree:end -->`)
writeFileSync(file, next)
console.log('arbre écrit :', (out.length / 1024).toFixed(1), 'Kio')
