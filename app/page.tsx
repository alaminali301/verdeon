export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-green-50 px-6 py-24">
      <div className="max-w-3xl rounded-lg border border-green-100 bg-white p-10 shadow-card">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-green-600">
          Verdeon
        </p>
        <h1 className="font-display text-5xl text-green-950">
          EPA carbon data, scaffolded for the full web build.
        </h1>
        <p className="mt-4 text-base leading-7 text-muted">
          Task 1 sets up the Next.js App Router structure, Verdeon design
          tokens, EPA data assets, and the typed data layer foundation.
        </p>
      </div>
    </main>
  )
}
