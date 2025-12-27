import styles from './FeatureCards.module.css';

export default function FeatureCards() {
  const features = [
    {
      id: 'vip',
      icon: '/src/assets/icons/feature-vip.png',
      title: 'VIP Program',
      subtitle: 'VIP Account Manager',
      description: 'Personal assistant and premium privileges',
    },
    {
      id: 'providers',
      icon: '/src/assets/icons/feature-controller.png',
      title: 'Top Providers',
      subtitle: 'Leading Service Providers',
      description: 'Games from CMD, Pragmatic Play, Playtech and more',
    },
    {
      id: 'trust',
      icon: '/src/assets/icons/feature-trustplay.png',
      title: 'Trust Play',
      subtitle: 'Safe & Fair',
      description: 'Secure transactions • Fair games • Peace of mind',
    },
    {
      id: 'support',
      icon: '/src/assets/icons/feature-support.png',
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
