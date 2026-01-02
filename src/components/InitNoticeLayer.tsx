import { useEffect, useState } from "react";
import NoticeModal from "./NoticeModal";
import type { Notice } from "../utils/transform";

interface Props {
  notices: Notice[];
}

export default function InitNoticeLayer({ notices }: Props) {
  const [visible, setVisible] = useState(false);
  const [filtered, setFiltered] = useState<Notice[]>([]);

  useEffect(() => {
    if (!Array.isArray(notices)) return;
    const showList = notices.filter((n) => n.tan == 1); // Only show notices with is_tan=1
    const now = Date.now();

    const toShow = showList.filter((n) => {
      if (n.repeat_tan === 1) return true; // Can repeat
      const last = localStorage.getItem(`notice_${n.id}_read`);
      return !last || now - parseInt(last) > 24 * 60 * 60 * 1000; // Show again after 1 day
    });

    if (toShow.length > 0) {
      setFiltered(toShow);
      setVisible(true);
    }
  }, [notices]);

  const handleClose = () => {
    filtered.forEach((n) => localStorage.setItem(`notice_${n.id}_read`, String(Date.now())));
    setVisible(false);
  };

  return (
    <NoticeModal visible={visible} list={filtered} onClose={handleClose} />
  );
}
