'use client';

import { useTranslations } from 'next-intl';
import styles from './InfoSection.module.css';
import { FaPaypal, FaGift, FaStar, FaGlobe, FaUsers, FaAward } from 'react-icons/fa';

export default function InfoSection() {
  const t = useTranslations('InfoSection');

  return (
    <section className={styles.infoSection}>
      <div className={styles.container}>
       

        <div className={styles.section}>
          <h2 className={`${styles.sectionTitle} ${styles.rewardsTitle}`}>
            {t('rewardsTitle')}
          </h2>
          <p className={styles.sectionDescription}>
            {t('rewardsDescription')}
          </p>
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <FaPaypal className={styles.icon} />
              <p>{t('rewardsList.cash')}</p>
            </div>
            <div className={styles.card}>
              <FaGift className={styles.icon} />
              <p>{t('rewardsList.giftCards')}</p>
            </div>
            <div className={styles.card}>
              <FaStar className={styles.icon} />
              <p>{t('rewardsList.exclusive')}</p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={`${styles.sectionTitle} ${styles.differenceTitle}`}>
            {t('differenceTitle')}
          </h2>
          <p className={styles.sectionDescription}>
            {t('differenceDescription')}
          </p>
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <FaGlobe className={styles.icon} />
              <p>{t('differenceList.global')}</p>
            </div>
            <div className={styles.card}>
              <FaUsers className={styles.icon} />
              <p>{t('differenceList.surveys')}</p>
            </div>
            <div className={styles.card}>
              <FaAward className={styles.icon} />
              <p>{t('differenceList.bonus')}</p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={`${styles.sectionTitle} ${styles.testimonialsTitle}`}>
            {t('testimonialsTitle')}
          </h2>
     
          <div className={styles.testimonialGrid}>
            <div className={styles.testimonialCard}>
              <p className={styles.testimonialText}>
                {t('testimonials.testimonial1.text')}
              </p>
              <div className={styles.testimonialAuthor}>
                {t('testimonials.testimonial1.author')}
              </div>
            </div>
            <div className={styles.testimonialCard}>
              <p className={styles.testimonialText}>
                {t('testimonials.testimonial2.text')}
              </p>
              <div className={styles.testimonialAuthor}>
                {t('testimonials.testimonial2.author')}
              </div>
            </div>
           
          </div>
        </div>
      </div>
    </section>
  );
}
