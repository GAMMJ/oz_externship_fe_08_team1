import { useEffect, useRef } from 'react'
import { useDeploymentStatus } from '@/features/exams/deployment-status'
import { getErrorStatus } from '@/utils/getErrorStatus'
import { HTTP_STATUS } from '@/constants/httpStatus'

interface UseExamStatusPollerOptions {
  deploymentId: number
  enabled: boolean
  onClosed: () => void
  onError: (status: number | undefined, error: unknown) => void
}

export function useExamStatusPoller({
  deploymentId,
  enabled,
  onClosed,
  onError,
}: UseExamStatusPollerOptions) {
  const { data, error } = useDeploymentStatus(deploymentId, enabled)
  const onClosedRef = useRef(onClosed)
  const onErrorRef = useRef(onError)
  const triggeredRef = useRef(false)

  useEffect(() => {
    onClosedRef.current = onClosed
    onErrorRef.current = onError
  })

  useEffect(() => {
    if (!data || triggeredRef.current) return
    if (data.exam_status === 'closed' || data.force_submit === true) {
      triggeredRef.current = true
      onClosedRef.current()
    }
  }, [data])

  useEffect(() => {
    if (!error || triggeredRef.current) return
    const status = getErrorStatus(error)
    if (status === HTTP_STATUS.GONE) {
      // 410: 시험 종료 신호 — closed로 처리
      triggeredRef.current = true
      onClosedRef.current()
    } else if (status && status >= 400 && status < 500) {
      // 4xx: 명확한 에러 — 종결 처리
      triggeredRef.current = true
      onErrorRef.current(status, error)
    }
    // 5xx/네트워크 에러: retry 정책으로 흡수, triggeredRef 잠금하지 않아 폴링 지속
  }, [error])
}
