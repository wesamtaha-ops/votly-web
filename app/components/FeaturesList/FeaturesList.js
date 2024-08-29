'use client';

import Image from 'next/image';
import styles from './FeaturesList.module.css';

const FeaturesList = () => {
  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <div className={styles.textContainer}>
          <h2 className={styles.featuresTitle}>
            Unlocking Benefits for Individuals, Corporates, and Governments
          </h2>
          <p className={styles.featuresSubtitle}>
            VOTLY offers a versatile platform that caters to the unique needs of
            individuals, businesses, and government entities, enabling them to
            harness the power of collective intelligence for better
            decision-making and insights.
          </p>
          <ul className={styles.featureItems}>
            <li className={styles.featureItem}>
              <span className={styles.checkmark}>✔</span>
              <strong>Market and Research Tool:</strong> Ideal for market
              research and various studies, empowering users to gather valuable
              data and insights to drive informed decisions.
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkmark}>✔</span>
              <strong>Individuals:</strong> Engage with a diverse community,
              sharing opinions and gaining insights into current trends and
              public sentiment.
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkmark}>✔</span>
              <strong>Corporates:</strong> Conduct efficient market research,
              identify consumer preferences, and boost brand engagement through
              interactive content.
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkmark}>✔</span>
              <strong>Governments:</strong> Gauge public opinion, encourage
              civic participation, and gather insights for data-driven
              decision-making.
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkmark}>✔</span>
              <strong>Collaborative Environment:</strong> Foster partnerships
              between individuals, businesses, and governments to drive
              innovation and positive change.
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkmark}>✔</span>
              <strong>Comprehensive Research Platform:</strong> Combining
              AI-generated content, user-created polls, and advanced analytics,
              VOTLY offers a powerful solution for diverse research needs.
            </li>
          </ul>
        </div>
        <div className={styles.imageContainer}>
          <Image
            src='https://votly.app/images/app.png'
            alt='Votly Mobile Interface'
            width={500}
            height={500}
            className={styles.featureImage}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesList;
