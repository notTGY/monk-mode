import { Chrome } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CtaButton() {
  return (
    <a
      href="https://chrome.google.com/webstore/detail/pixelify/kahgplgodldegnapinchdllbpobjmced"
      target="_blank"
    >
      <Button size="lg" className="text-lg py-6">
        <Chrome className="h-8 w-8" />
        Add to Chrome
      </Button>
    </a>
  )
}
