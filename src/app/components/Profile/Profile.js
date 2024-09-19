'use client';

import styles from './Profile.module.css';
import Link from 'next/link';
import { useTranslations } from 'next-intl'; // Import for translations

const Profile = ({ user }) => {
  const t = useTranslations('Profile'); // Initialize translations
  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.title}>{t('myProfile')}</h2>

      <div className={styles.cardsGrid}>
        {/* Main Information Card */}
        <div className={`${styles.card} ${styles.mainInfoCard}`}>
          <h3 className={styles.cardTitle}>{t('mainInfo')}</h3>
          <div className={styles.infoGroup}>
            <p>
              <strong>{t('firstName')}:</strong> {user.firstname}
            </p>
            <p>
              <strong>{t('lastName')}:</strong> {user.lastname}
            </p>
            <p>
              <strong>{t('username')}:</strong> {user.username}
            </p>
            <p>
              <strong>{t('email')}:</strong> {user.email}
            </p>
            <p>
              <strong>{t('phone')}:</strong> {user.phone}
            </p>
            <p>
              <strong>{t('birthday')}:</strong> {user.birthday}
            </p>
            <p>
              <strong>{t('gender')}:</strong>{' '}
              {user.gender === 'male' ? t('male') : t('female')}
            </p>
            {user.bio && (
              <p>
                <strong>{t('bio')}:</strong> {user.bio}
              </p>
            )}
          </div>
          <Link href='/edit-profile'>
            <button className={styles.button}>{t('editProfile')}</button>
          </Link>
        </div>

        {/* Profile Completion Card */}
        <div className={`${styles.card} ${styles.profileCompletionCard}`}>
          <h3 className={styles.cardTitle}>{t('profileCompletion')}</h3>
          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBar}
              style={{
                width: user.is_profile_completed === 1 ? '100%' : '50%',
              }}>
              <span> {user.is_profile_completed === 1 ? '100%' : '50%'} </span>
              {t('profileCompletionPercentage')}
            </div>
          </div>
          <Link href='/complete-profile'>
            <button className={styles.button}>
              {user.is_profile_completed === 1
                ? t('editCompleteProfile')
                : t('completeProfile')}
            </button>
          </Link>
        </div>

        {/* Profile Image Card */}
        <div className={`${styles.card} ${styles.profileImageCard}`}>
          <h3 className={styles.cardTitle}>{t('profileImage')}</h3>
          <div className={styles.profileImageContainer}>
            <img
              src={
                user.image ||
                'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg'
              }
              alt={t('profileImageAlt')}
              className={styles.profileImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
