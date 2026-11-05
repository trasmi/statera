import {
  Target, Tags, Ruler, Layers, CircleDot, Columns2, Network, GitCompare, Repeat, CircleHelp, Scale,
  TrendingUp, Users, Split, Boxes, Link2, Unlink, Gauge, CircleCheck, TriangleAlert, LayoutGrid,
  ArrowRightLeft, Activity, ListOrdered, Crosshair, ChartLine, FlaskConical,
} from 'lucide-react'
export const ICONS = {
  Target, Tags, Ruler, Layers, CircleDot, Columns2, Network, GitCompare, Repeat, HelpCircle: CircleHelp, Scale,
  TrendingUp, Users, Split, Boxes, Link2, Unlink, Gauge, CheckCircle2: CircleCheck, AlertTriangle: TriangleAlert,
  LayoutGrid, ArrowRightLeft, Activity, ListOrdered, Crosshair, LineChart: ChartLine, FlaskConical,
}
export const Icon = ({ name, ...p }) => { const C = ICONS[name] || CircleDot; return <C aria-hidden="true" {...p} /> }
