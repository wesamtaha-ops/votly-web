'use client';

import { useTranslations } from 'next-intl';
import styles from './Features.module.css';
import { FaMoneyBillWave, FaClock, FaUserPlus, FaShieldAlt } from 'react-icons/fa';

const Features = () => {
  const t = useTranslations('Home');

  const features = [
    {
      icon: <FaMoneyBillWave />,
      title: t('feature1Title'),
      description: t('feature1Description'),
    },
    {
      icon: <FaClock />,
      title: t('feature2Title'),
      description: t('feature2Description'),
    },
    {
      icon: <FaUserPlus />,
      title: t('feature3Title'),
      description: t('feature3Description'),
    },
    {
      icon: <FaShieldAlt />,
      title: t('feature4Title'),
      description: t('feature4Description'),
    },
  ];

  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>{t('whyChooseVotly')}</h2>
        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.feature}>
              <div className={styles.iconWrapper}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 