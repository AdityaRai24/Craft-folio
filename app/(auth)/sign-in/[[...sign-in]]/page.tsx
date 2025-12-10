import { SignIn } from '@clerk/nextjs'
import { clerkAppearance } from '../../clerk-theme'

export default function Page() {
  return (
    <div className="relative">
      {/* Decorative gradients */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <SignIn appearance={clerkAppearance} />
    </div>
  )
}