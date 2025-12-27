import React from "react";
import styles from "./Dialog.module.css";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string | React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Dialog({ open, onClose, title, children, footer }: DialogProps) {
  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <button className={styles.close} onClick={onClose}>
          &times;
        </button>

        {title && <div className={styles.header}>{title}</div>}

        <div className={styles.body}>{children}</div>

        {footer ? (
          <div className={styles.actions}>{footer}</div>
        ) : (
          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.5rem 1.5rem',
                background: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
