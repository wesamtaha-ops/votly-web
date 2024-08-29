'use client';

import styles from './InfoSection.module.css';

const InfoSection = () => {
  return (
    <section className={styles.infoSection}>
      <div className='container'>
        <h2 className={styles.infoTitle}>Share Your Views, Earn Rewards</h2>
        <div className={styles.infoContent}>
          <div className={styles.infoBlock}>
            <img
              src='https://static.thenounproject.com/png/4327865-200.png'
              alt='Impact'
              className={styles.icon}
            />
            <h3 className={styles.infoBlockTitle}>Make an Impact</h3>
            <p className={styles.infoBlockDescription}>
              Your input answers pressing questions and influences key decisions
              that affect societies, citizens, and brands.
            </p>
          </div>
          <div className={styles.infoBlock}>
            <img
              src='https://static.thenounproject.com/png/100220-200.png'
              alt='Difference'
              className={styles.icon}
            />
            <h3 className={styles.infoBlockTitle}>
              See the Difference You Can Make
            </h3>
            <p className={styles.infoBlockDescription}>
              Your opinion matters. Spot the impact of your feedback in
              products, news stories, and more.
            </p>
          </div>
          <div className={styles.infoBlock}>
            <img
              src='https://static.vecteezy.com/system/resources/previews/021/693/717/original/cash-rewards-card-icon-vector.jpg'
              alt='Rewards'
              className={styles.icon}
            />
            <h3 className={styles.infoBlockTitle}>
              Earn Rewards That Matter to You
            </h3>
            <p className={styles.infoBlockDescription}>
              Choose from a variety of rewards, including gift cards, cash
              transfers, and donations to charities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
