import { Settings } from 'lucide-react'

export default function SettingsComponent() {
  return (
    <div className="bg-background min-h-screen w-full h-full p-4 flex flex-col items-center pt-8">
      {/* Header */}
      <div className="px-6 mb-8 flex items-center gap-2">
        <Settings />
        Settings
      </div>

    </div>
  )
}
