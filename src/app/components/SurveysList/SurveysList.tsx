'use client';

import react, { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { callApi, isUserCountryAllowed } from '../../helper';
import { useSession } from 'next-auth/react';
import styles from './SurveysList.module.css';
import { useSearchParams } from 'next/navigation';
import { FaClipboardList, FaFilter, FaGlobe, FaClock, FaCoins, FaStar, FaArrowRight, FaDollarSign, FaCheckCircle } from 'react-icons/fa';
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
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('active'); // 'active' or 'answered'
  const [filteredSurveys, setFilteredSurveys] = useState([]);
  const [transactions, setTransactions] = useState([]);

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

  // The API already provides the converted and divided amount
  // So we just return it directly without recalculation
  const calculateReward = (amount: number) => {
    // API already provides the final amount (converted and divided by division_factor)
    // So we just return it as-is
    return amount;
  };

  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  useEffect(() => {
    if (userToken) {
      fetchData();
      fetchTransactions();
    }
  }, [userToken, session]);

  useEffect(() => {
    // Filter surveys based on activeFilter
    const filtered = surveys.filter((survey) => {
      if (activeFilter === 'active') {
        // Active surveys are those not completed (null or false)
        return !survey.completed;
      } else {
        // Answered surveys are those completed (true)
        return survey.completed === true;
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

    if (response.status == "1" && response.externalResponse?.status === 200) {
      const surveysData = response.externalResponse?.data?.surveys || [];
      if (surveysData.length > 0) {
        // Debug: Log survey structure to see available fields
        console.log('Survey data structure:', surveysData[0]);
        setSurveys(surveysData);
      }
    }
    setLoading(false);
  }

  async function fetchTransactions() {
    setTransactionsLoading(true);
    try {
      const response = await callApi({
        type: 'get',
        url: 'transactions',
        userToken: userToken,
      });

      if (response.status == "1" && response.data) {
        // New response structure has transactions directly in data array
        setTransactions(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setTransactionsLoading(false);
    }
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

  // Show loading spinner while session is loading (but not for surveys loading)
  if (sessionStatus === "loading") {
    return (
      <div className={styles.surveysContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  // Show transactions loading when switching to transactions tab
  const isTransactionsTabLoading = activeFilter === 'answered' && transactionsLoading;

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
            className={`${styles.filterButton} ${activeFilter === 'active' ? styles.active : ''
              }`}
            onClick={() => {
              setActiveFilter('active');
              fetchData();
            }}>
            <FaFilter className={styles.filterIcon} />
            {t('activeSurveys')}
            <span className={styles.surveyCount}>
              {surveys.filter((s) => !s.completed).length}
            </span>
          </button>
          <button
            className={`${styles.filterButton} ${activeFilter === 'answered' ? styles.active : ''
              }`}
            onClick={() => {
              setActiveFilter('answered');
              fetchTransactions();
            }}>
            <FaFilter className={styles.filterIcon} />
            {t('answeredSurveys')}
            <span className={styles.surveyCount}>
              {transactions.length}
            </span>
          </button>
        </div>
      </div>
      <h2 className={styles.title}>
        {activeFilter === 'answered' ? t('transactionHistory') : t('earnBySurveys')}
      </h2>
      <p className={styles.surveyDescription}>
        {activeFilter === 'answered' ? t('transactionHistoryDescription') : t('surveyDescription')}
      </p>

      {isTransactionsTabLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      ) : activeFilter === 'answered' && transactions.length > 0 ? (
        <div className={styles.transactionsList}>
          {transactions.map((transaction, index) => {
            const transactionDate = new Date(transaction.date);
            const formattedDate = transactionDate.toLocaleDateString(lang, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
            
            // Debug: Log transaction structure to see available fields
            if (index === 0) {
              console.log('Transaction data structure:', transaction);
            }
            
            return (
              <div
                key={transaction.id}
                className={styles.transactionRow}>

                {/* Transaction Date and Survey ID */}
                <div className={styles.transactionDateLeft}>
                  <div>{formattedDate}</div>
                  <div className={styles.transactionReference}>
                    {t('reference')}: {transaction.survey_id !== undefined && transaction.survey_id !== null 
                      ? transaction.survey_id 
                      : (transaction.id !== undefined && transaction.id !== null 
                        ? transaction.id 
                        : (transaction.reference || transaction.ref || transaction.survey_reference || transaction.survey_ref || 'N/A'))}
                  </div>
                </div>

                {/* Transaction Amount and Status */}
                <div className={styles.transactionRightSection}>
                  <div className={styles.transactionAmount}>
                    <FaCoins className={styles.amountIcon} />
                    <span className={styles.amountValue}>
                      {parseFloat(transaction.amount).toFixed(2)} {displayCurrency}
                    </span>
                  </div>
                  
                  <div className={styles.transactionStatus}>
                    <FaCheckCircle className={styles.statusIcon} />
                    <span className={styles.statusText}>{t('completed')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : loading && activeFilter === 'active' ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      ) : activeFilter === 'active' && filteredSurveys.length > 0 ? (
        <div className={styles.surveysGrid}>
          {filteredSurveys.map((survey, index) => {
            const reward = calculateReward(survey.amount);
            return (
              <div
                key={survey.id}
                className={`${styles.surveyCard} ${survey.completed ? styles.answeredCard : ''
                  }`}>

                {/* Survey Header */}
                <div className={styles.surveyHeader}>
                </div>

                {/* Survey Content */}
                <div className={styles.surveyContent}>
                  <h3 className={styles.surveyTitle}>
                    {survey.title || `${t('survey')} #${index + 1}`}
                    <span className={styles.surveyReference}>
                      {' '}({t('reference')}: {survey.id !== undefined && survey.id !== null ? survey.id : (survey.reference || survey.ref || survey.survey_reference || survey.survey_ref || 'N/A')})
                    </span>
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
                  className={`${styles.takeSurveyButton} ${survey.completed ? styles.completedButton : ''
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
              : activeFilter === 'answered' 
                ? t('noTransactions')
                : t('noAnsweredSurveys')}
          </h3>
          <p className={styles.noSurveysText}>
            {activeFilter === 'active'
              ? t('noActiveSurveysText')
              : activeFilter === 'answered'
                ? t('noTransactionsText')
                : t('noAnsweredSurveysText')}
          </p>
        </div>
      )}
    </div>
  );
};

export default SurveysList;
