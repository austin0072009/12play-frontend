import { useAlertStore } from '../store/alert';
import AlertModal from './AlertModal';

export default function GlobalAlert() {
  const { message, isOpen, onConfirm, closeAlert } = useAlertStore();

  const handleClose = () => {
    closeAlert();
    if (onConfirm) {
      onConfirm();
    }
  };

  if (!isOpen) return null;

  return <AlertModal message={message} onClose={handleClose} />;
}
