'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import styles from './RegisterForm.module.css';
import { callApi } from '../../helper';
import { signIn } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useLocale } from 'next-intl';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import toast from 'react-hot-toast';

const RegisterForm = () => {
  const [redirection, setRedirection] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState(227); // Default country set to UAE (227)
  const [selectedCountryCode, setSelectedCountryCode] = useState('971');
  const [phoneNumber, setPhoneNumber] = useState(`+971`);
  const [loading, setLoading] = useState(false); // Loader state
  const t = useTranslations('Register');
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm();

  const cityOptions = {
    63: isArabic
      ? [
          'القاهرة',
          'الإسكندرية',
          'الجيزة',
          'شبرا الخيمة',
          'بورسعيد',
          'السويس',
          'المنصورة',
          'طنطا',
          'أسيوط',
          'الفيوم',
          'الإسماعيلية',
          'الزقازيق',
          'أسوان',
          'دمياط',
          'الغردقة',
          'الأقصر',
          'بني سويف',
          'قنا',
          'سوهاج',
          'المنيا',
        ]
      : [
          'Cairo',
          'Alexandria',
          'Giza',
          'Shubra El Kheima',
          'Port Said',
          'Suez',
          'Mansoura',
          'Tanta',
          'Asyut',
          'Fayoum',
          'Ismailia',
          'Zagazig',
          'Aswan',
          'Damietta',
          'Hurghada',
          'Luxor',
          'Beni Suef',
          'Qena',
          'Sohag',
          'Minya',
        ],
    227: isArabic
      ? [
          'أبوظبي',
          'دبي',
          'الشارقة',
          'عجمان',
          'أم القيوين',
          'الفجيرة',
          'رأس الخيمة',
          'خورفكان',
          'كلباء',
          'دبا الحصن',
          'العين',
        ]
      : [
          'Abu Dhabi',
          'Dubai',
          'Sharjah',
          'Ajman',
          'Umm Al Quwain',
          'Fujairah',
          'Ras Al Khaimah',
          'Khor Fakkan',
          'Kalba',
          'Dibba Al-Hisn',
          'Al Ain',
        ],
    188: isArabic
      ? [
          'الرياض',
          'جدة',
          'مكة',
          'المدينة المنورة',
          'الدمام',
          'الخبر',
          'الطائف',
          'تبوك',
          'حائل',
          'أبها',
          'نجران',
          'جازان',
          'القصيم',
          'الجبيل',
          'ينبع',
          'الباحة',
          'الخرج',
          'الهفوف',
          'خميس مشيط',
        ]
      : [
          'Riyadh',
          'Jeddah',
          'Makkah',
          'Madinah',
          'Dammam',
          'Al Khobar',
          'Taif',
          'Tabouk',
          'Hail',
          'Abha',
          'Najran',
          'Jazan',
          'Al Qassim',
          'Al Jubayl',
          'Yanbu',
          'Al Bahah',
          'Al Kharj',
          'Al Hofuf',
          'Khamis Mushait',
        ],
  };

  const onSubmit = async (payload) => {
    setLoading(true); // Start loader
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
      payload.phone = '+' + phoneNumber;

      // Add the selected city only for Egypt, UAE, or KSA
      if ([63, 227, 188].includes(parseInt(selectedCountryId))) {
        payload.city = payload.city || cityOptions[selectedCountryId][0];
      } else {
        delete payload.city; // Remove city if not Egypt, UAE, or KSA
      }

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
          toast.error(t('emailExists')); // Show toast on error
        } else {
          setRedirection(true);
        }
      } else {
        if (res.message === 'The email has already been taken.') {
          setRequestError(t('emailExists'));
          toast.error(t('emailExists'));
        } else if (res.message === 'The phone has already been taken.') {
          setRequestError(t('mobileExists'));
          toast.error(t('mobileExists'));
        } else {
          toast.error(res.message);
        }
      }
    } catch (error) {
      setRequestError(t('emailExists'));
      toast.error(t('emailExists'));
    } finally {
      setLoading(false); // Stop loader after submission
    }
  };

  useEffect(() => {
    if (redirection) {
      redirect('/email-verification');
    }
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

  const handleCountryChange = (e) => {
    const countryId = e.target.value;
    setSelectedCountryId(countryId);

    const selectedCountry = countries.find(
      (country) => country.id == countryId,
    );
    if (selectedCountry) {
      setSelectedCountryCode(selectedCountry.phone_code);
      setPhoneNumber(`+${selectedCountry.phone_code}`);
      setValue('phone', `+${selectedCountry.phone_code}`);
    }
  };

  return (
    <div
      className={styles.formContainer}
      style={{ opacity: loading ? 0.5 : 1 }} // Adjust opacity while loading
    >
      <h2 className={styles.title}>{t('signUpTitle')}</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.form}
        disabled={loading} // Disable form when loading
      >
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
            disabled={loading} // Disable input when loading
          />
          <input
            className={`${styles.inputHalf} ${
              errors.lastname ? styles.errorBorder : ''
            }`}
            {...register('lastname', { required: t('lastNameRequired') })}
            placeholder={t('lastName')}
            disabled={loading} // Disable input when loading
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
          disabled={loading} // Disable input when loading
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
          disabled={loading} // Disable input when loading
        />
        {errors.password && (
          <p className={styles.error}>{errors.password.message}</p>
        )}

        <label className={styles.label}>{t('phone')}</label>
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
            disabled={loading} // Disable phone input when loading
          />
        </div>
        {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}

        <div className={styles.genderContainer}>
          <label className={styles.label}>{t('genderLabel')}</label>
          <div>
            <input
              type='radio'
              value='female'
              {...register('gender', { required: t('genderRequired') })}
              className={styles.radioInput}
              disabled={loading} // Disable input when loading
            />
            {t('female')}
          </div>
          <div>
            <input
              type='radio'
              value='male'
              {...register('gender', { required: t('genderRequired') })}
              className={styles.radioInput}
              disabled={loading} // Disable input when loading
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
            {...register('month')}
            disabled={loading} // Disable input when loading
          >
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
            {...register('year')}
            disabled={loading} // Disable input when loading
          >
            <option value=''>{t('year')}</option>
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
          onChange={handleCountryChange}
          value={selectedCountryId}
          disabled={loading} // Disable input when loading
        >
          <option value=''>{t('citizenship')}</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {locale === 'en' ? country.name_en : country.name_ar}
            </option>
          ))}
        </select>

        {selectedCountryId &&
          [63, 227, 188].includes(parseInt(selectedCountryId)) && (
            <select
              className={`${styles.input} ${
                errors.city ? styles.errorBorder : ''
              }`}
              {...register('city', { required: t('cityRequired') })}
              disabled={loading} // Disable input when loading
            >
              <option value=''>{t('selectCity')}</option>
              {cityOptions[selectedCountryId].map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>
          )}

        <div className={styles.termsContainer}>
          <label>
            <input
              type='checkbox'
              {...register('terms', { required: t('acceptTerms') })}
              className={styles.checkbox}
              disabled={loading} // Disable input when loading
            />
            {t('acceptTermsText')} <Link href='/terms'>{t('terms')}</Link>
          </label>
          <br />
          <label>
            <input
              type='checkbox'
              {...register('privacy', { required: t('acceptPrivacy') })}
              className={styles.checkbox}
              disabled={loading} // Disable input when loading
            />
            {t('acceptPrivacyText')} <Link href='/privacy'>{t('privacy')}</Link>
          </label>
        </div>
        {errors.terms && <p className={styles.error}>{errors.terms.message}</p>}
        {errors.privacy && (
          <p className={styles.error}>{errors.privacy.message}</p>
        )}

        <button
          className={styles.button}
          type='submit'
          disabled={loading} // Disable button when loading
        >
          {loading ? t('loading') : t('signUp')} {/* Show loader text */}
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
