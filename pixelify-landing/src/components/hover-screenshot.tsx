import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export function HoverScrenshot({children}) {
  return (
    <HoverCard>
      <HoverCardTrigger
        className="text-base text-foreground-accent underline decoration-dashed text-purple-foreground decoration-primary"
        href="#"
        onClick={e => e.preventDefault()}
      >
        Hover to see
      </HoverCardTrigger>
      <HoverCardContent>
        {children}
      </HoverCardContent>
    </HoverCard>
  )
}
