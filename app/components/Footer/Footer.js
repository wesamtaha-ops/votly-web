'use client';

import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>VOTLY</h3>
            <p>
              Votly is a social app on a mission to bring the polling industry
              into the 21st century. Join us and make your voice heard.
            </p>
          </div>
          <div className={styles.footerSection}>
            <h4>Useful Links</h4>
            <ul className={styles.footerLinks}>
              <li>
                <Link href='/about'>About Us</Link>
              </li>
              <li>
                <Link href='/cookies'>Cookies Policy</Link>
              </li>
              <li>
                <Link href='/privacy'>Privacy Policy</Link>
              </li>
              <li>
                <Link href='/terms'>Terms and Conditions</Link>
              </li>
          
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h4>Download Our App</h4>
            <div className={styles.appLinks}>
              <Link href='https://play.google.com/store/apps/details?id=com.example'>
                <img
                  src='https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg'
                  alt='Google Play'
                  className={styles.appIcon}
                />
              </Link>
              <Link href='https://apps.apple.com/us/app/example/id123456789'>
                <img
                  src='https://upload.wikimedia.org/wikipedia/commons/1/11/Available_on_the_App_Store_%28gray%29.png'
                  alt='App Store'
                  className={styles.appIcon}
                />
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2024 The Blockchain Labs. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
