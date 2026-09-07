/**
 * Icon registry.
 *
 * The library uses Lucide internally and does not require anyone else to. Since we ship a
 * package rather than generate code, the indirection has to happen at runtime: components
 * ask the registry for a named slot, and `WabiSabiProvider` can replace any of them.
 *
 * This is the ONLY file permitted to import from `lucide-react`. A component importing it
 * directly would silently bypass the global override. Enforced by Biome.
 */

import { ArrowRight, Check, ChevronDown, LoaderCircle, X } from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'

/** The props any icon in the registry must accept. */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

/**
 * Slots are named by function, not by icon name, so an override does not have to match
 * our visual choices. The map is small and closed on purpose.
 */
export interface IconRegistry {
  /** Expands or collapses a section; also indicates a menu. */
  chevron: IconComponent
  /** Dismisses a dialog, popover, or toast. */
  close: IconComponent
  /** Marks a selected or completed item. */
  check: IconComponent
  /** Indicates work in progress. */
  spinner: IconComponent
  /** Points to a destination or next step. */
  arrow: IconComponent
}

export const defaultIcons: IconRegistry = {
  chevron: ChevronDown,
  close: X,
  check: Check,
  spinner: LoaderCircle,
  arrow: ArrowRight,
}

export type IconSlot = keyof IconRegistry
