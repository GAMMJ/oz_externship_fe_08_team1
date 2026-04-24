import { http, HttpResponse } from 'msw'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

// POST /api/v1/exams/deployments/:deploymentId/check-code — 참가코드 검증 API
export const checkCodeHandlers = [
  http.post(
    `${BASE_URL}/exams/deployments/:deploymentId/check-code`,
    async ({ request }) => {
      const body = (await request.json()) as { code: string }

      if (body.code === 'ABC123') {
        return new HttpResponse(null, { status: 204 })
      }

      return HttpResponse.json(
        { error_detail: '응시 코드가 일치하지 않습니다.' },
        { status: 400 }
      )
    }
  ),
]
