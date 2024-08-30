"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <img
            src="https://votly.app/public/web/wp-content/themes/Votly-logo-colored.png"
            alt="Votly Logo"
            className={styles.logoImage}
          />
        </Link>
      </div>
      <nav className={styles.nav}>
        <Link href="/surveys" className={styles.navLink}>
          Surveys
        </Link>
        <Link href="/rewards" className={styles.navLink}>
          Rewards
        </Link>
        <Link href="/mobile-verification" className={styles.navLink}>
          mobile verification
        </Link>
        <Link href="/email-verification" className={styles.navLink}>
          email verification
        </Link>

        <Link href="/profile" className={styles.navLink}>
          My Profile
        </Link>

        {!session?.id ? (
          <Link href="/login" className={styles.navLink}>
            Login
          </Link>
        ) : (
          <a href="#" className={styles.navLink} onClick={signOut}>
            Logout
          </a>
        )}
      </nav>
    </header>
  );
};

export default Header;
