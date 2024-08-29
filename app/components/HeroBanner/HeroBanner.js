'use client';

import Link from 'next/link';
import styles from './HeroBanner.module.css';

const HeroBanner = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}></div>
      <div className={styles.heroContent}>
        <img
          src='https://votly.app/public/web/logo1.png'
          alt='Hero Image'
          className={styles.heroImage}
        />
        <h1 className={styles.heroTitle}>
          Make Your Voice Heard, Shape the Future
        </h1>
        <p className={styles.heroDescription}>
          Influence the future of society, brands, and the world around you with
          Votly. Share your opinions and earn rewards in return.
        </p>
        <div className={styles.buttons}>
          <Link href='/register' className={styles.ctaButton}>
            Join Us Today
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
