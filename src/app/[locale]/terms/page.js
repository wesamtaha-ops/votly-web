'use client';

import { useTranslations } from 'next-intl';
import styles from './Terms.module.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

export default function TermsOfUse() {
  const t = useTranslations('TermsOfUse');

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.intro}>{t('intro')}</p>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('account.title')}</h2>
            <p>{t('account.description')}</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('eligibility.title')}</h2>
            <p>{t('eligibility.description')}</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('payments.title')}</h2>
            <p>{t('payments.description')}</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('privacy.title')}</h2>
            <p>{t('privacy.description')}</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('changes.title')}</h2>
            <p>{t('changes.description')}</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('legal.title')}</h2>
            <p>{t('legal.description')}</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('ip.title')}</h2>
            <p>{t('ip.description')}</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('warranties.title')}</h2>
            <p>{t('warranties.description')}</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('thirdParty.title')}</h2>
            <p>{t('thirdParty.description')}</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('security.title')}</h2>
            <p>{t('security.description')}</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('liability.title')}</h2>
            <p>{t('liability.description')}</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('compliance.title')}</h2>
            <p>{t('compliance.description')}</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('miscellaneous.title')}</h2>
            <p>{t('miscellaneous.description')}</p>
          </section>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
} 