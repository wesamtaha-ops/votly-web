'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import styles from './FeaturesList.module.css';

const FeaturesList = () => {
  const t = useTranslations('FeaturesList');

  const features = [
    { title: t('feature1.title'), description: t('feature1.description') },
    { title: t('feature2.title'), description: t('feature2.description') },
    { title: t('feature3.title'), description: t('feature3.description') },
    { title: t('feature4.title'), description: t('feature4.description') },
    { title: t('feature5.title'), description: t('feature5.description') },
    { title: t('feature6.title'), description: t('feature6.description') },
  ];

  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <div className={styles.textContainer}>
          <h2 className={styles.featuresTitle}>{t('title')}</h2>
          <p className={styles.featuresSubtitle}>{t('subtitle')}</p>
          <ul className={styles.featureItems}>
            {features.map((feature, index) => (
              <li key={index} className={styles.featureItem}>
                <span className={styles.checkmark}>✔</span>
                <strong>{feature.title}:</strong> {feature.description}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.imageContainer}>
          <Image
            src='https://votly.app/images/app.png'
            alt={t('imageAlt')}
            width={500}
            height={500}
            className={styles.featureImage}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesList;
