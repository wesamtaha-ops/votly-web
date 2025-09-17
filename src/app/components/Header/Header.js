"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import UserAvatar from "../UserAvatar/UserAvatar";
import { useNavigation } from "../../contexts/NavigationContext";

import { useLocale, useTranslations } from "next-intl"; // Import for translations

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { navigateWithLoading, replaceWithLoading } = useNavigation();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("Header"); // Initialize translations
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const lang = useLocale(); // Get the current locale
  const isArabic = lang === "ar";

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('menu-open');
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('menu-open');
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('menu-open');
    };
  }, [isMenuOpen]);

  // Close menu when route changes
  useEffect(() => {
    closeMenu();
  }, [pathname]);

  const switchLocale = (locale) => {
    try {
      // Construct the full URL with the current path and search parameters
      let params = new URLSearchParams(searchParams.toString());
      let newParams;
      if (isArabic) {
        newParams = pathname.replace("/ar", "");
      } else {
        newParams = pathname.replace("/en", "");
      }

      const newUrl = `/${locale}${newParams}?${params.toString()}`;
      // Replace the current URL with the new locale
      replaceWithLoading(newUrl);
    } catch (error) {
      console.error("Error switching locale:", error);
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

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const handleNavigation = (href) => {
    closeMenu();
    navigateWithLoading(href);
  };

  const isActivePage = (path) => {
    return pathname === `/${lang}${path}` || pathname === `/${lang}${path}/`;
  };

  return (
    <header className={styles.header}>
      {/* Desktop Header Layout */}
      <div className={styles.desktopHeader}>
        <div className={styles.logo}>
          <button 
            onClick={() => navigateWithLoading(`/${lang}/`)}
            className={styles.logoButton}
          >
            <img
              src="https://votly.app/public/web/wp-content/themes/Votly-logo-colored.png"
              alt="Votly Logo"
              className={styles.logoImage}
            />
          </button>
        </div>
        
        <nav className={styles.desktopNav}>
          <button 
            className={`${styles.navLink} ${isActivePage('/surveys') ? styles.active : ''}`}
            onClick={() => navigateWithLoading(`/${lang}/surveys`)}
          >
            {t("surveys")}
          </button>
          <button 
            className={`${styles.navLink} ${isActivePage('/rewards') ? styles.active : ''}`}
            onClick={() => navigateWithLoading(`/${lang}/rewards`)}
          >
            {t("rewards")}
          </button>
          {session?.id && (
            <button 
              className={`${styles.navLink} ${isActivePage('/invite-friends') ? styles.active : ''}`}
              onClick={() => navigateWithLoading(`/${lang}/invite-friends`)}
            >
              {t("inviteFriends")}
            </button>
          )}
          {session?.id && (
            <button 
              className={`${styles.navLink} ${isActivePage('/profile') ? styles.active : ''}`}
              onClick={() => navigateWithLoading(`/${lang}/profile`)}
            >
              {t("myProfile")}
            </button>
          )}
          {!session?.id ? (
            <>
              <button 
                className={`${styles.navLink} ${isActivePage('/register') ? styles.active : ''}`}
                onClick={() => navigateWithLoading(`/${lang}/register`)}
              >
                {t("register")}
              </button>
              <button 
                className={`${styles.navLink} ${isActivePage('/login') ? styles.active : ''}`}
                onClick={() => navigateWithLoading(`/${lang}/login`)}
              >
                {t("login")}
              </button>
            </>
          ) : (
            <button
              className={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                signOut({ callbackUrl: `/${lang}/` });
              }}
            >
              {t("logout")}
            </button>
          )}
        </nav>

        <div className={styles.desktopRightContainer}>
          {session?.id && <UserAvatar />}
          <div className={styles.desktopLanguageSwitcher}>
            <button className={styles.dropdownButton} onClick={toggleDropdown}>
              🌐 {lang == "ar" ? "العربية" : "English"}
            </button>
            {isDropdownOpen && (
              <ul className={styles.dropdownMenu}>
                <li onClick={() => switchLocale("en")}>English</li>
                <li onClick={() => switchLocale("ar")}>العربية</li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Header Layout */}
      <div className={styles.mobileHeader}>
        <button 
          className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span className={styles.hamburgerBar}></span>
          <span className={styles.hamburgerBar}></span>
          <span className={styles.hamburgerBar}></span>
        </button>

        <div className={styles.mobileLogo}>
          <button 
            onClick={() => navigateWithLoading(`/${lang}/`)}
            className={styles.logoButton}
          >
            <img
              src="https://votly.app/public/web/wp-content/themes/Votly-logo-colored.png"
              alt="Votly Logo"
              className={styles.logoImage}
            />
          </button>
        </div>

        <div className={styles.mobileActions}>
          {session?.id && <UserAvatar />}
        </div>
      </div>
      
      {/* Mobile Menu Backdrop */}
      {isMenuOpen && (
        <div className={styles.mobileBackdrop} onClick={closeMenu}></div>
      )}
      
      <nav className={`${styles.mobileNav} ${isMenuOpen ? styles.mobileNavOpen : ""}`} aria-label="Mobile navigation">
        <div className={styles.mobileNavContent}>
          <button 
            className={`${styles.mobileNavLink} ${isActivePage('/surveys') ? styles.active : ''}`}
            onClick={() => handleNavigation(`/${lang}/surveys`)}
          >
            {t("surveys")}
          </button>
          
          <button 
            className={`${styles.mobileNavLink} ${isActivePage('/rewards') ? styles.active : ''}`}
            onClick={() => handleNavigation(`/${lang}/rewards`)}
          >
            {t("rewards")}
          </button>
          
          {session?.id && (
            <button 
              className={`${styles.mobileNavLink} ${isActivePage('/invite-friends') ? styles.active : ''}`}
              onClick={() => handleNavigation(`/${lang}/invite-friends`)}
            >
              {t("inviteFriends")}
            </button>
          )}
          
          {session?.id && (
            <button 
              className={`${styles.mobileNavLink} ${isActivePage('/profile') ? styles.active : ''}`}
              onClick={() => handleNavigation(`/${lang}/profile`)}
            >
              {t("myProfile")}
            </button>
          )}

          {!session?.id ? (
            <>
              <button 
                className={`${styles.mobileNavLink} ${isActivePage('/register') ? styles.active : ''}`}
                onClick={() => handleNavigation(`/${lang}/register`)}
              >
                {t("register")}
              </button>

              <button 
                className={`${styles.mobileNavLink} ${isActivePage('/login') ? styles.active : ''}`}
                onClick={() => handleNavigation(`/${lang}/login`)}
              >
                {t("login")}
              </button>
            </>
          ) : (
            <button
              className={styles.mobileNavLink}
              onClick={(e) => {
                e.preventDefault();
                closeMenu();
                signOut({ callbackUrl: `/${lang}/` });
              }}
            >
              {t("logout")}
            </button>
          )}
          
          <div className={styles.mobileLanguageSection}>
            <button 
              className={styles.mobileLanguageButton}
              onClick={() => switchLocale(lang === "ar" ? "en" : "ar")}
            >
              🌐 {lang === "ar" ? "Switch to English" : "التبديل إلى العربية"}
            </button>
          </div>
        </div>
      </nav>


    </header>
  );
};

export default Header;
