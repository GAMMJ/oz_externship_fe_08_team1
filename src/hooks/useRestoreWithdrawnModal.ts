import { useReducer, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { useSendEmail, useVerifyEmail } from '@/features/accounts/verification'
import { useRestoreAccount } from '@/features/accounts/restore'
import { useVerificationTimer } from '@/hooks/useVerificationTimer'
import { useToastStore } from '@/stores/toastStore'
import { ROUTES } from '@/constants/routes'

const VERIFY_TTL_SEC = 300

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

type Step = 'status' | 'verification'

interface ModalState {
  step: Step
  email: string
  code: string
  emailToken: string
  codeSent: boolean
  codeVerified: boolean
  emailError: string
  codeError: string
  showSuccess: boolean
  bannerVisible: boolean
}

type ModalAction =
  | { type: 'RESET'; email: string }
  | { type: 'SET_STEP'; step: Step }
  | { type: 'SET_EMAIL'; email: string }
  | { type: 'SET_CODE'; code: string }
  | { type: 'SET_EMAIL_ERROR'; error: string }
  | { type: 'SET_CODE_ERROR'; error: string }
  | { type: 'SEND_EMAIL_START' }
  | { type: 'CODE_SENT' }
  | { type: 'CODE_VERIFIED'; emailToken: string }
  | { type: 'TOKEN_EXPIRED' }
  | { type: 'SHOW_BANNER' }
  | { type: 'HIDE_BANNER' }
  | { type: 'RESTORE_SUCCESS' }

function makeInitialState(email: string): ModalState {
  return {
    step: 'status',
    email,
    code: '',
    emailToken: '',
    codeSent: false,
    codeVerified: false,
    emailError: '',
    codeError: '',
    showSuccess: false,
    bannerVisible: false,
  }
}

function reducer(state: ModalState, action: ModalAction): ModalState {
  switch (action.type) {
    case 'RESET':
      return makeInitialState(action.email)
    case 'SET_STEP':
      return { ...state, step: action.step }
    case 'SET_EMAIL':
      return { ...state, email: action.email, emailError: '' }
    case 'SET_CODE':
      return { ...state, code: action.code, codeError: '' }
    case 'SET_EMAIL_ERROR':
      return { ...state, emailError: action.error }
    case 'SET_CODE_ERROR':
      return { ...state, codeError: action.error }
    case 'SEND_EMAIL_START':
      return {
        ...state,
        emailError: '',
        code: '',
        codeError: '',
        codeVerified: false,
      }
    case 'CODE_SENT':
      return { ...state, codeSent: true }
    case 'CODE_VERIFIED':
      return {
        ...state,
        codeVerified: true,
        emailToken: action.emailToken,
        codeError: '',
      }
    case 'TOKEN_EXPIRED':
      return {
        ...state,
        codeVerified: false,
        emailToken: '',
        codeError: '인증이 만료되었습니다. 인증코드를 다시 받아주세요.',
      }
    case 'SHOW_BANNER':
      return { ...state, bannerVisible: true }
    case 'HIDE_BANNER':
      return { ...state, bannerVisible: false }
    case 'RESTORE_SUCCESS':
      return { ...state, showSuccess: true }
    default:
      return state
  }
}

export interface UseRestoreWithdrawnModalReturn {
  step: Step
  email: string
  code: string
  codeSent: boolean
  codeVerified: boolean
  emailError: string
  codeError: string
  showSuccess: boolean
  bannerVisible: boolean
  timerFormatted: string
  timerTimedOut: boolean
  isSendingEmail: boolean
  isVerifyingCode: boolean
  isRestoring: boolean
  isEmailValid: boolean
  onEmailChange: (email: string) => void
  onCodeChange: (code: string) => void
  onGoToVerification: () => void
  onSendEmail: () => void
  onVerifyCode: () => void
  onConfirmRestore: () => void
  onNavigateToLogin: () => void
}

interface UseRestoreWithdrawnModalProps {
  isOpen: boolean
  onClose: () => void
  initialEmail?: string
}

export function useRestoreWithdrawnModal({
  isOpen,
  onClose,
  initialEmail = '',
}: UseRestoreWithdrawnModalProps): UseRestoreWithdrawnModalReturn {
  const navigate = useNavigate()
  const showToast = useToastStore((s) => s.show)

  const [state, dispatch] = useReducer(reducer, makeInitialState(initialEmail))
  const {
    step,
    email,
    code,
    emailToken,
    codeSent,
    codeVerified,
    emailError,
    codeError,
    showSuccess,
    bannerVisible,
  } = state

  const bannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const timer = useVerificationTimer({ ttlSeconds: VERIFY_TTL_SEC })
  const resetTimer = timer.reset

  const sendEmail = useSendEmail()
  const verifyEmail = useVerifyEmail()
  const restoreAccount = useRestoreAccount()

  useEffect(() => {
    if (isOpen) {
      dispatch({ type: 'RESET', email: initialEmail })
      resetTimer()
      if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current)
    }
  }, [isOpen, initialEmail, resetTimer])

  useEffect(() => {
    return () => {
      if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current)
    }
  }, [])

  const onNavigateToLogin = useCallback(() => {
    onClose()
    navigate(ROUTES.AUTH.LOGIN)
  }, [onClose, navigate])

  function onSendEmail() {
    if (!isValidEmail(email)) {
      dispatch({
        type: 'SET_EMAIL_ERROR',
        error: '올바른 이메일 형식을 입력해주세요.',
      })
      return
    }
    dispatch({ type: 'SEND_EMAIL_START' })
    resetTimer()

    sendEmail.mutate(
      { email, purpose: 'recovery' },
      {
        onSuccess: () => {
          dispatch({ type: 'CODE_SENT' })
          timer.start()
          dispatch({ type: 'SHOW_BANNER' })
          if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current)
          bannerTimerRef.current = setTimeout(
            () => dispatch({ type: 'HIDE_BANNER' }),
            3000
          )
        },
        onError: () =>
          dispatch({
            type: 'SET_EMAIL_ERROR',
            error: '해당 이메일로 인증 코드를 전송할 수 없습니다.',
          }),
      }
    )
  }

  function onVerifyCode() {
    verifyEmail.mutate(
      { email, purpose: 'recovery', code },
      {
        onSuccess: (data) => {
          dispatch({ type: 'CODE_VERIFIED', emailToken: data.email_token })
          timer.stop()
        },
        onError: () =>
          dispatch({
            type: 'SET_CODE_ERROR',
            error: '인증코드가 일치하지 않습니다.',
          }),
      }
    )
  }

  function onConfirmRestore() {
    if (!emailToken) return
    restoreAccount.mutate(
      { email_token: emailToken },
      {
        onSuccess: () => dispatch({ type: 'RESTORE_SUCCESS' }),
        onError: (err) => {
          if (axios.isAxiosError(err)) {
            const status = err.response?.status
            if (status === 400 || status === 401) {
              dispatch({ type: 'TOKEN_EXPIRED' })
              return
            }
          }
          showToast('계정 복구에 실패했습니다. 다시 시도해주세요.', 'error')
        },
      }
    )
  }

  return {
    step,
    email,
    code,
    codeSent,
    codeVerified,
    emailError,
    codeError,
    showSuccess,
    bannerVisible,
    timerFormatted: timer.formattedTime,
    timerTimedOut: timer.isTimedOut,
    isSendingEmail: sendEmail.isPending,
    isVerifyingCode: verifyEmail.isPending,
    isRestoring: restoreAccount.isPending,
    isEmailValid: isValidEmail(email),
    onEmailChange: (val) => dispatch({ type: 'SET_EMAIL', email: val }),
    onCodeChange: (val) => dispatch({ type: 'SET_CODE', code: val }),
    onGoToVerification: () =>
      dispatch({ type: 'SET_STEP', step: 'verification' }),
    onSendEmail,
    onVerifyCode,
    onConfirmRestore,
    onNavigateToLogin,
  }
}
