import { useMemo } from 'react';
import styles from './ContactSection.module.css';

interface Contact {
  id?: string;
  name?: string;
  value?: string;
  type?: string;
  [key: string]: any;
}

interface ContactSectionProps {
  contacts?: Contact[];
}

export default function ContactSection({ contacts = [] }: ContactSectionProps) {
  const displayContacts = useMemo(() => {
    return contacts.slice(0, 4); // Show first 4 contact methods
  }, [contacts]);

  if (!displayContacts.length) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>📞 Contact Us</h3>
        <div className={styles.contactList}>
          <div className={styles.contactItem}>
            <span className={styles.label}>💬 Live Chat:</span>
            <span className={styles.value}>Available 24/7</span>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.label}>📧 Email:</span>
            <span className={styles.value}>support@RedCow.com</span>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.label}>📱 Phone:</span>
            <span className={styles.value}>24/7 Support</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>📞 Contact Us</h3>
      <div className={styles.contactList}>
        {displayContacts.map((contact) => (
          <div key={contact.id || Math.random()} className={styles.contactItem}>
            <span className={styles.label}>{contact.name || 'Contact'}:</span>
            <span className={styles.value}>{contact.value || 'N/A'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
