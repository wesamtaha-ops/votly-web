'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useTranslations } from 'next-intl'; // Import translation hook
import styles from './RegisterForm.module.css';
import { callApi } from '../../helper';
import { signIn } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useLocale } from 'next-intl';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const RegisterForm = () => {
  const [redirection, setRedirection] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState('971'); // Track phone code
  const [phoneNumber, setPhoneNumber] = useState(`+971`); // Track the phone number input
  const t = useTranslations('Register'); // Initialize translations
  const locale = useLocale(); // Get the current locale

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue, // This will be used to programmatically set phone number
  } = useForm();

  const onSubmit = async (payload) => {
    try {
      const { year, month } = payload;

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

      const birthday = `${year}-${monthNumbers[month] || '01'}-01`;
      payload.birthday = birthday;
      payload.phone = phoneNumber;
      payload.city = 'Dubai';

      const res = await callApi({
        type: 'post',
        url: 'register',
        data: payload,
      });

      if (res.status == 1) {
        const { error } = await signIn('credentials', {
          email: payload.email,
          password: payload.password,
          redirect: false,
        });

        if (error) {
          setRequestError(t('emailExists'));
        } else {
          setRedirection(true);
        }
      } else {
        setRequestError(res.message);
      }
    } catch (error) {
      setRequestError(t('emailExists'));
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

  // Handle country selection and set phone code
  const handleCountryChange = (e) => {
    const selectedCountryId = e.target.value;
    const selectedCountry = countries.find(
      (country) => country.id == selectedCountryId,
    );
    if (selectedCountry) {
      setSelectedCountryCode(selectedCountry.phone_code);
      setPhoneNumber(`+${selectedCountry.phone_code}`); // Update phone number with the new country code
      setValue('phone', `+${selectedCountry.phone_code}`);
    }
  };

  // Handle phone number change
  const handlePhoneNumberChange = (e) => {
    setValue('phone', e.target.value); // Update phone using setValue
    console.log(e.target.value);
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>{t('signUpTitle')}</h2>
      <br />
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {requestError && (
          <p role='alert' className={styles.error}>
            {requestError}
          </p>
        )}
        <div className={styles.nameContainer}>
          <input
            className={`${styles.inputHalf} ${
              errors.firstname ? styles.errorBorder : ''
            }`}
            {...register('firstname', { required: t('firstNameRequired') })}
            placeholder={t('firstName')}
          />
          <input
            className={`${styles.inputHalf} ${
              errors.lastname ? styles.errorBorder : ''
            }`}
            {...register('lastname', { required: t('lastNameRequired') })}
            placeholder={t('lastName')}
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
            errors.email ? styles.errorBorder : ''
          }`}
          {...register('email', {
            required: t('emailRequired'),
            pattern: { value: /^\S+@\S+$/i, message: t('invalidEmail') },
          })}
          placeholder={t('email')}
        />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}
        <input
          className={`${styles.input} ${
            errors.password ? styles.errorBorder : ''
          }`}
          {...register('password', {
            required: t('passwordRequired'),
            minLength: {
              value: 6,
              message: t('passwordMinLength'),
            },
          })}
          type='password'
          placeholder={t('password')}
        />
        {errors.password && (
          <p className={styles.error}>{errors.password.message}</p>
        )}
        <label className={styles.label}>{t('phone')}</label>
        {/* <PhoneNumberInput
          className={`${styles.input} ${
            errors.phone ? styles.errorBorder : ''
          }`}
          {...register('phone', { required: t('phoneRequired') })}
          placeholder={`${t('phone')} (+${selectedCountryCode})`}
          defaultCountry='AE' // Set the default country to UAE
          onChange={(value) => setValue('phone', value)} // Update form state with the formatted value
        /> */}
        <div dir='ltr'>
          <PhoneInput
            inputClass={styles.react_tel_input_custom}
            inputProps={{
              preferredCountries: ['AE', 'SA', 'KW', 'QA', 'BH', 'OM'],
              name: 'phone',
              autoFormat: true,
              required: true,
              countryCodeEditable: false,
              enableSearch: true,
            }}
            country={'AE'}
            value={phoneNumber}
            jumpCursorToEnd={true}
            onChange={(value) => setPhoneNumber(value)}
          />
        </div>
        {/* <input
          dir='ltr'
          onChange={handlePhoneNumberChange}
          defaultValue={phoneNumber}
          // Handle phone number changes
          className={`${styles.input} ${
            errors.phone ? styles.errorBorder : ''
          }`}
          {...register('phone', { required: t('phoneRequired') })}
          placeholder={`${t('phone')} (+${selectedCountryCode})`} // Display phone with code
        /> */}
        {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}
        <div className={styles.genderContainer}>
          <label className={styles.label}>{t('genderLabel')}</label>
          <div>
            <input
              type='radio'
              value='female'
              {...register('gender', { required: t('genderRequired') })}
              className={styles.radioInput}
            />
            {t('female')}
          </div>
          <div>
            <input
              type='radio'
              value='male'
              {...register('gender', { required: t('genderRequired') })}
              className={styles.radioInput}
            />
            {t('male')}
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
            <option value=''>{t('month')}</option>
            <option value='January'>{t('january')}</option>
            <option value='February'>{t('february')}</option>
            <option value='March'>{t('march')}</option>
            <option value='April'>{t('april')}</option>
            <option value='May'>{t('may')}</option>
            <option value='June'>{t('june')}</option>
            <option value='July'>{t('july')}</option>
            <option value='August'>{t('august')}</option>
            <option value='September'>{t('september')}</option>
            <option value='October'>{t('october')}</option>
            <option value='November'>{t('november')}</option>
            <option value='December'>{t('december')}</option>
          </select>
          <select
            className={`${styles.inputHalf} ${
              errors.year ? styles.errorBorder : ''
            }`}
            {...register('year')}>
            <option value=''>{t('year')}</option>
            {/* Year options */}
            {Array.from({ length: 100 }, (_, i) => (
              <option key={i} value={2022 - i}>
                {2022 - i}
              </option>
            ))}
          </select>
        </div>
        <select
          className={`${styles.input} ${
            errors.country_id ? styles.errorBorder : ''
          }`}
          {...register('country_id', { required: t('countryRequired') })}
          onChange={handleCountryChange} // Capture country selection
        >
          <option value=''>{t('citizenship')}</option>
          {countries.map((country) => (
            <option
              selected={country.id === 227}
              key={country.id}
              value={country.id}>
              {/* Show flag and name based on locale */}
              <img
                src={country.icon}
                alt={`${country.name_en} flag`}
                style={{ width: '20px', marginRight: '8px' }}
              />
              {locale === 'en' ? country.name_en : country.name_ar}
            </option>
          ))}
        </select>
        <div className={styles.termsContainer}>
          <label>
            <input
              type='checkbox'
              {...register('terms', { required: t('acceptTerms') })}
              className={styles.checkbox}
            />
            {t('acceptTermsText')} <Link href='/terms'>{t('terms')}</Link>
          </label>
          <br />
          <br />
          <label>
            <input
              type='checkbox'
              {...register('privacy', { required: t('acceptPrivacy') })}
              className={styles.checkbox}
            />
            {t('acceptPrivacyText')} <Link href='/privacy'>{t('privacy')}</Link>
          </label>
        </div>
        {errors.terms && <p className={styles.error}>{errors.terms.message}</p>}
        {errors.privacy && (
          <p className={styles.error}>{errors.privacy.message}</p>
        )}
        <br />
        <button className={styles.button} type='submit'>
          {t('signUp')}
        </button>
      </form>
      <p className={styles.loginLink}>
        {t('alreadyHaveAccount')}{' '}
        <Link href='/login' className={styles.link}>
          {t('logIn')}
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
