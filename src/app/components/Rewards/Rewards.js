'use client';

import { useState, useEffect } from 'react';
import styles from './Rewards.module.css';
import { useSession } from 'next-auth/react';
import { callApi } from '../../helper';
import Swal from 'sweetalert2';
import { useLocale, useTranslations } from 'next-intl';
import { FaHistory, FaGift, FaClock, FaDollarSign } from 'react-icons/fa';
import Image from 'next/image';

const dummyHistory = [
  {
    created_at: '2024-03-15',
    value_in_votly: 100,
    brand_en: 'Amazon Gift Card',
    brand_ar: 'بطاقة هدايا أمازون',
    status: 'completed',
  },
  {
    created_at: '2024-03-10',
    value_in_votly: 50,
    brand_en: 'Starbucks Voucher',
    brand_ar: 'قسيمة ستاربكس',
    status: 'pending',
  },
  {
    created_at: '2024-03-05',
    value_in_votly: 200,
    brand_en: 'Nike Store Credit',
    brand_ar: 'رصيد متجر نايكي',
    status: 'completed',
  },
  {
    created_at: '2024-02-28',
    value_in_votly: 75,
    brand_en: 'Cinema Tickets',
    brand_ar: 'تذاكر سينما',
    status: 'failed',
  },
];

const Rewards = () => {
  const { data: session, update: updateSession } = useSession();
  const userToken = session?.id;
  const t = useTranslations('Rewards');
  const locale = useLocale();

  // States
  const [showHistory, setShowHistory] = useState(false);
  const [rewards, setRewards] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [showRewards, setShowRewards] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [redeemHistory, setRedeemHistory] = useState([]);

  const [categories] = useState([
    { id: 1, name: t('fashion') },
    { id: 2, name: t('jewellery') },
    { id: 3, name: t('kidsFun') },
    { id: 4, name: t('beautyCosmetics') },
    { id: 5, name: t('mobileRecharge') },
    { id: 6, name: t('restaurantsCafes') },
    { id: 7, name: t('hotelsTravel') },
    { id: 8, name: t('spasFitness') },
    { id: 9, name: t('experiencesEntertainment') },
    { id: 10, name: t('electronics') },
    { id: 11, name: t('hypermarkets') },
    { id: 12, name: t('cinemas') },
    { id: 13, name: t('shoppingMalls') },
    { id: 14, name: t('hobbiesMore') },
    { id: 15, name: t('sportswearEquipment') },
    { id: 16, name: t('gaming') },
    { id: 17, name: t('softwareSubscriptions') },
    { id: 18, name: t('onlineShopping') },
    { id: 19, name: t('foodDelivery') },
    { id: 20, name: t('homeGarden') },
    { id: 21, name: t('digitalEntertainment') },
  ]);

  // Derived values
  const minimum_points_to_redeem = rewards?.[0]?.minimum_points_to_redeem;
  const point_value_in_dollars = rewards?.[0]?.point_value_in_dollars;
  let usedCurrency = rewards?.[0]?.country_currency;

  if (usedCurrency == 'AED' && locale == 'ar') {
    usedCurrency = 'درهم';
  } else if (usedCurrency == 'SAR' && locale == 'ar') {
    usedCurrency = 'ريال';
  }

  // API calls
  async function fetchData() {
    setLoading(true);
    try {
      const rewardsResponse = await callApi({
        type: 'get',
        url: 'order',
        userToken: userToken,
      });

      if (rewardsResponse.status == 200) {
        setRewards(rewardsResponse.data);
      }

      // Set dummy history data instead of making API call
      setRedeemHistory(dummyHistory);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const reloadSession = () => {
    const event = new Event('visibilitychange');
    document.dispatchEvent(event);
  };

  function handleRedeem(brand_code) {
    Swal.fire({
      title: t('redeemTitle'),
      showCancelButton: true,
      confirmButtonText: t('redeem'),
      confirmButtonColor: '#017bfe',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setSubmitting(true);
        try {
          const response = await callApi({
            type: 'post',
            url: 'order',
            data: { brand_code: brand_code },
            userToken: userToken,
            lang: locale,
          });

          if (response?.data?.status == 200) {
            await updateSession({ user: response.data.data });
            reloadSession();
            await fetchData(); // Refresh data after successful redeem
            Swal.fire(t('redeemed'), '', 'success');
          } else {
            Swal.fire(t('noRedeem'), '', 'error');
          }
        } catch (error) {
          console.error('Error redeeming:', error);
          Swal.fire(t('noRedeem'), '', 'error');
        } finally {
          setSubmitting(false);
        }
      }
    });
  }

  // Filter rewards
  const featuredRewards = rewards.filter((reward) => reward.featured === 1);
  const nonFeaturedRewards = rewards.filter((reward) => reward.featured === 0);

  const filteredFeaturedRewards = featuredRewards.filter((reward) =>
    selectedCategory ? reward.category_id === parseInt(selectedCategory) : true,
  );

  const filteredNonFeaturedRewards = nonFeaturedRewards.filter((reward) =>
    selectedCategory ? reward.category_id === parseInt(selectedCategory) : true,
  );

  // Effects
  useEffect(() => {
    if (
      session?.user?.country_id !== 188 &&
      session?.user?.country_id !== 227
    ) {
      setLoading(false);
      setShowRewards(false);
    } else {
      fetchData();
      setUserPoints(session?.user?.num_points);
      setShowRewards(true);
    }
  }, [userToken, session]);

  useEffect(() => {
    if (point_value_in_dollars > 0 && userPoints > 0) {
      setUserBalance(userPoints * point_value_in_dollars);
    }
  }, [point_value_in_dollars, userPoints]);

  const renderRewardCard = (reward, index, isFeatured = false) => (
    <div
      key={`${isFeatured ? 'featured' : 'regular'}-${index}`}
      className={`${styles.rewardCard} ${isFeatured ? styles.featured : ''}`}>
      <div className={styles.rewardImageWrapper}>
        <img
          src={reward.brand_image}
          alt={locale == 'en' ? reward.brand_en : reward.brand_ar}
          className={styles.rewardImage}
        />
      </div>
      <div className={styles.rewardInfo}>
        <h3 className={styles.rewardTitle}>
          {locale == 'en' ? reward.brand_en : reward.brand_ar}
        </h3>
        <p className={styles.rewardPrice}>
          {t('price')} {reward.value_in_votly} {usedCurrency}
        </p>
        <button
          className={`${styles.redeemButton} ${
            !(
              minimum_points_to_redeem < userPoints &&
              userBalance >= reward.value_in_votly
            ) || submitting
              ? styles.disabled
              : ''
          }`}
          onClick={() => handleRedeem(reward.provider_origin_id)}
          disabled={
            !(
              minimum_points_to_redeem < userPoints &&
              userBalance >= reward.value_in_votly
            ) || submitting
          }>
          {submitting
            ? t('submitting')
            : minimum_points_to_redeem < userPoints &&
              userBalance >= reward.value_in_votly
            ? t('redeem')
            : t('notEnoughBalance')}
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.rewardsContainer}>
      {loading ? (
        <div className={styles.spinner}></div>
      ) : (
        <>
          {showRewards && (
            <div className={styles.balanceSection}>
              <div className={styles.balanceContent}>
                <div className={styles.balanceIcon}>
                  <svg
                    width='48'
                    height='48'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z'
                      fill='currentColor'
                    />
                  </svg>
                </div>
                <div className={styles.balanceDetails}>
                  <h2 className={styles.balanceTitle}>{t('yourBalance')}</h2>
                  <p className={styles.balanceAmount}>
                    <span className={styles.currencySymbol}>
                      {usedCurrency}
                    </span>
                    <span className={styles.amount}>
                      {userBalance.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
              <div className={styles.balanceBackground}></div>
            </div>
          )}
          {showRewards && (
            <div className={styles.viewToggle}>
              <button
                className={`${styles.toggleButton} ${
                  !showHistory ? styles.active : ''
                }`}
                onClick={() => setShowHistory(false)}>
                <FaGift /> {t('availableRewards')}
              </button>
              <button
                className={`${styles.toggleButton} ${
                  showHistory ? styles.active : ''
                }`}
                onClick={() => setShowHistory(true)}>
                <FaHistory /> {t('redeemHistory')}
              </button>
            </div>
          )}

          {showHistory ? (
            <div className={styles.historyTableContainer}>
              {redeemHistory.length > 0 ? (
                <table className={styles.historyTable}>
                  <thead>
                    <tr>
                      <th>{t('date')}</th>
                      <th>{t('amount')}</th>
                      <th>{t('gift')}</th>
                      <th>{t('status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {redeemHistory.map((item, index) => (
                      <tr key={index}>
                        <td>
                          {new Date(item.created_at).toLocaleDateString(locale)}
                        </td>
                        <td>
                          {item.value_in_votly} {usedCurrency}
                        </td>
                        <td>
                          {locale === 'en' ? item.brand_en : item.brand_ar}
                        </td>
                        <td>
                          <span
                            className={`${styles.status} ${
                              styles[item.status]
                            }`}>
                            {t(item.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className={styles.noHistory}>
                  <FaHistory className={styles.noHistoryIcon} />
                  <p>{t('noRedeemHistory')}</p>
                </div>
              )}
            </div>
          ) : showRewards ? (
            <>
              <div className={styles.filterContainer}>
                <label htmlFor='categoryFilter' className={styles.filterLabel}>
                  {t('filterByCategory')}:
                </label>
                <select
                  id='categoryFilter'
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={styles.filterSelect}>
                  <option value=''>{t('allCategories')}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {filteredFeaturedRewards.length > 0 && (
                <div className={styles.featuredSection}>
                  <h3 className={styles.featuredTitle}>
                    {t('featuredRewards')}
                  </h3>
                  <div className={styles.rewardsGrid}>
                    {filteredFeaturedRewards.map((reward, index) =>
                      renderRewardCard(reward, index, true),
                    )}
                  </div>
                </div>
              )}

              <div className={styles.rewardsGrid}>
                {filteredNonFeaturedRewards.map((reward, index) =>
                  renderRewardCard(reward, index),
                )}
              </div>
            </>
          ) : (
            <div className={styles.noRewardsMessage}>
              <img
                src='https://www.deeluxe.fr/img/cms/Homepage%202024/Reassurance/Paiement-securis%C3%A9-png.png'
                width={150}
                style={{ marginBottom: -60 }}
                alt={t('noRewardsAvailable')}
              />
              <h3 style={{ marginBottom: -40 }}>
                {t('noRewardsAvailableTitle')}
              </h3>
              <p>{t('noRewardsMessage')}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Rewards;
