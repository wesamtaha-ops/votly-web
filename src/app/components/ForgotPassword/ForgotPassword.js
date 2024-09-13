'use client'; // Ensure this component is treated as a client-side component

import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl'; // Import for translations
import styles from './ForgotPassword.module.css';

const ForgotPassword = () => {
  const t = useTranslations('ForgotPassword'); // Initialize translations

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>{t('forgotPasswordTitle')}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          className={styles.input}
          {...register('email', {
            required: t('emailRequired'),
            pattern: { value: /^\S+@\S+$/i, message: t('invalidEmail') },
          })}
          placeholder={t('emailPlaceholder')}
        />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}
        <br />
        <button className={styles.button} type='submit'>
          {t('resetPasswordButton')}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
