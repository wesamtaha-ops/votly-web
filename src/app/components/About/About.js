'use client';

import { useTranslations } from 'next-intl';
import styles from './About.module.css';
import { FaUsers, FaChartLine, FaHandshake, FaGift, FaArrowRight } from 'react-icons/fa';
import { HeroPattern, HeroBlobs } from './HeroPattern';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const About = () => {
  const t = useTranslations('About');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const features = [
    {
      icon: <FaUsers />,
      title: t('communityTitle'),
      description: t('communityDesc')
    },
    {
      icon: <FaChartLine />,
      title: t('insightsTitle'),
      description: t('insightsDesc')
    },
    {
      icon: <FaHandshake />,
      title: t('partnershipTitle'),
      description: t('partnershipDesc')
    },
    {
      icon: <FaGift />,
      title: t('rewardsTitle'),
      description: t('rewardsDesc')
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className={styles.aboutContainer}>
      <section className={styles.heroSection}>
        
        {isClient && (
          <AnimatePresence>
            <motion.div
              className={styles.heroContent}
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.h1 
                className={styles.heroTitle}
                variants={itemVariants}
              >
                {t('heroTitle')}
              </motion.h1>

              <motion.p
                className={styles.heroSubtitle}
                variants={itemVariants}
              >
                {t('heroSubtitle')}
              </motion.p>

           

              
            </motion.div>
          </AnimatePresence>
        )}
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className={styles.featuresSection}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>{t('featuresTitle')}</h2>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIconWrapper}>
                  {feature.icon}
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section with Animation */}
      <section className={styles.statsSection}>
        <div className={styles.statsPattern} />
        <div className={styles.sectionContainer}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>100K+</h3>
              <p className={styles.statLabel}>{t('activeUsers')}</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>500+</h3>
              <p className={styles.statLabel}>{t('surveys')}</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>1M+</h3>
              <p className={styles.statLabel}>{t('responses')}</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>50+</h3>
              <p className={styles.statLabel}>{t('partners')}</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About; 