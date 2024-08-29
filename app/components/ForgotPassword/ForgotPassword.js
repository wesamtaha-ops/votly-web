'use client'; // Ensure this component is treated as a client-side component

import { useForm } from 'react-hook-form';
import styles from './ForgotPassword.module.css';

const ForgotPassword = () => {
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
      <h2 className={styles.title}>Forgot your password?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          className={styles.input}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
          })}
          placeholder='Enter your email'
        />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}

        <button className={styles.button} type='submit'>
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
