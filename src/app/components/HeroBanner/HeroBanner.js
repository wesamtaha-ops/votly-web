'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import styles from './HeroBanner.module.css';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const HeroBanner = () => {
  const t = useTranslations('HeroBanner');
  const { data: session } = useSession();

  return (
    <section className={styles.hero}>
      <div className={styles.heroBackground}>
        <div className={styles.gradientOverlay}></div>
        
        <svg className={styles.backgroundPattern} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            {/* Bar Chart Pattern */}
         

            {/* Line Chart Pattern */}
            <pattern id="lineChart" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M0 40 L15 20 L30 35 L45 15 L60 30" 
                    stroke="rgba(255,255,255,0.07)" 
                    fill="none" 
                    strokeWidth="2">
                <animate attributeName="d" 
                         values="M0 40 L15 20 L30 35 L45 15 L60 30;
                                M0 30 L15 35 L30 20 L45 40 L60 25;
                                M0 40 L15 20 L30 35 L45 15 L60 30" 
                         dur="5s" 
                         repeatCount="indefinite" />
              </path>
            </pattern>

         

            {/* Scatter Plot Pattern */}
            <pattern id="scatterPlot" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="rgba(255,255,255,0.05)"/>
              <circle cx="40" cy="20" r="2" fill="rgba(255,255,255,0.07)"/>
              <circle cx="20" cy="40" r="2" fill="rgba(255,255,255,0.05)"/>
              <circle cx="50" cy="30" r="2" fill="rgba(255,255,255,0.07)"/>
              <circle cx="30" cy="50" r="2" fill="rgba(255,255,255,0.05)"/>
            </pattern>
          </defs>

          {/* Apply Patterns */}
          <rect width="100%" height="100%" fill="url(#barChart)" />
          <rect width="100%" height="100%" fill="url(#pieChart)" />
          <rect width="100%" height="100%" fill="url(#scatterPlot)" />

          {/* Floating Analytics Icons */}
          <g className={styles.floatingAnalytics}>
            {/* Animated Bar Chart */}
            <g transform="translate(10,10) scale(0.15)">
              <rect width="20" height="60" x="0" y="40" fill="rgba(255,255,255,0.1)">
                <animate attributeName="height" values="60;90;60" dur="2s" repeatCount="indefinite" />
              </rect>
              <rect width="20" height="80" x="30" y="20" fill="rgba(255,255,255,0.1)">
                <animate attributeName="height" values="80;40;80" dur="2.5s" repeatCount="indefinite" />
              </rect>
              <rect width="20" height="40" x="60" y="60" fill="rgba(255,255,255,0.1)">
                <animate attributeName="height" values="40;70;40" dur="3s" repeatCount="indefinite" />
              </rect>
            </g>

            {/* Animated Line Graph */}
            <g transform="translate(60,60) scale(0.15)" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4">
              <path d="M0 50 Q25 20 50 50 T100 50">
                <animate attributeName="d" 
                         values="M0 50 Q25 20 50 50 T100 50;
                                M0 50 Q25 80 50 50 T100 50;
                                M0 50 Q25 20 50 50 T100 50" 
                         dur="4s" 
                         repeatCount="indefinite" />
              </path>
            </g>
          </g>
        </svg>
      </div>

      <motion.div
        className={styles.heroContent}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}>
        <motion.img
          src='https://votly.app/public/web/logo1.png'
          alt={t('heroImageAlt')}
          className={styles.heroImage}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        <motion.h1
          className={styles.heroTitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}>
          {t('title')}
        </motion.h1>

        <motion.p
          className={styles.heroDescription}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}>
          {t('description')}
        </motion.p>

        <motion.div
          className={styles.buttons}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}>
          {!session?.id ? (
            <>
              <Link href='/register' className={styles.ctaButton}>
                {t('ctaButton')}
                <FaArrowRight className={styles.buttonIcon} />
              </Link>

              <Link href='/login' className={styles.ctaButton2}>
                {t('ctaButtonLogin')}
              </Link>
            </>
          ) : (
            <Link href='/surveys' className={styles.ctaButton}>
              {t('ctaButtonDashboard')}
              <FaArrowRight className={styles.buttonIcon} />
            </Link>
          )}
        </motion.div>
      </motion.div>

      <div className={styles.heroShape}></div>
    </section>
  );
};

export default HeroBanner;
