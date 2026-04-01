import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/editor')) {
    const token = request.cookies.get('risefarm_token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    const payload = await verifyToken(token)
    if (!payload) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('risefarm_token')
      return response
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/editor/:path*'],
}
