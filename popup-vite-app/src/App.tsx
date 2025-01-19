import './App.css'

import { Button } from "@/components/ui/button"
import Main from '@/pages/Main'


export default function App() {
  return (
    <div className="min-h-screen bg-background p-4 flex flex-col items-center pt-8">
      <Main/>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <Button variant="ghost" size="sm">
            Details
          </Button>
          <Button variant="ghost" size="sm">
            Remove
          </Button>
        </div>
      </div>
    </div>
  )
}

