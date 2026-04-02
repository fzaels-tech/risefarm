import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { apiError, apiSuccess } from '@/lib/api-response'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('risefarm_token')?.value
  
  if (!token) {
    return apiError('Unauthorized', 401)
  }
  
  const payload = await verifyToken(token)
  if (!payload) {
    return apiError('Unauthorized', 401)
  }
  
  return apiSuccess({ authenticated: true, user: { username: payload.username } })
}
