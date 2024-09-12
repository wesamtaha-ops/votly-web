'use client';

import styles from './Profile.module.css';
import Link from 'next/link';

const Profile = ({ user }) => {
  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.title}>My Profile</h2>

      <div className={styles.cardsGrid}>
        {/* Main Information Card */}
        <div className={`${styles.card} ${styles.mainInfoCard}`}>
          <h3 className={styles.cardTitle}>Main Information</h3>
          <div className={styles.infoGroup}>
            <p>
              <strong>First Name:</strong> {user.firstname}
            </p>
            <p>
              <strong>Last Name:</strong> {user.lastname}
            </p>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
            <p>
              <strong>Birthday:</strong> {user.birthday}
            </p>
            <p>
              <strong>Gender:</strong> {user.gender}
            </p>
            <p>
              <strong>Bio:</strong> {user.bio}
            </p>
          </div>
          <Link href='/edit-profile'>
            <button className={styles.button}>Edit Profile</button>
          </Link>
        </div>

        {/* Profile Completion Card */}
        <div className={`${styles.card} ${styles.profileCompletionCard}`}>
          <h3 className={styles.cardTitle}>Profile Completion</h3>
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBar} style={{ width: '70%' }}>
              70% Complete
            </div>
          </div>
          <Link href='/complete-profile'>
            <button className={styles.button}>Complete Profile</button>
          </Link>
        </div>

        {/* Profile Image Card */}
        <div className={`${styles.card} ${styles.profileImageCard}`}>
          <h3 className={styles.cardTitle}>Profile Image</h3>
          <div className={styles.profileImageContainer}>
            <img
              src={
                user.image ||
                'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg'
              }
              alt='Profile'
              className={styles.profileImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
