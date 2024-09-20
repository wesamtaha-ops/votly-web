'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import styles from './Header.module.css';

import { useLocale, useTranslations } from 'next-intl'; // Import for translations

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('Header'); // Initialize translations
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const lang = useLocale(); // Get the current locale
  const isArabic = lang === 'ar';

  const switchLocale = (locale) => {
    try {
      // Construct the full URL with the current path and search parameters
      let params = new URLSearchParams(searchParams.toString());
      let newParams;
      if (isArabic) {
        newParams = pathname.replace('/ar', '');
      } else {
        newParams = pathname.replace('/en', '');
      }

      const newUrl = `/${locale}${newParams}?${params.toString()}`;
      console.log('newUrl', newUrl);
      // Replace the current URL with the new locale
      router.replace(newUrl);
    } catch (error) {
      console.error('Error switching locale:', error);
    }

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
        <Link href={`/${lang}/`}>
          <img
            src='https://votly.app/public/web/wp-content/themes/Votly-logo-colored.png'
            alt='Votly Logo'
            className={styles.logoImage}
          />
        </Link>
      </div>
      <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
        <Link href={`/${lang}/surveys`} className={styles.navLink}>
          {t('surveys')}
        </Link>
        <Link href={`/${lang}/rewards`} className={styles.navLink}>
          {t('rewards')}
        </Link>
        {session?.id && (
          <Link href={`/${lang}/profile`} className={styles.navLink}>
            {t('myProfile')}
          </Link>
        )}

        {!session?.id ? (
          <Link href={`/${lang}/login`} className={styles.navLink}>
            {t('login')}
          </Link>
        ) : (
          <a
            href='#'
            className={styles.navLink}
            onClick={() => signOut({ callbackUrl: `/${lang}/` })}>
            {t('logout')}
          </a>
        )}

        {/* Language switcher dropdown */}
        <div className={styles.languageSwitcher}>
          <button className={styles.dropdownButton} onClick={toggleDropdown}>
            🌐 {lang == 'ar' ? 'العربية' : 'English'}
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
