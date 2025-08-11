"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import styles from "./Header.module.css";
import UserAvatar from "../UserAvatar/UserAvatar";

import { useLocale, useTranslations } from "next-intl"; // Import for translations

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("Header"); // Initialize translations
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const lang = useLocale(); // Get the current locale
  const isArabic = lang === "ar";

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
      router.replace(newUrl);
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
    router.push(href);
  };

  const isActivePage = (path) => {
    return pathname === `/${lang}${path}` || pathname === `/${lang}${path}/`;
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href={`/${lang}/`}>
          <img
            src="https://votly.app/public/web/wp-content/themes/Votly-logo-colored.png"
            alt="Votly Logo"
            className={styles.logoImage}
          />
        </Link>
      </div>
      <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}>
        <button 
          className={`${styles.navLink} ${isActivePage('/surveys') ? styles.active : ''}`}
          onClick={() => handleNavigation(`/${lang}/surveys`)}
        >
          {t("surveys")}
        </button>
        <button 
          className={`${styles.navLink} ${isActivePage('/rewards') ? styles.active : ''}`}
          onClick={() => handleNavigation(`/${lang}/rewards`)}
        >
          {t("rewards")}
        </button>
        {session?.id && (
          <button 
            className={`${styles.navLink} ${isActivePage('/invite-friends') ? styles.active : ''}`}
            onClick={() => handleNavigation(`/${lang}/invite-friends`)}
          >
            {t("inviteFriends")}
          </button>
        )}
        {session?.id && (
          <button 
            className={`${styles.navLink} ${isActivePage('/profile') ? styles.active : ''}`}
            onClick={() => handleNavigation(`/${lang}/profile`)}
          >
            {t("myProfile")}
          </button>
        )}

        {!session?.id ? (
          <>
            <button 
              className={`${styles.navLink} ${isActivePage('/register') ? styles.active : ''}`}
              onClick={() => handleNavigation(`/${lang}/register`)}
            >
              {t("register")}
            </button>

            <button 
              className={`${styles.navLink} ${isActivePage('/login') ? styles.active : ''}`}
              onClick={() => handleNavigation(`/${lang}/login`)}
            >
              {t("login")}
            </button>
          </>
        ) : (
          <>
            <button
              className={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                closeMenu();
                signOut({ callbackUrl: `/${lang}/` });
              }}
            >
              {t("logout")}
            </button>
          </>
        )}


      </nav>

      {/* Right Side Container */}
      <div className={styles.rightContainer}>
        {/* User Avatar - only show if logged in */}
        {session?.id && <UserAvatar />}

        {/* Language switcher dropdown */}
        <div className={styles.languageSwitcher}>
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

        {/* Hamburger Menu Button */}
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
      </div>
    </header>
  );
};

export default Header;
