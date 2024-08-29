'use client';

import styles from './Rewards.module.css';

const Rewards = () => {
  return (
    <div className={styles.rewardsContainer}>
      <h2 className={styles.title}>Available Rewards</h2>
      <div className={styles.rewardsGrid}>
        <div className={styles.rewardCard}>
          <h3>$10 Amazon Gift Card</h3>
          <p>1000 Points</p>
          <button className={styles.redeemButton}>Redeem</button>
        </div>
        <div className={styles.rewardCard}>
          <h3>$5 Starbucks Gift Card</h3>
          <p>500 Points</p>
          <button className={styles.redeemButton}>Redeem</button>
        </div>
        <div className={styles.rewardCard}>
          <h3>$5 Starbucks Gift Card</h3>
          <p>500 Points</p>
          <button className={styles.redeemButton}>Redeem</button>
        </div>
        {/* Add more reward cards as needed */}
      </div>
    </div>
  );
};

export default Rewards;
