'use client';

import react, { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { callApi, isUserCountryAllowed } from '../../helper';
import { useSession } from 'next-auth/react';
import styles from './SurveysList.module.css';
import { useSearchParams } from 'next/navigation';
import { FaClipboardList, FaFilter, FaGlobe, FaClock, FaCoins, FaStar, FaArrowRight } from 'react-icons/fa';
import { Session } from 'next-auth';

interface CustomSession extends Session {
  id?: string;
  user?: {
    name?: string;
    email?: string;
    image?: string;
    country_id?: number;
    [key: string]: any;
  };
}

const SurveysList = () => {
  const { data: session, status: sessionStatus } = useSession();
  const t = useTranslations('Surveys');
  const lang = useLocale();
  const userToken = (session as CustomSession)?.id;
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('active'); // 'active' or 'answered'
  const [filteredSurveys, setFilteredSurveys] = useState([]);
  
  // Get user's currency and conversion rate
  const userCurrency = (session as CustomSession)?.user?.country_currency || "AED";
  const conversionRate = (session as CustomSession)?.user?.countryDetails?.conversion_value || 3.67;
  const isArabic = lang === "ar";

  // Get display currency
  let displayCurrency = userCurrency;
  if (userCurrency === "AED" && isArabic) {
    displayCurrency = "درهم";
  } else if (userCurrency === "SAR" && isArabic) {
    displayCurrency = "ريال";
  }

  // Calculate 25% of amount and convert to user currency
  const calculateReward = (usdAmount: number) => {
    const quarterAmount = usdAmount * 0.25; // 25% of original
    const convertedAmount = quarterAmount * conversionRate;
    return convertedAmount;
  };

  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  useEffect(() => {
    if (userToken) fetchData();
  }, [userToken, session]);

  useEffect(() => {
    // Filter surveys based on activeFilter
    const filtered = surveys.filter((survey) => {
      if (activeFilter === 'active') {
        return !survey.completed;
      } else {
        return survey.completed;
      }
    });
    setFilteredSurveys(filtered);
  }, [activeFilter, surveys]);

  async function fetchData() {
    setLoading(true);
    const response = await callApi({
      type: 'get',
      url: 'survey',
      userToken: userToken,
    });

    if (response.status == 200) {
      if (response.data.length > 0) setSurveys(response?.data);
    }
    setLoading(false);
  }

  // Country restriction message component
  const CountryRestrictionMessage = () => (
    <div className={`${styles.noSurveys} ${styles.restrictionMessage}`}>
      <div className={styles.noSurveysIcon}>
        <FaGlobe />
      </div>
      <h3 className={styles.noSurveysTitle}>{t('serviceNotAvailable')}</h3>
      <p className={styles.noSurveysText}>
        {t('serviceNotAvailableInCountry')}
      </p>
    </div>
  );

  // Show loading spinner while session is loading
  if (sessionStatus === "loading" || loading) {
    return (
      <div className={styles.surveysContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  // Only check country restriction after session is loaded
  if (sessionStatus === "authenticated" && !isUserCountryAllowed(session?.user)) {
    return <CountryRestrictionMessage />;
  }

  return (
    <div className={styles.surveysContainer}>
      {status == 'success' && (
        <p role='alert' className={styles.success}>
          {t('surveySuccessMessage')}
        </p>
      )}

      {['out', 'terminate', 'full'].includes(status) && (
        <p role='alert' className={styles.error}>
          {t('surveyFailureMessage')}
        </p>
      )}

      {/* Filter Controls */}
      <div className={styles.filterContainer}>
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterButton} ${
              activeFilter === 'active' ? styles.active : ''
            }`}
            onClick={() => setActiveFilter('active')}>
            <FaFilter className={styles.filterIcon} />
            {t('activeSurveys')}
            <span className={styles.surveyCount}>
              {surveys.filter((s) => !s.completed).length}
            </span>
          </button>
          <button
            className={`${styles.filterButton} ${
              activeFilter === 'answered' ? styles.active : ''
            }`}
            onClick={() => setActiveFilter('answered')}>
            <FaFilter className={styles.filterIcon} />
            {t('answeredSurveys')}
            <span className={styles.surveyCount}>
              {surveys.filter((s) => s.completed).length}
            </span>
          </button>
        </div>
      </div>
      <h2 className={styles.title}>{t('earnBySurveys')}</h2>
      <p className={styles.surveyDescription}>{t('surveyDescription')}</p>

      {filteredSurveys.length > 0 ? (
        <div className={styles.surveysGrid}>
          {filteredSurveys.map((survey, index) => {
            const reward = calculateReward(survey.amount);
            return (
              <div
                key={survey.id}
                className={`${styles.surveyCard} ${
                  survey.completed ? styles.answeredCard : ''
                }`}>
                
                {/* Survey Header */}
                <div className={styles.surveyHeader}>
                  <div className={styles.surveyBadge}>
                    <FaStar className={styles.badgeIcon} />
                    <span>{t('availableReward')}</span>
                  </div>
                </div>

                {/* Survey Content */}
                <div className={styles.surveyContent}>
                  <h3 className={styles.surveyTitle}>
                    {survey.title || `${t('survey')} #${index + 1}`}
                  </h3>
                  <p className={styles.surveyDescription}>
                    {survey.description || t('surveyDescription')}
                  </p>
                </div>

                {/* Survey Stats */}
                <div className={styles.surveyStats}>
                  <div className={styles.statItem}>
                    <div className={styles.statIcon}>
                      <FaClock />
                    </div>
                    <div className={styles.statContent}>
                      <span className={styles.statValue}>{survey.duration}</span>
                      <span className={styles.statLabel}>{t('mins')}</span>
                    </div>
                  </div>

                  <div className={styles.statItem}>
                    <div className={styles.statIcon}>
                      <FaCoins />
                    </div>
                    <div className={styles.statContent}>
                      <span className={styles.statValue}>
                        {reward.toFixed(2)}
                      </span>
                      <span className={styles.statLabel}>{displayCurrency}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  className={`${styles.takeSurveyButton} ${
                    survey.completed ? styles.completedButton : ''
                  }`}
                  onClick={() => {
                    if (!survey.completed) {
                      window.open(survey.link, '_blank');
                    }
                  }}
                  disabled={survey.completed}>
                  
                  {survey.completed ? (
                    <>
                      <span>{t('surveyCompleted')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('takeSurvey')}</span>
                      <FaArrowRight className={styles.buttonIcon} />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.noSurveys}>
          <div className={styles.noSurveysIcon}>
            <FaClipboardList />
          </div>
          <h3 className={styles.noSurveysTitle}>
            {activeFilter === 'active'
              ? t('noActiveSurveys')
              : t('noAnsweredSurveys')}
          </h3>
          <p className={styles.noSurveysText}>
            {activeFilter === 'active'
              ? t('noActiveSurveysText')
              : t('noAnsweredSurveysText')}
          </p>
        </div>
      )}
    </div>
  );
};

export default SurveysList;
