import React from "react";
import styles from "./Dialog.module.css";

export default function Dialog({ open, onClose, title, children, footer }) {
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

        {footer && <div className={styles.actions}>{footer}</div>}
      </div>
    </div>
  );
}
