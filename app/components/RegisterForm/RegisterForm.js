'use client'; // Ensure this component is treated as a client-side component
import react, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import styles from './RegisterForm.module.css';
import { callApi } from '../../../helper';
import { signIn } from 'next-auth/react';
import { redirect } from 'next/navigation';

const RegisterForm = () => {
  const [redirection, setRedirection] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [countries, setCountries] = useState([]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async (payload) => {
    try {
      const { year, month } = payload;

      // Convert month to numeric value (01 for January, 02 for February, etc.)
      const monthNumbers = {
        January: '01',
        February: '02',
        March: '03',
        April: '04',
        May: '05',
        June: '06',
        July: '07',
        August: '08',
        September: '09',
        October: '10',
        November: '11',
        December: '12',
      };

      // Construct the birthday in YYYY-MM-DD format (assuming day is always 01)
      const birthday = `${year}-${monthNumbers[month] || '01'}-01`;

      // Add the birthday to the payload
      payload.birthday = birthday;

      const res = await callApi({
        type: 'post',
        url: 'register',
        data: payload,
      });

      if (res.status == 1) {
        const { error, status } = await signIn('credentials', {
          email: payload.email,
          password: payload.password,
          redirect: false,
        });

        if (error) {
          setRequestError(error.message);
          console.log('error', error);
        } else {
          setRedirection(true);
        }
      } else {
        setRequestError(res.message);
      }
    } catch (error) {
      setRequestError('Email / Phone number is already exist');
    }
  };

  useEffect(() => {
    if (redirection) {
      redirect('/email-verification');
    }

    return () => {
      setRedirection(false);
    };
  }, [redirection]);

  async function getCountries() {
    const res = await callApi({
      type: 'get',
      url: 'countries',
    });

    setCountries(res.data);
  }

  useEffect(() => {
    getCountries();
  }, []);

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Sign up for Votly</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {requestError && (
          <p role='alert' className={styles.error}>
            {requestError}
          </p>
        )}

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
              errors.firstname ? styles.errorBorder : ''
            }`}
            {...register('firstname', { required: 'First name is required' })}
            placeholder='First name'
          />
          <input
            className={`${styles.inputHalf} ${
              errors.lastname ? styles.errorBorder : ''
            }`}
            {...register('lastname', { required: 'Last name is required' })}
            placeholder='Last name'
          />
        </div>
        {errors.firstname && (
          <p className={styles.error}>{errors.firstname.message}</p>
        )}
        {errors.lastname && (
          <p className={styles.error}>{errors.lastname.message}</p>
        )}

        <input
          className={`${styles.input} ${
            errors.phone ? styles.errorBorder : ''
          }`}
          {...register('phone', { required: 'Phone is required' })}
          placeholder='Phone'
        />

        {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}

        <div className={styles.genderContainer}>
          <label className={styles.label}>Are you…?</label>
          <div>
            <input
              type='radio'
              value='female'
              {...register('gender', { required: 'Gender is required' })}
              className={styles.radioInput}
            />
            Female
          </div>
          <div>
            <input
              type='radio'
              value='male'
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
            <option value='March'>March</option>
            <option value='April'>April</option>
            <option value='May'>May</option>
            <option value='June'>June</option>
            <option value='July'>July</option>
            <option value='August'>August</option>
            <option value='September'>September</option>
            <option value='October'>October</option>
            <option value='November'>November</option>
            <option value='December'>December</option>

            {/* Add other months */}
          </select>
          <select
            className={`${styles.inputHalf} ${
              errors.year ? styles.errorBorder : ''
            }`}
            {...register('year')}>
            <option value=''>Year</option>
            <option value='2015'>2015</option>
            <option value='2014'>2014</option>
            <option value='2013'>2013</option>
            <option value='2012'>2012</option>
            <option value='2011'>2011</option>
            <option value='2010'>2010</option>
            <option value='2009'>2009</option>
            <option value='2008'>2008</option>
            <option value='2007'>2007</option>
            <option value='2006'>2006</option>
            <option value='2005'>2005</option>
            <option value='2004'>2004</option>
            <option value='2003'>2003</option>
            <option value='2002'>2002</option>
            <option value='2001'>2001</option>
            <option value='2000'>2000</option>
            <option value='1999'>1999</option>
            <option value='1998'>1998</option>
            <option value='1997'>1997</option>
            <option value='1996'>1996</option>
            <option value='1995'>1995</option>
            <option value='1994'>1994</option>
            <option value='1993'>1993</option>
            <option value='1992'>1992</option>
            <option value='1991'>1991</option>
            <option value='1990'>1990</option>
            <option value='1989'>1989</option>
            <option value='1988'>1988</option>
            <option value='1987'>1987</option>
            <option value='1986'>1986</option>
            <option value='1985'>1985</option>
            <option value='1984'>1984</option>
            <option value='1983'>1983</option>
            <option value='1982'>1982</option>
            <option value='1981'>1981</option>
            <option value='1980'>1980</option>
            <option value='1979'>1979</option>
            <option value='1978'>1978</option>
            <option value='1977'>1977</option>
            <option value='1976'>1976</option>
            <option value='1975'>1975</option>
            <option value='1974'>1974</option>
            <option value='1973'>1973</option>
            <option value='1972'>1972</option>
            <option value='1971'>1971</option>
            <option value='1970'>1970</option>
            <option value='1969'>1969</option>
            <option value='1968'>1968</option>
            <option value='1967'>1967</option>
            <option value='1966'>1966</option>
            <option value='1965'>1965</option>
            <option value='1964'>1964</option>
            <option value='1963'>1963</option>
            <option value='1962'>1962</option>
            <option value='1961'>1961</option>
            <option value='1960'>1960</option>
            <option value='1959'>1959</option>
            <option value='1958'>1958</option>
            <option value='1957'>1957</option>
            <option value='1956'>1956</option>
            <option value='1955'>1955</option>
            <option value='1954'>1954</option>
            <option value='1953'>1953</option>
            <option value='1952'>1952</option>
            <option value='1951'>1951</option>
            <option value='1950'>1950</option>
            {/* Add other years */}
          </select>
        </div>

        <select
          className={`${styles.input} ${
            errors.country_id ? styles.errorBorder : ''
          }`}
          {...register('country_id', { required: 'Country is required' })}>
          <option value=''>What's your citizenship?</option>
          {countries.map((country, ind) => (
            <option value={ind}>{country.name}</option>
          ))}
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
