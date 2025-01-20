import { X } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface BlocklistItemProps {
  value: string
  onRemove: (value: string) => void
}

export function BlocklistItem({ value, onRemove }: BlocklistItemProps) {
  return (
    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
      <span className="flex-1 text-sm truncate">{value}</span>

<AlertDialog>
  <AlertDialogTrigger>
    <X className="h-4 w-4" />
    <span className="sr-only">Remove {value}</span>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
        This will remove
        <strong className="font-bold text-primary"> {value} </strong>
        from your blocklist.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        onClick={() => onRemove(value)}
      >Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
    </div>
  )
}

