'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './FAQ.module.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: 'What is Votly?',
      answer:
        'Votly is a social polling app that allows users to create, discover, and participate in AI-generated and user-created polls, fostering a community for sharing opinions and insights.',
    },
    {
      question: 'How do I create a poll on Votly?',
      answer:
        "To create a poll, simply log into your account, navigate to the 'Create Poll' section, and follow the instructions to set up your poll. You can choose from various question types and customize your poll to suit your needs.",
    },
    {
      question: 'How does the AI-generated content feature work?',
      answer:
        'Our AI technology converts news articles and trending topics into interactive polls, allowing users to engage with content in a new way. The AI-generated polls are tailored to your interests, ensuring a personalized experience.',
    },
    {
      question: "How does Votly's personalized feed algorithm work?",
      answer:
        "Votly's algorithm curates a personalized feed of polls based on your past interactions, preferences, and interests. The more you engage with polls, the better the algorithm understands your preferences.",
    },
    {
      question: 'How can I earn and redeem coins in Votly?',
      answer:
        'You can earn coins by participating in polls, completing surveys, and engaging with the community. Coins can be redeemed for rewards such as gift cards, cash transfers, or donations to charities.',
    },
    {
      question: 'How do I share my polls with friends or on social media?',
      answer:
        "Once you create a poll, you can easily share it with your friends via social media platforms or through a direct link. Simply click on the 'Share' button after publishing your poll.",
    },
    {
      question:
        'Can I use Votly for market research or other types of research?',
      answer:
        'Yes, Votly is an excellent platform for market research. Businesses and researchers can create targeted polls to gather insights from a diverse audience.',
    },
    {
      question: 'How does Votly ensure data privacy and security?',
      answer:
        'Votly takes data privacy and security seriously. We use industry-standard encryption and follow strict privacy policies to protect your data and ensure that it is only used for the purposes you consent to.',
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
            alt='FAQ Illustration'
            width={500}
            height={500}
            className={styles.faqImage}
          />
        </div>
        <div className={styles.accordionContainer}>
          <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
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
        </div>
      </div>
    </section>
  );
};

export default FAQ;
