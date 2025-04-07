'use client';

import { useTranslations } from 'next-intl';
import styles from './Privacy.module.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

export default function PrivacyPolicy() {
  const t = useTranslations('PrivacyPolicy');

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.intro}>{t('intro')}</p>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('userRights.title')}</h2>
            <ul className={styles.list}>
              <li>{t('userRights.informed')}</li>
              <li>{t('userRights.access')}</li>
              <li>{t('userRights.cancel')}</li>
              <li>{t('userRights.correct')}</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('infoCollection.title')}</h2>
            <h3 className={styles.subtitle}>{t('infoCollection.nonPersonal.title')}</h3>
            <p>{t('infoCollection.nonPersonal.description')}</p>
            <h3 className={styles.subtitle}>{t('infoCollection.personal.title')}</h3>
            <p>{t('infoCollection.personal.description')}</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('infoUsage.title')}</h2>
            <ul className={styles.list}>
              <li>{t('infoUsage.communication')}</li>
              <li>{t('infoUsage.verification')}</li>
              <li>{t('infoUsage.support')}</li>
              <li>{t('infoUsage.improvement')}</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('dataSharing.title')}</h2>
            <ul className={styles.list}>
              <li>{t('dataSharing.outsourcing')}</li>
              <li>{t('dataSharing.publicForums')}</li>
              <li>{t('dataSharing.legal')}</li>
              <li>{t('dataSharing.marketing')}</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('security.title')}</h2>
            <p>{t('security.responsibility')}</p>
            <p>{t('security.measures')}</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('contact.title')}</h2>
            <p>{t('contact.description')}</p>
          </section>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
} 