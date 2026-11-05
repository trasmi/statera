import { FlaskConical, GraduationCap, Microscope, Moon, RotateCcw, Sun } from 'lucide-react'
import { Switch } from './ui/switch'
import { Button } from './ui/button'
import { Progress } from './ui/progress'

function ModeSwitch({ id, icon: I, label, short, checked, onChange }) {
  return (
    <label htmlFor={id} className="flex h-11 cursor-pointer select-none items-center justify-between gap-2 lg:justify-start rounded-xl border border-border bg-card px-3 text-sm font-medium transition-colors hover:bg-muted">
      <I className="size-4 shrink-0 text-primary" aria-hidden="true" />
      <span className="hidden lg:inline">{label}</span>
      <span className="lg:hidden">{short}</span>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </label>
  )
}

export function Header({ teaching, setTeaching, expert, setExpert, theme, toggleTheme, onReset, progress }) {
  return (
    <header className="relative z-40 border-b border-border bg-background/85 backdrop-blur-xl lg:sticky lg:top-0">
      <div className="mx-auto flex max-w-[1560px] flex-wrap items-center gap-x-3 gap-y-2.5 px-4 py-3 lg:px-6">
        <div className="order-1 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-[#2E2390] text-white shadow-md dark:from-[#8B7CFF] dark:to-[#4B3CC8]">
            <FlaskConical className="size-5" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <div className="text-[17px] font-bold tracking-tight">Statera</div>
            <div className="hidden text-[12.5px] text-muted-foreground sm:block">Choisissez le bon test statistique, pas à pas · Tijani Rasmi, Université de Lille</div>
          </div>
        </div>
        <div className="order-2 ml-auto flex items-center gap-2 lg:order-3 lg:ml-0">
          <Button variant="outline" size="icon" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}>
            {theme === 'dark' ? <Sun /> : <Moon />}
          </Button>
          <Button variant="outline" size="icon" onClick={onReset} aria-label="Recommencer" className="lg:w-auto lg:px-4"><RotateCcw /> <span className="hidden lg:inline">Recommencer</span></Button>
        </div>
        <div className="order-3 grid w-full grid-cols-2 gap-2 lg:order-2 lg:ml-auto lg:flex lg:w-auto">
          <ModeSwitch id="mode-teach" icon={GraduationCap} label="Mode Enseignement" short="Enseignement" checked={teaching} onChange={setTeaching} />
          <ModeSwitch id="mode-expert" icon={Microscope} label="Mode Expert" short="Expert" checked={expert} onChange={setExpert} />
        </div>
      </div>
      <Progress value={progress} aria-label="Progression de l’entretien" className="h-[3px] rounded-none" />
    </header>
  )
}
