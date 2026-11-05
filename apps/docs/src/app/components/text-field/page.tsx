import { textFieldMeta } from '@wabi-sabi/ui/meta'
import { TextField } from '@wabi-sabi/ui/text-field'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'TextField',
}

export default function TextFieldPage() {
  return (
    <main className="page">
      <p>
        <Link href="/">← Back</Link>
      </p>

      <h1>TextField</h1>
      <p>
        <span className="status">{textFieldMeta.status}</span>
      </p>

      <p>
        A labelled single-line input. The full documentation, with every state and its controls, is
        in Storybook; this page exists to render the component from a React Server Component.
      </p>

      <h2>Examples</h2>
      <div className="stack">
        <TextField label="Email" type="email" helperText="We never share it." />
        <TextField label="Email" type="email" errorText="Enter a valid email address." />
        <TextField label="Email" type="email" disabled />
      </div>

      <h2>Known limitations</h2>
      <ul className="limitations">
        {textFieldMeta.knownLimitations.map((limitation) => (
          <li key={limitation}>{limitation}</li>
        ))}
      </ul>
    </main>
  )
}
