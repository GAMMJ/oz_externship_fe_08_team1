import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { ToastVariant } from '@/components/common/Toast'

interface ToastState {
  visible: boolean
  message: string
  variant: ToastVariant
  show: (message: string, variant?: ToastVariant) => void
  hide: () => void
}

export const useToastStore = create<ToastState>()(
  devtools(
    (set) => ({
      visible: false,
      message: '',
      variant: 'error',
      show: (message, variant = 'error') =>
        set({ visible: true, message, variant }, undefined, 'toast/show'),
      hide: () => set({ visible: false }, undefined, 'toast/hide'),
    }),
    { name: 'ToastStore' }
  )
)
