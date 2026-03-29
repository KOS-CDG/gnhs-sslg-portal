import { create } from 'zustand';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface UIState {
  // Mobile nav
  navOpen: boolean;
  toggleNav: () => void;
  closeNav: () => void;

  // Global modal
  modalOpen: boolean;
  modalContent: React.ReactNode | null;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;

  // Toast notifications
  toasts: Toast[];
  addToast: (message: string, variant?: ToastVariant) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  navOpen: false,
  toggleNav: () => set((s) => ({ navOpen: !s.navOpen })),
  closeNav: () => set({ navOpen: false }),

  modalOpen: false,
  modalContent: null,
  openModal: (content) => set({ modalOpen: true, modalContent: content }),
  closeModal: () => set({ modalOpen: false, modalContent: null }),

  toasts: [],
  addToast: (message, variant = 'info') =>
    set((s) => ({
      toasts: [
        ...s.toasts,
        { id: crypto.randomUUID(), message, variant },
      ],
    })),
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
