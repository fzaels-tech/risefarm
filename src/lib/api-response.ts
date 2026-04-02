import { NextResponse } from 'next/server'

type JsonInit = {
  status?: number
  headers?: HeadersInit
}

export function apiSuccess<T>(data: T, init: JsonInit = {}) {
  const responseInit =
    typeof init.status === 'number'
      ? { status: init.status, headers: init.headers }
      : { headers: init.headers }

  return NextResponse.json(data, responseInit)
}

export function apiError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status })
}

export function apiUnauthorized() {
  return apiError('Unauthorized', 401)
}

export function apiBadRequest(message: string) {
  return apiError(message, 400)
}

export function apiNotFound(message: string) {
  return apiError(message, 404)
}

export function apiServerError(message = 'Internal server error') {
  return apiError(message, 500)
}