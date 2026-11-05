import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs) { return twMerge(clsx(inputs)) }
export async function copyText(t) {
  try { await navigator.clipboard.writeText(t); return true } catch (e) {
    try {
      const ta = document.createElement('textarea'); ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0'
      document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); ta.remove(); return ok
    } catch (e2) { return false }
  }
}
export function lsGet(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v) } catch (e) { return d } }
export function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) { /* ignore */ } }
