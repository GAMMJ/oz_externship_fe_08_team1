import { Outlet, useLocation, useNavigate } from 'react-router'
import { ROUTES } from '@/constants/routes'
import { SidebarTab } from '@/components/mypage/SidebarTab'

const navItems = [
  { label: '내 정보', to: ROUTES.MYPAGE.HOME },
  { label: '쪽지시험', to: ROUTES.MYPAGE.QUIZ },
  { label: '비밀번호 변경', to: ROUTES.MYPAGE.CHANGE_PASSWORD },
]

export function MypageLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="mx-auto w-[944px] py-[108px]">
      <div className="flex gap-12">
        {/* 사이드바 */}
        <nav className="flex shrink-0 flex-col gap-4">
          {navItems.map(({ label, to }) => (
            <SidebarTab
              key={to}
              isActive={location.pathname === to}
              onClick={() => navigate(to)}
            >
              {label}
            </SidebarTab>
          ))}
        </nav>

        {/* 메인 콘텐츠 */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
