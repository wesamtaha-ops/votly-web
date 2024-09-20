'use client';

import { useState, useEffect } from 'react';
import styles from './Rewards.module.css';
import { useSession } from 'next-auth/react';
import { callApi } from '../../helper';
import Swal from 'sweetalert2';
import { useLocale, useTranslations } from 'next-intl'; // Import for translations

const Rewards = () => {
  const { data: session, update: updateSession } = useSession();
  const userToken = session?.id;
  const [rewards, setRewards] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [showRewards, setShowRewards] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const t = useTranslations('Rewards'); // Initialize translations
  const locale = useLocale(); // Get the current locale

  const [categories, setCategories] = useState([
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

  const minimum_points_to_redeem = rewards?.[0]?.minimum_points_to_redeem;
  const point_value_in_dollars = rewards?.[0]?.point_value_in_dollars;
  let usedCurrency = rewards?.[0]?.country_currency;

  // check usedCurrency if AED or SAR and if lang in Arabic show Arabic currency
  if (usedCurrency == 'AED' && locale == 'ar') {
    usedCurrency = 'درهم';
  } else if (usedCurrency == 'SAR' && locale == 'ar') {
    usedCurrency = 'ريال';
  }

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
        const response = await callApi({
          type: 'post',
          url: 'order',
          data: { brand_code: brand_code },
          userToken: userToken,
        });

        if (response?.data?.status == 200) {
          await updateSession({ user: response.data.data });
          reloadSession();

          Swal.fire(t('redeemed'), '', 'success');
        } else {
          Swal.fire(t('noRedeem'), '', 'error');
        }
      } else if (result.isDenied) {
        Swal.fire(t('noRedeem'), '', 'info');
      }

      setSubmitting(false);
    });
  }

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
  }, [userToken, session]);

  useEffect(() => {
    if (point_value_in_dollars > 0 && userPoints > 0) {
      setUserBalance(userPoints * point_value_in_dollars);
    }
  }, [point_value_in_dollars, session]);

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
          {t('yourBalance')}: {userBalance.toFixed(2)} {usedCurrency}
        </h2>
      </div>
      {showRewards ? (
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

          <h2 className={styles.title}>{t('chooseGift')}</h2>

          {filteredFeaturedRewards.length > 0 && (
            <div>
              <h3 className={styles.featuredTitle}>{t('featuredRewards')}</h3>
              <div className={styles.rewardsGrid}>
                {filteredFeaturedRewards.map((reward, ind) => (
                  <div
                    key={'re' + ind}
                    className={styles.rewardCard}
                    style={{ backgroundColor: '#fffeef' }}>
                    <img
                      src={reward.brand_image}
                      alt={reward.brand_en}
                      className={styles.rewardImage}
                    />
                    <h3>
                      {locale == 'en' ? reward.brand_en : reward.brand_ar}
                    </h3>
                    <p className={styles.rewardPrice}>
                      {t('price')}
                      {'  '} {reward.value_in_votly}
                      {'  '}
                      {usedCurrency}
                    </p>
                    <button
                      className={styles.redeemButton}
                      onClick={async () => {
                        setSubmitting(true);
                        await handleRedeem(reward.provider_origin_id);
                      }}
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
                ))}
              </div>
            </div>
          )}

          <div>
            <br />
            <div className={styles.rewardsGrid}>
              {filteredNonFeaturedRewards.map((reward, ind) => (
                <div key={'reward' + ind} className={styles.rewardCard}>
                  <img
                    src={reward.brand_image}
                    alt={reward.brand_en}
                    className={styles.rewardImage}
                  />
                  <h3> {locale == 'en' ? reward.brand_en : reward.brand_ar}</h3>
                  <p className={styles.rewardPrice}>
                    {t('price')} {'  '} {reward.value_in_votly}
                    {'  '}
                    {usedCurrency}
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
                      ? t('redeem')
                      : t('notEnoughBalance')}
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
            alt={t('noRewardsAvailable')}
          />
          <h2>{t('noRewardsAvailableTitle')}</h2>
          <p>{t('noRewardsMessage')}</p>
        </div>
      )}
    </div>
  );
};

export default Rewards;
