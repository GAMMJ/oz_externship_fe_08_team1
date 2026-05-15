import { useState, useEffect, useCallback } from 'react'
import type { AxiosError } from 'axios'
import { Modal } from '@/components/common/Modal/Modal'
import { Input } from '@/components/common/Input'
import { PasswordInput } from '@/components/common/PasswordInput'
import { Button } from '@/components/common/Button'
import { useSendEmail, useVerifyEmail } from '@/features/accounts/signup'
import { useFindPassword } from '@/features/accounts/find-password'

function LockIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="100" cy="100" r="80" fill="#D1B3FF" />
      <path
        d="M75 90V80C75 66.1929 86.1929 55 100 55C113.807 55 125 66.1929 125 80V90"
        stroke="#5E00B1"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <circle cx="100" cy="115" r="35" stroke="#5E00B1" strokeWidth="10" />
      <circle cx="100" cy="115" r="8" fill="#5E00B1" />
    </svg>
  )
}

function ModalHeader({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center gap-2 pt-4 pb-4">
      <LockIcon />
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  )
}

export interface FindPasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FindPasswordModal({ isOpen, onClose }: FindPasswordModalProps) {
  const [email, setEmail] = useState('')
  const [emailCode, setEmailCode] = useState('')
  const [emailToken, setEmailToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')

  const [emailSent, setEmailSent] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [timer, setTimer] = useState(0)

  const [emailError, setEmailError] = useState('')
  const [emailCodeError, setEmailCodeError] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')
  const [newPasswordConfirmError, setNewPasswordConfirmError] = useState('')

  const { mutate: sendEmail, isPending: isSendEmailPending } = useSendEmail()
  const { mutate: verifyEmail, isPending: isVerifyEmailPending } =
    useVerifyEmail()
  const { mutate: findPassword, isPending: isFindPasswordPending } =
    useFindPassword()

  const handleClose = useCallback(() => {
    setEmail('')
    setEmailCode('')
    setEmailToken('')
    setNewPassword('')
    setNewPasswordConfirm('')
    setEmailSent(false)
    setEmailVerified(false)
    setIsSuccess(false)
    setCountdown(0)
    setTimer(0)
    setEmailError('')
    setEmailCodeError('')
    setNewPasswordError('')
    setNewPasswordConfirmError('')
    onClose()
  }, [onClose])

  useEffect(() => {
    if (timer <= 0) return
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [timer])

  useEffect(() => {
    if (!isSuccess) return
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          handleClose()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isSuccess, handleClose])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const handleSendEmail = () => {
    if (!email) {
      setEmailError('이메일을 입력해주세요.')
      return
    }
    sendEmail(
      { email, purpose: 'find_password' },
      {
        onSuccess: () => {
          setEmailSent(true)
          setTimer(300)
        },
        onError: (error: unknown) => {
          const axiosError = error as AxiosError<{
            error_detail?: string | string[] | { email?: string[] }
          }>
          const errorDetail = axiosError.response?.data?.error_detail
          if (Array.isArray(errorDetail)) {
            setEmailError(errorDetail[0])
          } else if (typeof errorDetail === 'string') {
            setEmailError(errorDetail)
          } else if (errorDetail?.email) {
            setEmailError(errorDetail.email[0])
          } else {
            setEmailError('이메일 발송에 실패했습니다.')
          }
        },
      }
    )
  }

  const handleVerifyEmail = () => {
    if (!emailCode) {
      setEmailCodeError('인증번호를 입력해주세요.')
      return
    }
    verifyEmail(
      { email, purpose: 'find_password', code: emailCode },
      {
        onSuccess: (data) => {
          setEmailToken(data.email_token)
          setEmailVerified(true)
          setTimer(0)
        },
        onError: () => setEmailCodeError('인증번호가 올바르지 않습니다.'),
      }
    )
  }

  const handleFindPassword = () => {
    if (!newPassword) {
      setNewPasswordError('비밀번호를 입력해주세요.')
      return
    }
    if (newPassword !== newPasswordConfirm) {
      setNewPasswordConfirmError('비밀번호가 일치하지 않습니다.')
      return
    }
    findPassword(
      { email_token: emailToken, new_password: newPassword },
      {
        onSuccess: () => {
          setIsSuccess(true)
          setCountdown(10)
        },
        onError: (error: unknown) => {
          const axiosError = error as AxiosError<{
            error_detail?: string | string[] | { new_password?: string[] }
          }>
          const errorDetail = axiosError.response?.data?.error_detail
          if (Array.isArray(errorDetail)) {
            setNewPasswordError(errorDetail[0])
          } else if (typeof errorDetail === 'string') {
            setNewPasswordError(errorDetail)
          } else if (errorDetail?.new_password) {
            setNewPasswordError(errorDetail.new_password[0])
          } else {
            setNewPasswordError('비밀번호 변경에 실패했습니다.')
          }
        },
      }
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      {isSuccess ? (
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="#16a34a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            비밀번호 변경 완료!
          </p>
          <p className="text-sm text-gray-500">
            잠시 후 로그인 페이지로 이동합니다.
          </p>
          <p className="text-sm text-gray-400">
            {countdown}초 후 로그인 페이지로 이동합니다.
          </p>
          <Button fullWidth onClick={handleClose}>
            확인
          </Button>
        </div>
      ) : emailVerified ? (
        <div className="flex flex-col gap-5">
          <ModalHeader
            title="비밀번호 재설정"
            description="신규 비밀번호를 입력해주세요."
          />
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-700">
              새 비밀번호<span className="text-red-500">*</span>
              <span className="text-primary ml-2 text-xs">
                6~15자리 영문 대소문자, 숫자, 특수문자 포함
              </span>
            </p>
            <PasswordInput
              placeholder="비밀번호를 입력해주세요"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                setNewPasswordError('')
              }}
              isError={Boolean(newPasswordError)}
              errorMessage={newPasswordError}
              autoComplete="new-password"
            />
          </div>
          <PasswordInput
            placeholder="비밀번호를 다시 입력해주세요"
            value={newPasswordConfirm}
            onChange={(e) => {
              setNewPasswordConfirm(e.target.value)
              setNewPasswordConfirmError('')
            }}
            isError={Boolean(newPasswordConfirmError)}
            errorMessage={newPasswordConfirmError}
            autoComplete="new-password"
          />
          <Button
            fullWidth
            onClick={handleFindPassword}
            loading={isFindPasswordPending}
            disabled={!newPassword || !newPasswordConfirm}
          >
            확인
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <ModalHeader
            title="비밀번호 찾기"
            description="이메일로 비밀번호 재설정 링크를 보내드려요."
          />
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-gray-700">
              이메일<span className="text-red-500">*</span>
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="가입한 이메일을 입력해 주세요."
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setEmailError('')
                }}
                isError={Boolean(emailError)}
                errorMessage={emailError}
                className="flex-1"
                autoComplete="off"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleSendEmail}
                loading={isSendEmailPending}
                disabled={!email || emailVerified}
                className="shrink-0"
              >
                {emailSent ? '재발송' : '인증코드전송'}
              </Button>
            </div>
            {emailSent && !emailVerified && (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="인증번호 6자리를 입력해주세요"
                    value={emailCode}
                    onChange={(e) => {
                      setEmailCode(e.target.value)
                      setEmailCodeError('')
                    }}
                    isError={Boolean(emailCodeError)}
                    errorMessage={emailCodeError}
                    autoComplete="off"
                  />
                  {timer > 0 && (
                    <span className="text-primary absolute top-3 right-3 text-sm">
                      {formatTime(timer)}
                    </span>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleVerifyEmail}
                  loading={isVerifyEmailPending}
                  disabled={!emailCode || timer === 0}
                  className="shrink-0"
                >
                  인증코드확인
                </Button>
              </div>
            )}
          </div>
          <Button fullWidth onClick={() => {}} disabled={!emailVerified}>
            비밀번호 찾기
          </Button>
        </div>
      )}
    </Modal>
  )
}
