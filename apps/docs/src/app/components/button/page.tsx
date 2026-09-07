/*
 * Deliberately a Server Component: there is no "use client" at the top of this file.
 *
 * A server component importing and rendering <Button> is exactly the React Server
 * Components boundary the packaging has to get right. If the "use client" directive were
 * missing from the built library, this page would fail to build — which makes it a second
 * smoke test, at integration level, that runs on every `pnpm build:docs`.
 */

import { Button } from '@wabi-sabi/ui/button'
// Metadata comes from the server-safe entry, not from '@wabi-sabi/ui/button'. That module
// is a client module, and React turns every export of one into an opaque client
// reference — so reading meta.status off it here would come back undefined.
import { buttonMeta } from '@wabi-sabi/ui/meta'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Button',
  description: 'A button. Composes Base UI, with state transitions built from motion tokens.',
}

const props = [
  {
    name: 'variant',
    type: "'solid' | 'soft' | 'ghost'",
    default: "'solid'",
    description: 'Visual weight of the button.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Height, padding, and type size.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Whether the button should ignore user interaction.',
  },
  {
    name: 'focusableWhenDisabled',
    type: 'boolean',
    default: 'false',
    description: 'Whether the button stays focusable while disabled. Useful for loading states.',
  },
  {
    name: 'nativeButton',
    type: 'boolean',
    default: 'true',
    description: 'Whether a native button element is rendered when using render.',
  },
  {
    name: 'render',
    type: 'ReactElement | function',
    default: '—',
    description: 'Replaces the rendered element, keeping the button semantics.',
  },
]

export default function ButtonPage() {
  return (
    <main className="page">
      <p>
        <Link href="/">← Back</Link>
      </p>

      <h1>Button</h1>
      <p>
        <span className="status">{buttonMeta.status}</span>
      </p>
      <p className="lede">
        A button. Wraps Base UI&rsquo;s Button, which supplies the semantics: the button role,
        keyboard activation, and correct disabled behaviour even when rendered as another element.
      </p>

      <h2>Variants</h2>
      <p>
        Three, covering visual weight. Status is a separate axis — a destructive action is still a
        solid button, with its accent tokens overridden.
      </p>
      <div className="row">
        <Button variant="solid">Solid</Button>
        <Button variant="soft">Soft</Button>
        <Button variant="ghost">Ghost</Button>
      </div>

      <h2>Sizes</h2>
      <div className="row">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>

      <h2>Disabled</h2>
      <p>
        Disabled styling keys off Base UI&rsquo;s <code>data-disabled</code> attribute rather than{' '}
        <code>:disabled</code>, so it still applies when the button renders as something other than
        a native <code>&lt;button&gt;</code>.
      </p>
      <div className="row">
        <Button disabled>Solid</Button>
        <Button variant="soft" disabled>
          Soft
        </Button>
        <Button variant="ghost" disabled>
          Ghost
        </Button>
      </div>

      <h2>Rendered as another element</h2>
      <p>
        With <code>render</code>, the button keeps its role and keyboard behaviour while rendering a
        different tag. Set <code>nativeButton</code> to <code>false</code> when the element is not a{' '}
        <code>&lt;button&gt;</code>.
      </p>
      <div className="row">
        <Button nativeButton={false} render={<span />}>
          A span that is still a button
        </Button>
      </div>

      <h2>Movement</h2>
      <p>
        A button never mounts or unmounts, so there is no enter or exit animation here — the
        transitions that matter are between its states. Press feedback is a 160ms scale to 0.97,
        which scales the label and icons with it so it reads as a physical press. Hover is gated
        behind a fine pointer, because a touch device fires a synthetic hover on tap that would
        otherwise leave the button stuck. Under <code>prefers-reduced-motion</code> the colour
        transitions stay and the scale is dropped.
      </p>

      <h2>Keyboard</h2>
      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Behaviour</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>Tab</code>
              </td>
              <td>Moves focus to the button, showing the focus ring.</td>
            </tr>
            <tr>
              <td>
                <code>Enter</code>
              </td>
              <td>Activates the button.</td>
            </tr>
            <tr>
              <td>
                <code>Space</code>
              </td>
              <td>Activates the button.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Props</h2>
      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {props.map((prop) => (
              <tr key={prop.name}>
                <td>
                  <code>{prop.name}</code>
                </td>
                <td>
                  <code>{prop.type}</code>
                </td>
                <td>
                  <code>{prop.default}</code>
                </td>
                <td>{prop.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Every other prop is forwarded to Base UI&rsquo;s Button, and from there to the underlying
        element.
      </p>

      <h2>Known limitations</h2>
      <ul className="limitations">
        {buttonMeta.knownLimitations.map((limitation) => (
          <li key={limitation}>{limitation}</li>
        ))}
      </ul>
    </main>
  )
}
