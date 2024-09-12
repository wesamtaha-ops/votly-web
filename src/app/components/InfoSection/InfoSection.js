'use client';

import { useTranslations } from 'next-intl';
import styles from './InfoSection.module.css';

const InfoSection = () => {
  const t = useTranslations('InfoSection');

  return (
    <section className={styles.infoSection}>
      <div className='container'>
        <h2 className={styles.infoTitle}>{t('title')}</h2>
        <div className={styles.infoContent}>
          <div className={styles.infoBlock}>
            <img
              src='https://static.thenounproject.com/png/4327865-200.png'
              alt={t('impactAlt')}
              className={styles.icon}
            />
            <h3 className={styles.infoBlockTitle}>{t('impactTitle')}</h3>
            <p className={styles.infoBlockDescription}>
              {t('impactDescription')}
            </p>
          </div>
          <div className={styles.infoBlock}>
            <img
              src='https://static.thenounproject.com/png/100220-200.png'
              alt={t('differenceAlt')}
              className={styles.icon}
            />
            <h3 className={styles.infoBlockTitle}>{t('differenceTitle')}</h3>
            <p className={styles.infoBlockDescription}>
              {t('differenceDescription')}
            </p>
          </div>
          <div className={styles.infoBlock}>
            <img
              src='https://static.vecteezy.com/system/resources/previews/021/693/717/original/cash-rewards-card-icon-vector.jpg'
              alt={t('rewardsAlt')}
              className={styles.icon}
            />
            <h3 className={styles.infoBlockTitle}>{t('rewardsTitle')}</h3>
            <p className={styles.infoBlockDescription}>
              {t('rewardsDescription')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
