'use client';

import Link from 'next/link';
import styles from './LoginForm.module.css';

const Login = () => {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Log in</h2>
        <form className={styles.form}>
          <input
            type='text'
            placeholder='Phone number or email'
            className={styles.input}
          />
          <input
            type='password'
            placeholder='Password'
            className={styles.input}
          />
          <button type='submit' className={styles.loginButton}>
            Log in
          </button>
        </form>
        <br />
        <Link href='/forgot-password' className={styles.forgotPasswordLink}>
          Forgot your password?
        </Link>
      </div>
    </div>
  );
};

export default Login;
