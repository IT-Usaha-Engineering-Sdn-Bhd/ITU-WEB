import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'
import config from '@/payload.config'
import { importMap } from './admin/importMap'

// NOTE: this layout must never import ../../globals.css. It renders its own <html>, and
// Payload admin ships its own stylesheet via @payloadcms/next/css — Tailwind 4's preflight
// reset would visibly break the admin UI if the two CSS graphs mixed.
import '@payloadcms/next/css'

type Args = { children: React.ReactNode }

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
