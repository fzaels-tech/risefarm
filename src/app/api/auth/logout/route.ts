import { serialize } from 'cookie'
import { apiSuccess } from '@/lib/api-response'

export async function POST() {
  const cookieHeader = serialize('risefarm_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: -1,
    path: '/',
    sameSite: 'lax',
  })
  
  const response = apiSuccess({ success: true })
  response.headers.append('Set-Cookie', cookieHeader)
  return response
}
