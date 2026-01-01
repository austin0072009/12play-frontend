import { create } from 'zustand';

interface AlertState {
  message: string;
  isOpen: boolean;
  onConfirm?: () => void;
  showAlert: (message: string, onConfirm?: () => void) => void;
  closeAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  message: '',
  isOpen: false,
  onConfirm: undefined,
  showAlert: (message: string, onConfirm?: () => void) => {
    set({ message, isOpen: true, onConfirm });
  },
  closeAlert: () => {
    set({ message: '', isOpen: false, onConfirm: undefined });
  },
}));

// Convenience function for showing alerts from anywhere
export const showAlert = (message: string, onConfirm?: () => void) => {
  useAlertStore.getState().showAlert(message, onConfirm);
};
