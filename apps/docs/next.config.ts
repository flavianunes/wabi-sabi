import type { NextConfig } from 'next'

/*
 * There is deliberately no `transpilePackages: ['@wabi-sabi/ui']` here.
 *
 * The library ships pre-built ESM with the "use client" directive already injected, so
 * Next should consume it exactly as an npm consumer would. If this app ever needs
 * transpilePackages to work, that is a signal the package is built wrong — not a setting
 * to add.
 */
const nextConfig: NextConfig = {}

export default nextConfig
