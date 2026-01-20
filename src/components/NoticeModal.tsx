import { useState } from "react";
import type { Notice } from "../utils/transform";
import styles from "./NoticeModal.module.css";

interface Props {
  visible: boolean;
  list: Notice[];
  onClose: () => void;
}

export default function NoticeModal({ visible, list, onClose }: Props) {
  const [index, setIndex] = useState(0);

  if (!visible || list.length === 0) return null;
  const current = list[index];

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Image notice */}
        {current.img && (
          <img src={current.img} alt="notice" className={styles.img} />
        )}
        
        {/* Title and content */}
        {(current.title || current.content) && (
          <>
            {current.title && <h2 className={styles.title}>{current.title}</h2>}
            {current.content && (
              <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: current.content }}
              />
            )}
          </>
        )}

        {/* Footer buttons */}
        <div className={styles.footer}>
          {list.length > 1 && (
            <>
              <button
                className={styles.btn}
                onClick={() => setIndex((i) => (i - 1 + list.length) % list.length)}
              >
                prev-ရှေ့သို
              </button>
              <button
                className={styles.btn}
                onClick={() => setIndex((i) => (i + 1) % list.length)}
              >
                next-နောက်သို
              </button>
            </>
          )}
          <button className={styles.close} onClick={onClose}>
            Close-ပိတ်မည်။
          </button>
        </div>
      </div>
    </div>
  );
}
