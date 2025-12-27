import styles from './Footer.module.css';

// Import social icons
import facebookIcon from '../assets/icons/social-facebook.png';
import xIcon from '../assets/icons/social-x.png';
import instagramIcon from '../assets/icons/social-instagram.png';
import linkedinIcon from '../assets/icons/social-linkedin.png';
import youtubeIcon from '../assets/icons/social-youtube.png';
import pinterestIcon from '../assets/icons/social-pinterest.png';

// Import license icons
import iovationIcon from '../assets/icons/license-iovation.png';
import threatmetrixIcon from '../assets/icons/license-threatmetrix.png';
import goddaddyIcon from '../assets/icons/license-godaddy.png';

const Footer = () => {
  const socialLinks = [
    { name: 'facebook', icon: facebookIcon, url: '#' },
    { name: 'x', icon: xIcon, url: '#' },
    { name: 'instagram', icon: instagramIcon, url: '#' },
    { name: 'linkedin', icon: linkedinIcon, url: '#' },
    { name: 'youtube', icon: youtubeIcon, url: '#' },
    { name: 'pinterest', icon: pinterestIcon, url: '#' },
  ];

  const licenseCerts = [
    { name: 'iovation', icon: iovationIcon },
    { name: 'threatmetrix', icon: threatmetrixIcon },
    { name: 'godaddy', icon: goddaddyIcon },
  ];

  return (
    <footer className={styles.footer}>
      {/* Social Links Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>跟着我们</h3>
        <div className={styles.socialGrid}>
          {socialLinks.map(link => (
            <a
              key={link.name}
              href={link.url}
              className={styles.socialLink}
              title={link.name}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={link.icon}
                alt={link.name}
                className={styles.socialIcon}
              />
            </a>
          ))}
        </div>
      </div>

      {/* License Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>营业执照</h3>
        <div className={styles.licenseGrid}>
          {licenseCerts.map(cert => (
            <div key={cert.name} className={styles.licenseCert}>
              <img
                src={cert.icon}
                alt={cert.name}
                className={styles.certIcon}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Copyright Section */}
      <div className={styles.copyright}>
        <p>© 2025 12Play</p>
        <p className={styles.ageRestriction}>18+</p>
      </div>
    </footer>
  );
};

export default Footer;
