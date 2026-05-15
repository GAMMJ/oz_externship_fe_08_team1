import { useState } from 'react'
import { Modal } from '@/components/common/Modal/Modal'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { useSendSms, useVerifySms } from '@/features/accounts/signup'
import { useFindEmail } from '@/features/accounts/find-email'

function PersonIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="100" cy="100" r="100" fill="#CEC1F0" />
      <circle cx="100" cy="74" r="26" stroke="#6218D1" strokeWidth="12" />
      <path
        d="M54 163C54 133.729 74.5949 110 100 110C125.405 110 146 133.729 146 163"
        stroke="#6218D1"
        strokeWidth="12"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ModalHeader({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center gap-2 pt-4 pb-4">
      <PersonIcon />
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
    </div>
  )
}

export interface FindEmailModalProps {
  isOpen: boolean
  onClose: () => void
  onFindPassword: () => void
}

export function FindEmailModal({
  isOpen,
  onClose,
  onFindPassword,
}: FindEmailModalProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [smsCode, setSmsCode] = useState('')
  const [smsToken, setSmsToken] = useState('')
  const [smsSent, setSmsSent] = useState(false)
  const [smsVerified, setSmsVerified] = useState(false)
  const [foundEmail, setFoundEmail] = useState('')

  const [nameError, setNameError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [smsCodeError, setSmsCodeError] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const { mutate: sendSms, isPending: isSendSmsPending } = useSendSms()
  const { mutate: verifySms, isPending: isVerifySmsPending } = useVerifySms()
  const { mutate: findEmail, isPending: isFindEmailPending } = useFindEmail()

  const handleClose = () => {
    setName('')
    setPhone('')
    setSmsCode('')
    setSmsToken('')
    setSmsSent(false)
    setSmsVerified(false)
    setFoundEmail('')
    setNameError('')
    setPhoneError('')
    setSmsCodeError('')
    setErrorMessage('')
    onClose()
  }

  const handleSendSms = () => {
    if (!phone) {
      setPhoneError('휴대폰 번호를 입력해주세요.')
      return
    }
    sendSms(
      { phone_number: phone, purpose: 'find_email' },
      {
        onSuccess: () => setSmsSent(true),
        onError: () => setPhoneError('SMS 발송에 실패했습니다.'),
      }
    )
  }

  const handleVerifySms = () => {
    if (!smsCode) {
      setSmsCodeError('인증번호를 입력해주세요.')
      return
    }
    verifySms(
      { phone_number: phone, purpose: 'find_email', code: smsCode },
      {
        onSuccess: (data) => {
          setSmsToken(data.sms_token)
          setSmsVerified(true)
        },
        onError: () => setSmsCodeError('인증번호가 올바르지 않습니다.'),
      }
    )
  }

  const handleFindEmail = () => {
    if (!name) {
      setNameError('이름을 입력해주세요.')
      return
    }
    if (!smsVerified) {
      setPhoneError('휴대폰 인증을 완료해주세요.')
      return
    }

    findEmail(
      { sms_token: smsToken, name },
      {
        onSuccess: (data) => setFoundEmail(data.email),
        onError: () =>
          setErrorMessage(
            '입력한 이름과 휴대폰 번호로 등록된 아이디가 존재하지 않습니다.'
          ),
      }
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      {foundEmail ? (
        /* 성공 화면 */
        <div className="flex flex-col gap-4">
          <ModalHeader title="아이디 찾기" />
          <p className="text-center text-sm text-gray-600">
            입력하신 정보와 일치하는 아이디입니다.
          </p>
          <div className="flex items-center justify-center rounded-sm border border-gray-200 py-4">
            <p className="text-base font-medium text-gray-900">{foundEmail}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" fullWidth onClick={handleClose}>
              로그인
            </Button>
            <Button
              fullWidth
              onClick={() => {
                handleClose()
                onFindPassword()
              }}
            >
              비밀번호 찾기
            </Button>
          </div>
        </div>
      ) : (
        /* 입력 화면 */
        <div className="flex flex-col gap-5">
          <ModalHeader title="아이디 찾기" />
          {errorMessage && (
            <p className="text-center text-sm text-red-500">{errorMessage}</p>
          )}

          {/* 이름 */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-700">
              이름<span className="text-red-500">*</span>
            </p>
            <Input
              placeholder="이름을 입력해주세요"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setNameError('')
              }}
              isError={Boolean(nameError)}
              errorMessage={nameError}
              autoComplete="off"
            />
          </div>

          {/* 휴대전화 */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-700">
              휴대전화<span className="text-red-500">*</span>
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="숫자만 입력해주세요"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  setPhoneError('')
                }}
                isError={Boolean(phoneError)}
                errorMessage={phoneError}
                className="flex-1"
                autoComplete="off"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleSendSms}
                loading={isSendSmsPending}
                disabled={!phone || smsVerified}
                className="shrink-0"
              >
                {smsSent ? '재발송' : '인증번호전송'}
              </Button>
            </div>
            {smsSent && !smsVerified && (
              <div className="flex gap-2">
                <Input
                  placeholder="인증번호 6자리를 입력해주세요"
                  value={smsCode}
                  onChange={(e) => {
                    setSmsCode(e.target.value)
                    setSmsCodeError('')
                  }}
                  isError={Boolean(smsCodeError)}
                  errorMessage={smsCodeError}
                  className="flex-1"
                  autoComplete="off"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleVerifySms}
                  loading={isVerifySmsPending}
                  disabled={!smsCode}
                  className="shrink-0"
                >
                  인증번호확인
                </Button>
              </div>
            )}
            {smsVerified && (
              <p className="text-sm text-green-600">
                휴대폰 인증이 완료되었습니다.
              </p>
            )}
          </div>

          <Button
            fullWidth
            onClick={handleFindEmail}
            loading={isFindEmailPending}
            disabled={!name || !smsVerified}
          >
            아이디 찾기
          </Button>
        </div>
      )}
    </Modal>
  )
}
