'use client'; // Ensure this component is treated as a client-side component

import { useForm } from 'react-hook-form';
import Link from 'next/link';
import styles from './RegisterForm.module.css';

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Sign up for Votly</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <input
          className={`${styles.input} ${
            errors.email ? styles.errorBorder : ''
          }`}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
          })}
          placeholder='Email'
        />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}

        <input
          className={`${styles.input} ${
            errors.password ? styles.errorBorder : ''
          }`}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
          type='password'
          placeholder='Password'
        />
        {errors.password && (
          <p className={styles.error}>{errors.password.message}</p>
        )}

        <div className={styles.nameContainer}>
          <input
            className={`${styles.inputHalf} ${
              errors.firstName ? styles.errorBorder : ''
            }`}
            {...register('firstName', { required: 'First name is required' })}
            placeholder='First name'
          />
          <input
            className={`${styles.inputHalf} ${
              errors.lastName ? styles.errorBorder : ''
            }`}
            {...register('lastName', { required: 'Last name is required' })}
            placeholder='Last name'
          />
        </div>
        {errors.firstName && (
          <p className={styles.error}>{errors.firstName.message}</p>
        )}
        {errors.lastName && (
          <p className={styles.error}>{errors.lastName.message}</p>
        )}

        <div className={styles.genderContainer}>
          <label className={styles.label}>Are you…?</label>
          <div>
            <input
              type='radio'
              value='Female'
              {...register('gender', { required: 'Gender is required' })}
              className={styles.radioInput}
            />
            Female
          </div>
          <div>
            <input
              type='radio'
              value='Male'
              {...register('gender', { required: 'Gender is required' })}
              className={styles.radioInput}
            />
            Male
          </div>
        </div>
        {errors.gender && (
          <p className={styles.error}>{errors.gender.message}</p>
        )}

        <div className={styles.dateOfBirthContainer}>
          <select
            className={`${styles.inputHalf} ${
              errors.month ? styles.errorBorder : ''
            }`}
            {...register('month')}>
            <option value=''>Month</option>
            <option value='January'>January</option>
            <option value='February'>February</option>
            {/* Add other months */}
          </select>
          <select
            className={`${styles.inputHalf} ${
              errors.year ? styles.errorBorder : ''
            }`}
            {...register('year')}>
            <option value=''>Year</option>
            <option value='2000'>2000</option>
            <option value='1999'>1999</option>
            {/* Add other years */}
          </select>
        </div>

        <select
          className={`${styles.input} ${
            errors.citizenship ? styles.errorBorder : ''
          }`}
          {...register('citizenship')}>
          <option value=''>What's your citizenship?</option>
          <option value='US'>United States</option>
          <option value='UK'>United Kingdom</option>
          {/* Add other countries */}
        </select>

        <div className={styles.termsContainer}>
          <label>
            <input
              type='checkbox'
              {...register('terms', { required: 'You must accept the terms' })}
              className={styles.checkbox}
            />
            I have read and accept the{' '}
            <Link href='/terms' className={styles.link}>
              Terms and Conditions
            </Link>
          </label>
          <br />
          <label>
            <input
              type='checkbox'
              {...register('privacy', {
                required: 'You must acknowledge the privacy policy',
              })}
              className={styles.checkbox}
            />
            I have read and acknowledge the{' '}
            <Link href='/privacy' className={styles.link}>
              Privacy Policy
            </Link>
          </label>
        </div>
        {errors.terms && <p className={styles.error}>{errors.terms.message}</p>}
        {errors.privacy && (
          <p className={styles.error}>{errors.privacy.message}</p>
        )}

        <button className={styles.button} type='submit'>
          Sign up
        </button>
      </form>
      <p className={styles.loginLink}>
        Already have an account?{' '}
        <Link href='/login' className={styles.link}>
          Log in
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
