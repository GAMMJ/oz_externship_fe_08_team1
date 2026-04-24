import { http, HttpResponse } from 'msw'
import { deploymentsHandlers } from '@/features/exams/deployments'
import { loginHandlers } from '@/features/accounts/login/handler'
import { meHandlers } from '@/features/accounts/me'
import { meEnrolledCoursesHandlers } from '@/features/accounts/me-enrolled-courses'
import { checkCodeHandlers } from '@/features/exams/deployment-check-code'

export const handlers = [
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' })
  }),
  ...meHandlers,
  ...meEnrolledCoursesHandlers,
  ...deploymentsHandlers,
  ...loginHandlers,
  ...checkCodeHandlers,
]
