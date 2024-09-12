'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl'; // Import translations
import styles from './Header.module.css';

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname() || '/';
  const t = useTranslations('Header'); // Initialize translations
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const switchLocale = (locale) => {
    router.push(pathname, { locale });
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
      <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
        <Link href='/surveys' className={styles.navLink}>
          {t('surveys')} {/* Translated text */}
        </Link>
        <Link href='/rewards' className={styles.navLink}>
          {t('rewards')} {/* Translated text */}
        </Link>
        <Link href='/profile' className={styles.navLink}>
          {t('myProfile')} {/* Translated text */}
        </Link>

        {!session?.id ? (
          <Link href='/login' className={styles.navLink}>
            {t('login')} {/* Translated text */}
          </Link>
        ) : (
          <a
            href='#'
            className={styles.navLink}
            onClick={() => signOut({ callbackUrl: '/' })}>
            {t('logout')} {/* Translated text */}
          </a>
        )}

        {/* Language switcher dropdown */}
        <div className={styles.languageSwitcher}>
          <button className={styles.dropdownButton} onClick={toggleDropdown}>
            {t('language')} {/* Translated text */}
          </button>
          {isDropdownOpen && (
            <ul className={styles.dropdownMenu}>
              <li onClick={() => switchLocale('en')}>English</li>
              <li onClick={() => switchLocale('ar')}>العربية</li>
            </ul>
          )}
        </div>
      </nav>

      {/* Hamburger Menu Button */}
      <button className={styles.hamburger} onClick={toggleMenu}>
        <span className={styles.hamburgerBar}></span>
        <span className={styles.hamburgerBar}></span>
        <span className={styles.hamburgerBar}></span>
      </button>
    </header>
  );
};

export default Header;
