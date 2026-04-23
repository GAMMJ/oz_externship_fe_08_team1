/**
 * @figma 마이페이지  https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-5063&m=dev
 */
import { useNavigate } from 'react-router'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { ROUTES } from '@/constants/routes'

export function MypagePage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-8">
      {/* 헤더 - 카드 밖 */}
      <div className="flex items-center justify-between">
        <h1 className="text-[32px] leading-[140%] font-semibold tracking-[-0.03em] text-gray-900">
          내 정보
        </h1>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate(ROUTES.MYPAGE.EDIT)}
          className="px-9 py-5"
        >
          수정하기
        </Button>
      </div>

      {/* 카드 1: 프로필 + 개인정보 */}
      <Card padding="none" elevation="sm" className="px-11 py-[52px]">
        {/* 프로필 섹션 */}
        <section className="mb-[52px] border-b border-gray-200 pb-[52px]">
          <h2 className="text-primary-600 mb-[52px] text-xl leading-[140%] font-semibold tracking-[-0.03em]">
            프로필
          </h2>

          {/* 프로필 이미지 (중앙) */}
          <div className="mb-[44px] flex flex-col items-center">
            <div className="bg-primary-100 flex h-[184px] w-[184px] items-center justify-center overflow-hidden rounded-full">
              <svg width="184" height="184" viewBox="0 0 184 184" fill="none">
                <circle cx="92" cy="92" r="92" fill="#EFE6FC" />
                <circle cx="92" cy="72" r="28" fill="#A855F7" />
                <path
                  d="M92 106C69 106 50 118 43 137C43 137 57 158 92 158C127 158 141 137 141 137C134 118 115 106 92 106Z"
                  fill="#A855F7"
                />
              </svg>
            </div>
          </div>

          {/* 프로필 정보 */}
          <div className="space-y-5">
            <div className="flex items-center">
              <label className="w-32 text-sm leading-[140%] font-medium tracking-[-0.03em] text-gray-700">
                닉네임
              </label>
              <p className="flex-1 text-base leading-[140%] font-normal tracking-[-0.03em] text-gray-900">
                오즈오즈
              </p>
            </div>

            <div className="flex items-center">
              <label className="w-32 text-sm leading-[140%] font-medium tracking-[-0.03em] text-gray-700">
                이메일
              </label>
              <p className="flex-1 text-base leading-[140%] font-normal tracking-[-0.03em] text-gray-900">
                ozschool234@gmail.com
              </p>
            </div>
          </div>
        </section>

        {/* 개인 정보 섹션 */}
        <section>
          <h2 className="text-primary-600 mb-[52px] text-xl leading-[140%] font-semibold tracking-[-0.03em]">
            개인 정보
          </h2>

          <div className="space-y-5">
            <div className="flex items-center">
              <label className="w-32 text-sm leading-[140%] font-medium tracking-[-0.03em] text-gray-700">
                이름
              </label>
              <p className="flex-1 text-base leading-[140%] font-normal tracking-[-0.03em] text-gray-900">
                김오즈
              </p>
            </div>

            <div className="flex items-center">
              <label className="w-32 text-sm leading-[140%] font-medium tracking-[-0.03em] text-gray-700">
                휴대전화
              </label>
              <p className="flex-1 text-base leading-[140%] font-normal tracking-[-0.03em] text-gray-900">
                010 - 1234 - 1234
              </p>
            </div>

            <div className="flex items-center">
              <label className="w-32 text-sm leading-[140%] font-medium tracking-[-0.03em] text-gray-700">
                성별
              </label>
              <p className="flex-1 text-base leading-[140%] font-normal tracking-[-0.03em] text-gray-900">
                남자
              </p>
            </div>

            <div className="flex items-center">
              <label className="w-32 text-sm leading-[140%] font-medium tracking-[-0.03em] text-gray-700">
                생년월일
              </label>
              <p className="flex-1 text-base leading-[140%] font-normal tracking-[-0.03em] text-gray-900">
                2000.12.25
              </p>
            </div>
          </div>
        </section>
      </Card>

      {/* 카드 2: 수강 중인 과정 */}
      <Card padding="none" elevation="sm" className="px-11 py-[52px]">
        <h2 className="text-primary-600 mb-[52px] text-xl leading-[140%] font-semibold tracking-[-0.03em]">
          수강 중인 과정
        </h2>

        <div className="hover:border-primary-600 flex cursor-pointer items-center gap-4 rounded-lg border border-gray-200 p-6 transition-colors">
          {/* 과정 썸네일 */}
          <div className="flex h-[163px] w-[163px] flex-shrink-0 items-center justify-center rounded bg-gray-100">
            <svg width="163" height="163" viewBox="0 0 163 163">
              <pattern
                id="checkerboard"
                x="0"
                y="0"
                width="16"
                height="16"
                patternUnits="userSpaceOnUse"
              >
                <rect width="8" height="8" fill="#E5E7EB" />
                <rect x="8" y="0" width="8" height="8" fill="#F3F4F6" />
                <rect x="0" y="8" width="8" height="8" fill="#F3F4F6" />
                <rect x="8" y="8" width="8" height="8" fill="#E5E7EB" />
              </pattern>
              <rect width="163" height="163" fill="url(#checkerboard)" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="mb-2 text-lg leading-[140%] font-semibold tracking-[-0.03em] text-gray-900">
              IT스타트업 실무형 프로젝트 부트캠프 개발 전체 4기
            </h3>
            <p className="text-base leading-[140%] font-normal tracking-[-0.03em] text-gray-600">
              React + Node.js &lt; 1기 &gt;
            </p>
          </div>
        </div>
      </Card>

      {/* 회원 탈퇴 - 카드 없음 */}
      <div className="pt-6">
        <h3 className="mb-3 text-lg leading-[140%] font-medium tracking-[-0.03em] text-gray-700">
          회원 탈퇴 안내
        </h3>
        <p className="mb-2 text-sm leading-[140%] font-normal tracking-[-0.03em] text-gray-400">
          탈퇴 처리 시, 수강 기간 / 포인트 / 포인트는 소멸되어 환불되지
          않습니다.
        </p>
        <p className="mb-6 text-sm leading-[140%] font-normal tracking-[-0.03em] text-gray-400">
          본인의 경우, 반드시 탈퇴 전에 문의 바랍니다.
        </p>
        <div className="text-right">
          <Button variant="secondary" size="md" className="px-6 py-3">
            회원 탈퇴하기
          </Button>
        </div>
      </div>
    </div>
  )
}
