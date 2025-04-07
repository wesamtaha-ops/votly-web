'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import styles from './FAQ.module.css';
import { FaArrowRight, FaQuestionCircle } from 'react-icons/fa';

const FAQ = () => {
  const t = useTranslations('FAQ');
  const [activeIndex, setActiveIndex] = useState(null);
  const lang = useLocale();
  const isArabic = lang === 'ar';

  const faqs = [
    {
      question: t('faq1.question'),
      answer: t('faq1.answer')
    },
    {
      question: t('faq2.question'),
      answer: t('faq2.answer')
    },
    {
      question: t('faq3.question'),
      answer: t('faq3.answer')
    },
    {
      question: t('faq4.question'),
      answer: t('faq4.answer')
    },
    {
      question: t('faq5.question'),
      answer: t('faq5.answer')
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className={styles.faqSection}>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <Image
            src='https://votly.app/public/web/wp-content/uploads/new/votly-explore.png'
            alt={t('imageAlt')}
            width={500}
            height={500}
            className={styles.faqImage}
          />
        </div>
        <div className={styles.accordionContainer}>
          <h2 className={styles.faqTitle}>{t('title')}</h2>
          <div className={styles.accordion}>
            {faqs.map((faq, index) => (
              <div key={index} className={styles.accordionItem}>
                <button
                  className={styles.accordionButton}
                  onClick={() => toggleAccordion(index)}>
                  {faq.question}
                  <span className={styles.accordionIcon}>
                    {activeIndex === index ? '▲' : '▼'}
                  </span>
                </button>
                <div
                  className={`${styles.accordionContent} ${
                    activeIndex === index ? styles.active : ''
                  }`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.ctaSection}>
            <h3 className={styles.ctaTitle}>{t('ctaTitle')}</h3>
            <p className={styles.ctaDescription}>
              {t('ctaDescription')}
            </p>
            <Link href="/register" className={styles.ctaButton}>
              {t('ctaButton')}
              <FaArrowRight className={styles.buttonIcon} />
            </Link>
          </div>
{/* 
          <div className={styles.helpSection}>
            <h3 className={styles.helpTitle}>{t('helpTitle')}</h3>
            <p className={styles.helpDescription}>
              {t('helpDescription')}
            </p>
            <Link href="/contact" className={styles.helpButton}>
              {t('contactButton')}
              <FaQuestionCircle className={styles.buttonIcon} />
            </Link>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
