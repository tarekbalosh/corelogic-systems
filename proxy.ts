import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const APEX_HOST = 'corelogic-system.my'
const CANONICAL_HOST = 'www.corelogic-system.my'

export function proxy(request: NextRequest) {
  // Strip an optional port and normalise case before comparing.
  const hostname = (request.headers.get('host') || '').split(':')[0].toLowerCase()

  // Permanent (308) redirect of the apex domain to www, preserving path and query string.
  if (hostname === APEX_HOST) {
    const url = request.nextUrl.clone()
    url.protocol = 'https:'
    url.host = CANONICAL_HOST
    url.port = ''
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico|brand).*)',
}
