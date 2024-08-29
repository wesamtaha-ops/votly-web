'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './EditProfile.module.css';
import Link from 'next/link';

const EditProfile = ({ user }) => {
  const [selectedImage, setSelectedImage] = useState(
    user.image ||
      'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg',
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
      phone: user.phone,
      birthday: user.birthday,
      gender: user.gender,
      bio: user.bio,
    },
  });

  const onSubmitMainInfo = (data) => {
    console.log('Main Info Updated:', data);
  };

  const onSubmitPassword = (data) => {
    console.log('Password Updated:', data);
  };

  const onSubmitProfileImage = (data) => {
    console.log('Profile Image Updated:', data);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <div className={styles.editProfileContainer}>
      <h2 className={styles.title}>Edit Profile</h2>

      <div className={styles.cardsGrid}>
        {/* Main Information Card */}
        <div className={`${styles.card} ${styles.mainInfoCard}`}>
          <h3 className={styles.cardTitle}>Main Information</h3>
          <form
            onSubmit={handleSubmit(onSubmitMainInfo)}
            className={styles.form}>
            <div className={styles.formGroup}>
              <label>First Name</label>
              <input
                className={`${styles.input} ${
                  errors.firstname ? styles.errorBorder : ''
                }`}
                {...register('firstname', {
                  required: 'First name is required',
                })}
              />
              {errors.firstname && (
                <p className={styles.error}>{errors.firstname.message}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Last Name</label>
              <input
                className={`${styles.input} ${
                  errors.lastname ? styles.errorBorder : ''
                }`}
                {...register('lastname', { required: 'Last name is required' })}
              />
              {errors.lastname && (
                <p className={styles.error}>{errors.lastname.message}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Username</label>
              <input
                className={`${styles.input} ${
                  errors.username ? styles.errorBorder : ''
                }`}
                {...register('username', { required: 'Username is required' })}
              />
              {errors.username && (
                <p className={styles.error}>{errors.username.message}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                className={`${styles.input} ${
                  errors.email ? styles.errorBorder : ''
                }`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && (
                <p className={styles.error}>{errors.email.message}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Phone</label>
              <input
                className={`${styles.input} ${
                  errors.phone ? styles.errorBorder : ''
                }`}
                {...register('phone', { required: 'Phone number is required' })}
              />
              {errors.phone && (
                <p className={styles.error}>{errors.phone.message}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Birthday</label>
              <input
                type='date'
                className={`${styles.input} ${
                  errors.birthday ? styles.errorBorder : ''
                }`}
                {...register('birthday')}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Gender</label>
              <select className={styles.input} {...register('gender')}>
                <option value='male'>Male</option>
                <option value='female'>Female</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Bio</label>
              <textarea
                className={`${styles.input} ${
                  errors.bio ? styles.errorBorder : ''
                }`}
                {...register('bio')}
              />
            </div>

            <button className={styles.button} type='submit'>
              Save Changes
            </button>
          </form>
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
          </Link>{' '}
        </div>

        {/* Change Profile Image Card */}
        <div className={`${styles.card} ${styles.changeProfileImageCard}`}>
          <h3 className={styles.cardTitle}>Change Profile Image</h3>
          <div className={styles.profileImageContainer}>
            <img
              src={selectedImage}
              alt='Profile'
              className={styles.profileImage}
            />
            <label className={styles.editImageButton}>
              <input
                type='file'
                className={styles.fileInput}
                {...register('profileImage')}
                onChange={handleImageChange}
              />
              <span className={styles.editIcon}>✎</span>
            </label>
            <button className={styles.uploadbutton} type='submit'>
              Update Image
            </button>
          </div>
        </div>

        {/* Change Password Card */}
        <div className={`${styles.card} ${styles.changePasswordCard}`}>
          <h3 className={styles.cardTitle}>Change Password</h3>
          <form
            onSubmit={handleSubmit(onSubmitPassword)}
            className={styles.form}>
            <div className={styles.formGroup}>
              <label>New Password</label>
              <input
                className={`${styles.input} ${
                  errors.password ? styles.errorBorder : ''
                }`}
                type='password'
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              {errors.password && (
                <p className={styles.error}>{errors.password.message}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Confirm Password</label>
              <input
                className={`${styles.input} ${
                  errors.confirmPassword ? styles.errorBorder : ''
                }`}
                type='password'
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === watch('password') || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && (
                <p className={styles.error}>{errors.confirmPassword.message}</p>
              )}
            </div>

            <button className={styles.button} type='submit'>
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
