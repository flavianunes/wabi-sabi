import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="page">
      <h1>Hello world</h1>
      <p className="lede">
        This is the documentation for <code>@wabi-sabi/ui</code> — React components built on Base UI
        and Motion, where the transition between states is part of the API rather than decoration
        added afterwards.
      </p>

      <h2>Components</h2>
      <p>
        <Link href="/components/button">Button</Link>
      </p>
    </main>
  )
}
