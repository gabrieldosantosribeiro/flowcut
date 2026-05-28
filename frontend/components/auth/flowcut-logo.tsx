import { Scissors } from "lucide-react"

export function FlowCutLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <Scissors className="h-5 w-5 text-primary" />
      </div>
      <span className="text-xl font-bold text-foreground">FlowCut</span>
    </div>
  )
}
