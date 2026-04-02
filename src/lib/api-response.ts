import { NextResponse } from 'next/server'

type JsonInit = {
  status?: number
  headers?: HeadersInit
}

export function apiSuccess<T>(data: T, init: JsonInit = {}) {
  return NextResponse.json(data, {
    status: init.status,
    headers: init.headers,
  })
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