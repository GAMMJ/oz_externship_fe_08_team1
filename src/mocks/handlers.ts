import { http, HttpResponse } from 'msw'
import { deploymentsHandlers } from '@/features/exams/deployments'
import { loginHandlers } from '@/features/accounts/login/handler'

export const handlers = [
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' })
  }),
  ...deploymentsHandlers,
  ...loginHandlers,
]
