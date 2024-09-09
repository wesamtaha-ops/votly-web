'use client';
import { useState, useEffect } from 'react';
import styles from './Rewards.module.css';
import { useSession } from 'next-auth/react';
import { callApi } from '../../../helper';
import Swal from 'sweetalert2';

const Rewards = () => {
  const { data: session } = useSession();
  const userToken = session?.id;
  const [userCountryCode, setUserCountryCode] = useState(
    session?.user?.country_id,
  );
  const [rewards, setRewards] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [showRewards, setShowRewards] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([
    { id: 1, name: 'Fashion & Accessories' },
    { id: 2, name: 'Jewellery' },
    { id: 3, name: 'Kids & Fun' },
    { id: 4, name: 'Beauty & Cosmetics' },
    { id: 5, name: 'Mobile Recharge' },
    { id: 6, name: 'Restaurants & Cafes' },
    { id: 7, name: 'Hotels & Travel' },
    { id: 8, name: 'Spas & Fitness' },
    { id: 9, name: 'Experiences & Entertainment' },
    { id: 10, name: 'Electronics' },
    { id: 11, name: 'Hypermarkets' },
    { id: 12, name: 'Cinemas' },
    { id: 13, name: 'Shopping Malls' },
    { id: 14, name: 'Hobbies & More' },
    { id: 15, name: 'Sportswear & Equipment' },
    { id: 16, name: 'Gaming' },
    { id: 17, name: 'Software Subscriptions' },
    { id: 18, name: 'Online Shopping' },
    { id: 19, name: 'Food Delivery' },
    { id: 20, name: 'Home & Garden' },
    { id: 21, name: 'Digital Entertainment' },

    // Add more categories based on your data
  ]);

  const minimum_points_to_redeem = rewards?.[0]?.minimum_points_to_redeem;
  const point_value_in_dollars = rewards?.[0]?.point_value_in_dollars;
  const usedCurrency = rewards?.[0]?.country_currency;

  async function fetchData() {
    const response = await callApi({
      type: 'get',
      url: 'order',
      userToken: userToken,
    });

    if (response.status == 200) {
      setRewards(response.data);
    }
  }

  function handleRedeem() {
    Swal.fire({
      title: 'Do you want to redeem?',
      showCancelButton: true,
      confirmButtonText: 'Redeem',
      confirmButtonColor: '#017bfe',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Redeemed!', '', 'success');
      } else if (result.isDenied) {
        Swal.fire('No redeem', '', 'info');
      }
    });
  }

  // Separate featured and non-featured rewards
  const featuredRewards = rewards.filter((reward) => reward.featured === 1);
  const nonFeaturedRewards = rewards.filter((reward) => reward.featured === 0);

  useEffect(() => {
    if (
      session?.user?.country_id !== 188 &&
      session?.user?.country_id !== 227
    ) {
      setShowRewards(false);
    } else {
      fetchData();
      setUserPoints(session?.user?.num_points);
      setShowRewards(true);
    }
  }, [userToken]);

  useEffect(() => {
    if (point_value_in_dollars > 0 && userPoints > 0) {
      setUserBalance(userPoints * point_value_in_dollars);
    }
  }, [point_value_in_dollars]);

  // Filter rewards based on the selected category
  const filteredFeaturedRewards = featuredRewards.filter((reward) =>
    selectedCategory ? reward.category_id === parseInt(selectedCategory) : true,
  );

  const filteredNonFeaturedRewards = nonFeaturedRewards.filter((reward) =>
    selectedCategory ? reward.category_id === parseInt(selectedCategory) : true,
  );

  return (
    <div className={styles.rewardsContainer}>
      <div className={styles.balanceBanner}>
        <h2>
          Your Balance: {usedCurrency} {userBalance.toFixed(2)}{' '}
        </h2>
        {showRewards && (
          <h5 style={{ foontWeight: 'light', marginTop: 10 }}>
            Minimum Points required {minimum_points_to_redeem} Points
          </h5>
        )}
      </div>
      {showRewards ? (
        <>
          {/* Category Filter Dropdown */}
          <div className={styles.filterContainer}>
            <label htmlFor='categoryFilter' className={styles.filterLabel}>
              Filter by Category:
            </label>
            <select
              id='categoryFilter'
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.filterSelect}>
              <option value=''>All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <h2 className={styles.title}>Choose your Gift</h2>

          {/* Featured Rewards */}
          {filteredFeaturedRewards.length > 0 && (
            <div>
              <h3 className={styles.featuredTitle}>Featured Rewards</h3>
              <div className={styles.rewardsGrid}>
                {filteredFeaturedRewards.map((reward) => (
                  <div
                    key={reward.id}
                    className={styles.rewardCard}
                    style={{ backgroundColor: '#fffeef' }} // Light gold background
                  >
                    <img
                      src={reward.brand_image}
                      alt={reward.brand_en}
                      className={styles.rewardImage}
                    />
                    <h3>{reward.brand_en}</h3>
                    <p className={styles.rewardPrice}>
                      Price: {usedCurrency} {reward.value_in_votly.toFixed(2)}
                    </p>
                    <button
                      className={styles.redeemButton}
                      onClick={handleRedeem}
                      disabled={
                        !(
                          minimum_points_to_redeem < userPoints &&
                          userBalance >= reward.value_in_votly
                        )
                      }>
                      {minimum_points_to_redeem < userPoints &&
                      userBalance >= reward.value_in_votly
                        ? 'Redeem'
                        : 'Not Enough Balance'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Non-featured Rewards */}
          <div>
            <br />
            <div className={styles.rewardsGrid}>
              {filteredNonFeaturedRewards.map((reward) => (
                <div key={reward.id} className={styles.rewardCard}>
                  <img
                    src={reward.brand_image}
                    alt={reward.brand_en}
                    className={styles.rewardImage}
                  />
                  <h3>{reward.brand_en}</h3>
                  <p className={styles.rewardPrice}>
                    Price: {usedCurrency} {reward.value_in_votly.toFixed(2)}
                  </p>
                  <button
                    className={styles.redeemButton}
                    onClick={handleRedeem}
                    disabled={
                      !(
                        minimum_points_to_redeem < userPoints &&
                        userBalance >= reward.value_in_votly
                      )
                    }>
                    {minimum_points_to_redeem < userPoints &&
                    userBalance >= reward.value_in_votly
                      ? 'Redeem'
                      : 'Not Enough Balance'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className={styles.noRewardsMessage}>
          <img
            src='https://www.deeluxe.fr/img/cms/Homepage%202024/Reassurance/Paiement-securis%C3%A9-png.png'
            width={250}
            style={{ marginBottom: -50 }}
            alt='No rewards available'
          />
          <h2>No rewards available yet in your country</h2>
          <p>
            We're currently working to bring rewards to your location. Please
            check back soon!
          </p>
        </div>
      )}
    </div>
  );
};

export default Rewards;
