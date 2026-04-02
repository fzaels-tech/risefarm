import prisma from '@/lib/prisma'
import { verifyPassword, signToken } from '@/lib/auth'
import { serialize } from 'cookie'
import { apiBadRequest, apiError, apiSuccess } from '@/lib/api-response'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    if (!username || !password) {
      return apiBadRequest('Username and password are required')
    }

    const admin = await prisma.admin.findUnique({ where: { username } })
    if (!admin) {
      return apiError('Username atau Password salah', 401)
    }

    const isValid = await verifyPassword(password, admin.passwordHash)
    if (!isValid) {
      return apiError('Username atau Password salah', 401)
    }

    const token = await signToken({ sub: admin.id, username: admin.username })
    const cookieHeader = serialize('risefarm_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'lax',
    })

    const response = apiSuccess({ success: true })
    response.headers.append('Set-Cookie', cookieHeader)
    return response

  } catch (error) {
    console.error("Login Error:", error)
    return apiError('Internal Server Error', 500)
  }
}
