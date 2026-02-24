import AppLink from '@/components/AppLink'
import { ChevronLeft } from '@/components/Icons'
import type { BackBtnProps } from '@/types'

export default function BackBtn ({ href }: BackBtnProps) {
  return (
    <AppLink
      href={href}
      className="absolute left-4 top-8 shadow p-2 hover:bg-cta hover:text-white transition-all rounded-sm"
    >
      <ChevronLeft className="h-6 w-6" />
    </AppLink>
  )
}
