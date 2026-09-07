/**
 * Global icon override.
 *
 * Wrap an app in `WabiSabiProvider` to replace the structural icons the library uses,
 * for projects that already standardise on another icon set.
 *
 *   <WabiSabiProvider icons={{ chevron: CaretDown, close: XMark }}>
 *
 * This is the second of three layers. The most specific is a per-instance `icon` prop;
 * the most general is appearance by token (`--ws-icon-size`, `--ws-icon-stroke`).
 */

import type { ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'
import type { IconRegistry, IconSlot } from './registry'
import { defaultIcons } from './registry'

const IconContext = createContext<IconRegistry>(defaultIcons)

export interface WabiSabiProviderProps {
  /**
   * Icons to use in place of the defaults. Partial: any slot left out keeps its default.
   */
  icons?: Partial<IconRegistry>
  children?: ReactNode
}

export function WabiSabiProvider({ icons, children }: WabiSabiProviderProps) {
  const value = useMemo(() => (icons ? { ...defaultIcons, ...icons } : defaultIcons), [icons])

  return <IconContext.Provider value={value}>{children}</IconContext.Provider>
}

WabiSabiProvider.displayName = 'WabiSabiProvider'

/**
 * Reads one icon from the registry. Components use this instead of importing an icon.
 *
 * @param slot - Which structural icon is needed.
 */
export function useIcon(slot: IconSlot) {
  return useContext(IconContext)[slot]
}
