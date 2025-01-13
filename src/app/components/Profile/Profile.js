'use client';

import styles from './Profile.module.css';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { 
  FaUser, 
  FaEdit, 
  FaCheckCircle, 
  FaCamera, 
  FaEnvelope, 
  FaPhone, 
  FaBirthdayCake, 
  FaVenusMars 
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const Profile = ({ user }) => {
  const t = useTranslations('Profile');
  
  const calculateCompletionPercentage = () => {
    return user.is_profile_completed === 1 ? '100%' : '50%';
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getIconForField = (field) => {
    const icons = {
      email: <FaEnvelope className={styles.fieldIcon} />,
      phone: <FaPhone className={styles.fieldIcon} />,
      birthday: <FaBirthdayCake className={styles.fieldIcon} />,
      gender: <FaVenusMars className={styles.fieldIcon} />
    };
    return icons[field] || null;
  };

  return (
    <div className={styles.profileContainer}>
      <motion.h4
        className={styles.title}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}>
        <FaUser className={styles.titleIcon} />
        {t('myProfile')}
      </motion.h4>

      <div className={styles.cardsGrid}>
        <div className={styles.leftColumn}>
          {/* Profile Image Card */}
          <motion.div
            className={`${styles.card} ${styles.profileImageCard}`}
            variants={cardVariants}
            initial='hidden'
            animate='visible'
            transition={{ duration: 0.3 }}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <FaCamera className={styles.titleIcon} />
                {t('profileImage')}
              </h3>
            </div>

            <div className={styles.profileImageWrapper}>
              <div className={styles.profileImageContainer}>
                <img
                  src={
                    user.image ||
                    'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg'
                  }
                  alt={t('profileImageAlt')}
                  className={styles.profileImage}
                />
                <div className={styles.imageOverlay}>
                  <FaCamera className={styles.cameraIcon} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Profile Completion Card */}
          <motion.div
            className={`${styles.card} ${styles.profileCompletionCard}`}
            variants={cardVariants}
            initial='hidden'
            animate='visible'
            transition={{ duration: 0.3, delay: 0.2 }}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <FaCheckCircle className={styles.titleIcon} />
                {t('profileCompletion')}
              </h3>
            </div>

            <div className={styles.progressBarWrapper}>
              <div className={styles.progressBarContainer}>
                <motion.div
                  className={styles.progressBar}
                  initial={{ width: 0 }}
                  animate={{ width: calculateCompletionPercentage() }}
                  transition={{ duration: 1, ease: 'easeOut' }}>
                  <span className={styles.progressText}>
                    {calculateCompletionPercentage()}{' '}
                    {t('profileCompletionPercentage')}
                  </span>
                </motion.div>
              </div>
            </div>

            <Link href='/complete-profile'>
              <button className={styles.completeButton}>
                {user.is_profile_completed === 1
                  ? t('editCompleteProfile')
                  : t('completeProfile')}
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Main Information Card */}
        <motion.div
          className={`${styles.card} ${styles.mainInfoCard}`}
          variants={cardVariants}
          initial='hidden'
          animate='visible'
          transition={{ duration: 0.3, delay: 0.4 }}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>{t('mainInfo')}</h3>
            <Link href='/edit-profile'>
              <button className={styles.editButton}>
                <FaEdit />
                <span>{t('editProfile')}</span>
              </button>
            </Link>
          </div>

          <div className={styles.infoGrid}>
            {[
              { label: 'firstName', value: user.firstname },
              { label: 'lastName', value: user.lastname },
              { label: 'username', value: user.username },
              { label: 'email', value: user.email },
              { label: 'phone', value: user.phone },
              { label: 'birthday', value: user.birthday },
              {
                label: 'gender',
                value: user.gender === 'male' ? t('male') : t('female'),
              },
              ...(user.bio ? [{ label: 'bio', value: user.bio }] : []),
            ].map((item, index) => (
              <motion.div
                key={index}
                className={styles.infoItem}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}>
                <div className={styles.infoItemHeader}>
                  {getIconForField(item.label)}
                  <span className={styles.infoLabel}>{t(item.label)}:</span>
                </div>
                <span className={styles.infoValue}>{item.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
