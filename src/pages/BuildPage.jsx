import { BuildWizard } from '@/components/build/BuildWizard'

export default function BuildPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="border-b border-border px-4 py-4 md:px-8">
        <h2 className="text-base font-medium">建立你的名片</h2>
      </div>
      <BuildWizard />
    </div>
  )
}
