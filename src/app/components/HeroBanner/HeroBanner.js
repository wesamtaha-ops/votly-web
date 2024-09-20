'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import styles from './HeroBanner.module.css';

const HeroBanner = () => {
  const t = useTranslations('HeroBanner');

  return (
    <section className={styles.hero}>
      <div className={styles.overlay}></div>
      <div className={styles.heroContent}>
        <img
          src='https://votly.app/public/web/logo1.png'
          alt={t('heroImageAlt')}
          className={styles.heroImage}
        />
        <h1 className={styles.heroTitle}>{t('title')}</h1>
        <p className={styles.heroDescription}>{t('description')}</p>
        <div className={styles.buttons}>
          <Link href='/register' className={styles.ctaButton}>
            {t('ctaButton')}
          </Link>
      
          <Link href='/register' className={styles.ctaButton2}>
            {t('ctaButtonLogin')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
