import styles from './FeatureCards.module.css';
import vipIcon from '../assets/icons/feature-vip.png';
import controllerIcon from '../assets/icons/feature-controller.png';
import trustIcon from '../assets/icons/feature-trustplay.png';
import supportIcon from '../assets/icons/feature-support.png';

export default function FeatureCards() {
  const features = [
    {
      id: 'vip',
      icon: vipIcon,
      title: 'VIP Program',
      subtitle: 'VIP Account Manager',
      description: 'Personal assistant and premium privileges',
    },
    {
      id: 'providers',
      icon: controllerIcon,
      title: 'Top Providers',
      subtitle: 'Leading Service Providers',
      description: 'Games from CMD, Pragmatic Play, Playtech and more',
    },
    {
      id: 'trust',
      icon: trustIcon,
      title: 'Trust Play',
      subtitle: 'Safe & Fair',
      description: 'Secure transactions • Fair games • Peace of mind',
    },
    {
      id: 'support',
      icon: supportIcon,
      title: '24/7 Support',
      subtitle: 'Round the Clock Support',
      description: 'Chat with our service team anytime via Live Chat',
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.scrollWrapper}>
        {features.map((feature) => (
          <div key={feature.id} className={styles.card}>
            <img src={feature.icon} alt={feature.title} className={styles.icon} />
            <div className={styles.title}>{feature.title}</div>
            <div className={styles.subtitle}>{feature.subtitle}</div>
            <div className={styles.description}>{feature.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
