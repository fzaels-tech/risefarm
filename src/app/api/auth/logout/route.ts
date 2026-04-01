import { NextResponse } from 'next/server'
import { serialize } from 'cookie'

export async function POST() {
  const cookieHeader = serialize('risefarm_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: -1,
    path: '/',
    sameSite: 'lax',
  })
  
  const response = NextResponse.json({ success: true })
  response.headers.append('Set-Cookie', cookieHeader)
  return response
}
