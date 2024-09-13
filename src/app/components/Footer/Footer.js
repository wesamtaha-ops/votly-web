'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import styles from './Footer.module.css';

const Footer = () => {
  const t = useTranslations('Footer');

  // Create the array manually from individual link keys
  const links = [
    { href: t('link1.href'), title: t('link1.title') },
    { href: t('link2.href'), title: t('link2.title') },
    { href: t('link3.href'), title: t('link3.title') },
    { href: t('link4.href'), title: t('link4.title') },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3
              style={{
                textAlign: 'center',
              }}>
              {t('title')}
            </h3>
            <p>{t('description')}</p>
          </div>
          <div className={styles.footerSection}>
            <h4>{t('usefulLinks')}</h4>
            <ul className={styles.footerLinks}>
              {links.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>{link.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h4
              style={{
                textAlign: 'center',
              }}>
              {t('downloadApp')}
            </h4>
            <div className={styles.appLinks}>
              <Link href='https://play.google.com/store/apps/details?id=com.example'>
                <img
                  src='https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg'
                  alt={t('googlePlay')}
                  className={styles.appIcon}
                />
              </Link>
              <Link href='https://apps.apple.com/us/app/example/id123456789'>
                <img
                  src='https://upload.wikimedia.org/wikipedia/commons/1/11/Available_on_the_App_Store_%28gray%29.png'
                  alt={t('appStore')}
                  className={styles.appIcon}
                />
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
