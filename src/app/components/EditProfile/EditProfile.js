'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './EditProfile.module.css';
import Link from 'next/link';
import { callApi, isUserCountryAllowed } from '../../helper';
import toast from 'react-hot-toast';
import Button from '../Shared/Button';
import axios from 'axios';
import { useTranslations } from 'next-intl'; // Import for translations

const EditProfile = ({ user, userToken, updateSession }) => {
  if (!user?.firstname) return;

  const [selectedImage, setSelectedImage] = useState(
    user.image ||
      'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg',
  );
  const [imageFile, setImageFile] = useState();
  const [loading, setLoading] = useState(false); // Add loading state

  const t = useTranslations('EditProfile'); // Initialize translations

  const {
    register,
    handleSubmit,
    formState: { errors },
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

  const {
    register: passwordRegister,
    handleSubmit: passwordHandleSubmit,
    formState: { errors: passwordErrors },
    watch: passwordWatch,
  } = useForm();

  const {
    register: profileImageRegister,
    handleSubmit: profileImageHandleSubmit,
  } = useForm();

  const reloadSession = () => {
    const event = new Event('visibilitychange');
    document.dispatchEvent(event);
  };

  const onSubmitMainInfo = async (data) => {
    setLoading(true); // Start loading
    try {
      const res = await callApi({
        type: 'post',
        url: 'profileUpdate',
        data: data,
        userToken: userToken,
      });

      if (res.status == '1') {
        await updateSession({ user: res.user });
        reloadSession();
        toast(t('profileUpdated'));
      } else {
        toast(t('somethingWentWrong'));
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const onSubmitPassword = async (data) => {
    setLoading(true); // Start loading
    try {
      const res = await callApi({
        type: 'post',
        url: 'passwordUpdate',
        data: {
          password: data.password,
          email: user.email,
        },
        userToken: userToken,
      });

      if (res.status == '1') {
        toast(t('passwordUpdated'));
      } else {
        toast(t('somethingWentWrong'));
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const onSubmitProfileImage = async (data) => {
    setLoading(true); // Start loading
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_API}user`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userToken}`,
          },
        },
      );

      if (response.data.status == '1') {
        await updateSession({ user: response.data.user });
        reloadSession();
        toast(t('profileImageUpdated'));
      }
    } catch (error) {
      toast(t('somethingWentWrong'));
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setImageFile(event.target.files[0]);
    }
  };

  return (
    <div className={styles.editProfileContainer}>
      {loading && <div className={styles.loader}>Loading...</div>}
      <h2 className={styles.title}>{t('editProfile')}</h2>
      <div className={styles.cardsGrid}>
        {/* Main Information Card */}
        <div className={`${styles.card} ${styles.mainInfoCard}`}>
          <h3 className={styles.cardTitle}>{t('mainInfo')}</h3>
          <form
            onSubmit={handleSubmit(onSubmitMainInfo)}
            className={styles.form}>
            <div className={styles.formGroup}>
              <label>{t('firstName')}</label>
              <input
                className={`${styles.input} ${
                  errors.firstname ? styles.errorBorder : ''
                }`}
                {...register('firstname', {
                  required: t('firstNameRequired'),
                })}
                disabled={loading} // Disable input during loading
              />
              {errors.firstname && (
                <p className={styles.error}>{errors.firstname.message}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>{t('lastName')}</label>
              <input
                className={`${styles.input} ${
                  errors.lastname ? styles.errorBorder : ''
                }`}
                {...register('lastname', { required: t('lastNameRequired') })}
                disabled={loading} // Disable input during loading
              />
              {errors.lastname && (
                <p className={styles.error}>{errors.lastname.message}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>{t('username')}</label>
              <input
                className={`${styles.input} ${
                  errors.username ? styles.errorBorder : ''
                }`}
                {...register('username', { required: t('usernameRequired') })}
                disabled={loading} // Disable input during loading
              />
              {errors.username && (
                <p className={styles.error}>{errors.username.message}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>{t('email')}</label>
              <input
                className={`${styles.input} ${
                  errors.email ? styles.errorBorder : ''
                }`}
                {...register('email', {
                  required: t('emailRequired'),
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: t('invalidEmail'),
                  },
                })}
                disabled={loading} // Disable input during loading
              />
              {errors.email && (
                <p className={styles.error}>{errors.email.message}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>{t('phone')}</label>
              <input
                className={`${styles.input} ${
                  errors.phone ? styles.errorBorder : ''
                }`}
                {...register('phone', { required: t('phoneRequired') })}
                disabled={loading} // Disable input during loading
              />
              {errors.phone && (
                <p className={styles.error}>{errors.phone.message}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>{t('birthday')}</label>
              <input
                type='date'
                className={`${styles.input} ${
                  errors.birthday ? styles.errorBorder : ''
                }`}
                {...register('birthday')}
                disabled={loading} // Disable input during loading
              />
            </div>

            <div className={styles.formGroup}>
              <label>{t('gender')}</label>
              <select
                className={styles.input}
                {...register('gender')}
                disabled={loading} // Disable input during loading
              >
                <option value='male'>{t('male')}</option>
                <option value='female'>{t('female')}</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>{t('bio')}</label>
              <textarea
                className={`${styles.input} ${
                  errors.bio ? styles.errorBorder : ''
                }`}
                {...register('bio')}
                disabled={loading} // Disable input during loading
              />
            </div>

            <Button
              title={t('saveChanges')}
              onClick={handleSubmit(onSubmitMainInfo)}
              disabled={loading} // Disable button during loading
              className={styles.button}
            />
          </form>
        </div>

        {isUserCountryAllowed(user) && (
          <div className={`${styles.card} ${styles.profileCompletionCard}`}>
            <h3 className={styles.cardTitle}>{t('profileCompletion')}</h3>
            <div className={styles.progressBarContainer}>
              <div
                className={styles.progressBar}
                style={{
                  width: user.is_profile_completed === 1 ? '100%' : '50%',
                }}>
                <span className={styles.progressText}>
                  {user.is_profile_completed === 1 ? '100%' : '50%'}{' '}
                  {t('profileCompletionPercentage')}
                </span>
              </div>
            </div>
            <Link href='/complete-profile'>
              <button className={styles.button} disabled={loading}>
                {user.is_profile_completed === 1
                  ? t('editCompleteProfile')
                  : t('completeProfile')}
              </button>
            </Link>
          </div>
        )}

        {/* Change Profile Image Card */}
        <div className={`${styles.card} ${styles.changeProfileImageCard}`}>
          <h3 className={styles.cardTitle}>{t('changeProfileImage')}</h3>
          <form
            onSubmit={profileImageHandleSubmit(onSubmitProfileImage)}
            className={styles.profileImageContainer}>
            <img
              src={selectedImage}
              alt={t('profileImage')}
              className={styles.profileImage}
            />
            <div className={styles.profileImageOverlay}>
              {t('clickToChange')}
            </div>
            <label className={styles.editImageButton}>
              <input
                type='file'
                accept="image/*"
                className={styles.fileInput}
                {...profileImageRegister('profileImage')}
                onChange={handleImageChange}
                disabled={loading}
              />
              <span className={styles.editIcon}>✎</span>
            </label>
          </form>

          <button
            className={styles.updateImageButton}
            onClick={profileImageHandleSubmit(onSubmitProfileImage)}
            disabled={loading || !imageFile}>
            {loading ? t('updating') : t('updateImage')}
          </button>
          {imageFile && (
            <div className={styles.selectedFileName}>
              {imageFile.name}
            </div>
          )}
        </div>

        {/* Change Password Card */}
        <div className={`${styles.card} ${styles.changePasswordCard}`}>
          <h3 className={styles.cardTitle}>{t('changePassword')}</h3>
          <form
            onSubmit={passwordHandleSubmit(onSubmitPassword)}
            className={styles.form}>
            <div className={styles.formGroup}>
              <label>{t('newPassword')}</label>
              <input
                className={`${styles.input} ${
                  passwordErrors.password ? styles.errorBorder : ''
                }`}
                type='password'
                {...passwordRegister('password', {
                  required: t('passwordRequired'),
                  minLength: {
                    value: 6,
                    message: t('passwordMinLength'),
                  },
                })}
                disabled={loading} // Disable input during loading
              />
              {passwordErrors.password && (
                <p className={styles.error}>
                  {passwordErrors.password.message}
                </p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>{t('confirmPassword')}</label>
              <input
                className={`${styles.input} ${
                  passwordErrors.confirmPassword ? styles.errorBorder : ''
                }`}
                type='password'
                {...passwordRegister('confirmPassword', {
                  required: t('confirmPasswordRequired'),
                  validate: (value) =>
                    value === passwordWatch('password') ||
                    t('passwordMismatch'),
                })}
                disabled={loading} // Disable input during loading
              />
              {passwordErrors.confirmPassword && (
                <p className={styles.error}>
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              className={styles.button}
              title={t('changePassword')}
              onClick={passwordHandleSubmit(onSubmitPassword)}
              disabled={loading} // Disable button during loading
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
