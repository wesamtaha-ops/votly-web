'use client';

import react, { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { callApi, isUserCountryAllowed } from '../../helper';
import { useSession } from 'next-auth/react';
import styles from './SurveysList.module.css';
import { useSearchParams } from 'next/navigation';
import { FaClipboardList, FaFilter, FaGlobe } from 'react-icons/fa';
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
          {filteredSurveys.map((survey) => (
            <div
              key={survey.id}
              className={`${styles.surveyCard} ${
                survey.completed ? styles.answeredCard : ''
              }`}>
              <h3 className={styles.surveyTitle}>{survey.title}</h3>
              <p className={styles.surveyDescription}>
                {survey.description}
              </p>
              <div className={styles.surveyInfo}>
                <img
                  src='https://i.etsystatic.com/36262552/r/il/aa81a7/4191400611/il_570xN.4191400611_23uk.jpg'
                  alt={t('timeIconAlt')}
                  className={styles.timeIcon}
                />
                <span className={styles.duration}>
                  {survey.duration} {t('mins')}
                </span>

                <img
                  src='https://i.pinimg.com/564x/a4/91/7a/a4917a4fcb3b1a6b3416e27491d9422b.jpg'
                  alt={t('priceIconAlt')}
                  className={styles.timeIcon2}
                />
                <span className={styles.amount}>
                  {survey.amount} {survey.currencyIsoCode}
                </span>
              </div>
              <button
                className={styles.takeSurveyButton}
                onClick={() => {
                  window.open(survey.link, '_blank');
                }}
                disabled={survey.completed}>
                {survey.completed ? t('surveyCompleted') : t('takeSurvey')}
              </button>
            </div>
          ))}
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
