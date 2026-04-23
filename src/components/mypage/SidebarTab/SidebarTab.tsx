interface SidebarTabProps {
  children: React.ReactNode
  isActive?: boolean
  disabled?: boolean
  onClick?: () => void
}

export function SidebarTab({
  children,
  isActive = false,
  disabled = false,
  onClick,
}: SidebarTabProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        'relative flex h-8 w-[152px] items-center rounded-sm px-5 text-lg leading-normal tracking-[-0.03em] transition-colors duration-150',
        isActive
          ? 'text-primary font-semibold'
          : disabled
            ? 'bg-disable text-text-muted cursor-not-allowed font-normal'
            : 'hover:text-primary hover:bg-primary-100 text-text-muted cursor-pointer font-normal hover:font-semibold',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {isActive && (
        <span className="bg-primary absolute top-1/2 left-0 h-full w-0.5 -translate-y-1/2 rounded-full" />
      )}
      {children}
    </button>
  )
}
