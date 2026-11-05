import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Monte l'application dans #statera-root ; se remonte si le conteneur est recréé.
function mount() {
  const el = document.getElementById('statera-root')
  if (!el || el.dataset.mounted) return
  el.dataset.mounted = '1'
  createRoot(el).render(<StrictMode><App /></StrictMode>)
}
let scheduled = false
function schedule() {
  if (scheduled) return
  scheduled = true
  requestAnimationFrame(() => { scheduled = false; mount() })
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule)
else schedule()
new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true })
