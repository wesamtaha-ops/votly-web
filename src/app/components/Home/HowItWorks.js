'use client';

import { useTranslations } from 'next-intl';
import { useInView } from 'react-intersection-observer';
import styles from './HowItWorks.module.css';
import { FaUserPlus, FaClipboardList, FaCoins, FaGift } from 'react-icons/fa';

const HowItWorks = () => {
  const t = useTranslations('HowItWorks');
  
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const steps = [
    {
      icon: <FaUserPlus className={styles.stepIcon} />,
      title: t('step1.title'),
      description: t('step1.description'),
    },
    {
      icon: <FaClipboardList className={styles.stepIcon} />,
      title: t('step2.title'),
      description: t('step2.description'),
    },
    {
      icon: <FaCoins className={styles.stepIcon} />,
      title: t('step3.title'),
      description: t('step3.description'),
    },
    {
      icon: <FaGift className={styles.stepIcon} />,
      title: t('step4.title'),
      description: t('step4.description'),
    },
  ];

  return (
    <section className={styles.howItWorks}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t('title')}</h2>
        <p className={styles.subtitle}>{t('subtitle')}</p>
        
        <div className={styles.stepsContainer} ref={ref}>
          {steps.map((step, index) => (
            <div
              key={index}
              className={`${styles.step} ${inView ? styles.animate : ''}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={styles.stepIconWrapper}>
                {step.icon}
                {index < steps.length - 1 && <div className={styles.connector} />}
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 