import { Button } from '@wabi-sabi/ui/button'
import { Card } from '@wabi-sabi/ui/card'
import { cardMeta } from '@wabi-sabi/ui/meta'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Card',
}

export default function CardPage() {
  return (
    <main className="page">
      <p>
        <Link href="/">← Back</Link>
      </p>

      <h1>Card</h1>
      <p>
        <span className="status">{cardMeta.status}</span>
      </p>

      <p>
        A titled group of related content. The full documentation is in Storybook; this page exists
        to render the component from a React Server Component.
      </p>

      <h2>Example</h2>
      <div className="stack">
        <Card title="Plan" headingLevel={3} footer={<Button size="sm">Upgrade</Button>}>
          You are on the free plan.
        </Card>
      </div>

      <h2>Known limitations</h2>
      <ul className="limitations">
        {cardMeta.knownLimitations.map((limitation) => (
          <li key={limitation}>{limitation}</li>
        ))}
      </ul>
    </main>
  )
}
