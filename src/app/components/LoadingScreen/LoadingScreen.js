'use client';

import { useTranslations } from 'next-intl';
import styles from './LoadingScreen.module.css';

const LoadingScreen = ({ isVisible = false }) => {
  const t = useTranslations('ProfileCompletionForm');

  if (!isVisible) return null;

  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
        </div>
        <p className={styles.loadingText}>{t('loading')}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
