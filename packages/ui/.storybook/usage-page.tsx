import {
  Controls,
  Description,
  Primary,
  Stories,
  Subtitle,
  Title,
} from '@storybook/addon-docs/blocks'

export interface UsageGuidance {
  /** Situations the component is the right choice for. */
  whenToUse: string[]
  /** Situations where something else serves better, ideally naming it. */
  whenNotToUse: string[]
}

/**
 * A component's documentation page: what it is, when to reach for it, when not to, then
 * the live example, its props and every story.
 *
 * Written in TSX rather than MDX, because MDX tooling cannot use the TypeScript 7 compiler
 * API until 7.1. See AGENTS.md.
 *
 * @example
 * ```ts
 * parameters: { docs: { page: usagePage({ whenToUse: [...], whenNotToUse: [...] }) } }
 * ```
 */
export function usagePage({ whenToUse, whenNotToUse }: UsageGuidance) {
  return function UsagePage() {
    return (
      <>
        <Title />
        <Subtitle />
        <Description />
        <Primary />

        <h2>When to use</h2>
        <ul>
          {whenToUse.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2>When not to use</h2>
        <ul>
          {whenNotToUse.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2>Props</h2>
        <Controls />

        <Stories title="Examples" />
      </>
    )
  }
}
