import { useMemo } from 'react';
import styles from './NoticeSection.module.css';

interface Notice {
  id?: string;
  title?: string;
  content?: string;
  [key: string]: any;
}

interface NoticeSectionProps {
  notices?: Notice[];
}

export default function NoticeSection({ notices = [] }: NoticeSectionProps) {
  const displayNotices = useMemo(() => {
    return notices.slice(0, 3); // Show first 3 notices
  }, [notices]);

  if (!displayNotices.length) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>📢 Notices</h3>
      <div className={styles.noticeList}>
        {displayNotices.map((notice) => (
          <div key={notice.id || Math.random()} className={styles.noticeItem}>
            <div className={styles.noticeTitle}>{notice.title || 'Notice'}</div>
            <div className={styles.noticeContent}>
              {notice.content || notice.description || 'No content'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
