import { Suspense } from "react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30 flex items-center justify-center py-12 px-4">
        <Suspense fallback={<LoginPageSkeleton />}>
          <LoginForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}

function LoginPageSkeleton() {
  return (
    <div className="w-full max-w-md bg-card rounded-lg border shadow-sm p-6 space-y-6 animate-pulse">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-muted rounded-2xl" />
      </div>
      <div className="space-y-2">
        <div className="h-8 bg-muted rounded w-3/4 mx-auto" />
        <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="h-10 bg-muted rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="h-10 bg-muted rounded" />
        </div>
        <div className="h-10 bg-muted rounded" />
      </div>
    </div>
  )
}
