'use client';

import Link from 'next/link';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href='/'>
          <img
            src='https://votly.app/public/web/wp-content/themes/Votly-logo-colored.png'
            alt='Votly Logo'
            className={styles.logoImage}
          />
        </Link>
      </div>
      <nav className={styles.nav}>
        <Link href='/surveys' className={styles.navLink}>
          Surveys
        </Link>
        <Link href='/rewards' className={styles.navLink}>
          Rewards
        </Link>
        <Link href='/profile' className={styles.navLink}>
          My Profile
        </Link>
        <Link href='/login' className={styles.navLink}>
          Logout
        </Link>
      </nav>
    </header>
  );
};

export default Header;
