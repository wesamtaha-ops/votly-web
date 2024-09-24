'use client'; // Ensures this is a client-side component

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  CircularProgress,
  TextField,
  Button,
  MenuItem,
  Typography,
} from '@mui/material';
import styles from './ProfileCompletionForm.module.css';
import { useLocale, useTranslations } from 'next-intl'; // Import for translations

const ProfileCompletionForm = ({ profile, onSubmit }) => {
  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      nationality: '',
      occupation: '',
      accommodation: '',
      education_level: '',
      family_members: '',
      household_income: '',
      industry: '',
      owned_cars: '',
      travel_habits: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState({ en: 'USD', ar: ' دولار أمريكي' }); // Default currency
  const t = useTranslations('ProfileCompletionForm'); // Initialize translations
  const lang = useLocale(); // Get the current locale
  const isArabic = lang === 'ar';

  const fields = {
    nationality: watch('nationality'),
    household_income: watch('household_income'),
    education_level: watch('education_level'),
    occupation: watch('occupation'),
    industry: watch('industry'),
    owned_cars: watch('owned_cars'),
    accommodation: watch('accommodation'),
    travel_habits: watch('travel_habits'),
    family_members: watch('family_members'),
  };



  useEffect(() => {
    if (profile) {
      reset({
        nationality: profile.nationality,
        household_income: profile.household_income,
        education_level: profile.education_level,
        occupation: profile.occupation,
        industry: profile.industry,
        owned_cars: profile.owned_cars,
        accommodation: profile.accommodation,
        travel_habits: profile.travel_habits,
        family_members: profile.family_members,
      });
    }
  }, [profile]);

  // Update currency based on nationality
  useEffect(() => {
    switch (fields.nationality) {
      case 'American':
        setCurrency({ en: 'USD', ar: 'دولار أمريكي' });
        break;
      case 'Saudi':
        setCurrency({ en: 'SAR', ar: 'ريال سعودي' });
        break;
      case 'Emirati':
        setCurrency({ en: 'AED', ar: 'درهم إماراتي' });
        break;
      case 'Egyptian':
        setCurrency({ en: 'EGP', ar: 'جنيه مصري' });
        break;
      case 'Bahraini':
        setCurrency({ en: 'BHD', ar: 'دينار بحريني' });
        break;
      case 'Bangladeshi':
        setCurrency({ en: 'BDT', ar: 'تاكا بنجلاديشي' });
        break;
      case 'Comoran':
        setCurrency({ en: 'KMF', ar: 'فرنك جزر القمر' });
        break;
      case 'Djiboutian':
        setCurrency({ en: 'DJF', ar: 'فرنك جيبوتي' });
        break;
      case 'Algerian':
        setCurrency({ en: 'DZD', ar: 'دينار جزائري' });
        break;
      case 'European':
        setCurrency({ en: 'EUR', ar: 'يورو' });
        break;
      case 'Filipino':
        setCurrency({ en: 'PHP', ar: 'بيزو فلبيني' });
        break;
      case 'Indian':
        setCurrency({ en: 'INR', ar: 'روبية هندية' });
        break;
      case 'Iranian':
        setCurrency({ en: 'IRR', ar: 'ريال إيراني' });
        break;
      case 'Iraqi':
        setCurrency({ en: 'IQD', ar: 'دينار عراقي' });
        break;
      case 'Jordanian':
        setCurrency({ en: 'JOD', ar: 'دينار أردني' });
        break;
      case 'Kuwaiti':
        setCurrency({ en: 'KWD', ar: 'دينار كويتي' });
        break;
      case 'Lebanese':
        setCurrency({ en: 'LBP', ar: 'ليرة لبنانية' });
        break;
      case 'Libyan':
        setCurrency({ en: 'LYD', ar: 'دينار ليبي' });
        break;
      case 'Mauritanian':
        setCurrency({ en: 'MRU', ar: 'أوقية موريتانية' });
        break;
      case 'Moroccan':
        setCurrency({ en: 'MAD', ar: 'درهم مغربي' });
        break;
      case 'Omani':
        setCurrency({ en: 'OMR', ar: 'ريال عماني' });
        break;
      case 'Pakistani':
        setCurrency({ en: 'PKR', ar: 'روبية باكستانية' });
        break;
      case 'Palestinian':
        setCurrency({ en: 'ILS', ar: 'شيكل ' });
        break;
      case 'Qatari':
        setCurrency({ en: 'QAR', ar: 'ريال قطري' });
        break;
      case 'Somalian':
        setCurrency({ en: 'SOS', ar: 'شلن صومالي' });
        break;
      case 'Sudanese':
        setCurrency({ en: 'SDG', ar: 'جنيه سوداني' });
        break;
      case 'Syrian':
        setCurrency({ en: 'SYP', ar: 'ليرة سورية' });
        break;
      case 'Tunisian':
        setCurrency({ en: 'TND', ar: 'دينار تونسي' });
        break;
      case 'Yemeni':
        setCurrency({ en: 'YER', ar: 'ريال يمني' });
        break;
      default:
        setCurrency({ en: 'USD', ar: 'دولار أمريكي' }); // Default to SAR
    }
  }, [fields.nationality]);

  const completedFields = Object.values(fields).filter(Boolean).length;
  const totalFields = Object.keys(fields).length;
  const completionPercentage = (completedFields / totalFields) * 100;

  const handleFormSubmit = async (data) => {
    setLoading(true);
    await onSubmit(data);
    setLoading(false);
    window.location.href = '/surveys';
  };

  return (
    <div className={styles.container}>
      <div className={styles.twoRowMobile} /* Add the class here */>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: 'inherit',
          }}>
          <Typography variant='h4' component='h1' gutterBottom>
            {t('beforeContinue')}
          </Typography>
          <Typography variant='h6' component='h4' gutterBottom>
            {t('moreDetails')}
          </Typography>
        </div>

        <div className={styles.progressContainer}>
          <CircularProgress
            variant='determinate'
            value={completionPercentage}
          />
          <Typography variant='body1' className={styles.progressText}>
            {Math.round(completionPercentage)}% {t('complete')}
          </Typography>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
        <TextField
          select
          label={isArabic ? ' الجنسية' : 'Nationality'}
          {...register('nationality', { required: true })}
          variant='outlined'
          fullWidth
          className={styles.formField}
          value={fields.nationality}>
          <MenuItem value='African'>{isArabic ? 'أفريقي' : 'African'}</MenuItem>
          <MenuItem value='Algerian'>
            {isArabic ? 'جزائري' : 'Algerian'}
          </MenuItem>
          <MenuItem value='American'>
            {isArabic ? 'أمريكي' : 'American'}
          </MenuItem>
          <MenuItem value='Bangladeshi'>
            {isArabic ? 'بنغلاديشي' : 'Bangladeshi'}
          </MenuItem>
          <MenuItem value='Comoran'>{isArabic ? 'قمري' : 'Comoran'}</MenuItem>
          <MenuItem value='Djiboutian'>
            {isArabic ? 'جيبوتي' : 'Djiboutian'}
          </MenuItem>
          <MenuItem value='European'>
            {isArabic ? 'أوروبي' : 'European'}
          </MenuItem>
          <MenuItem value='Filipino'>
            {isArabic ? 'فلبيني' : 'Filipino'}
          </MenuItem>
          <MenuItem value='Indian'>{isArabic ? 'هندي' : 'Indian'}</MenuItem>
          <MenuItem value='Iranian'>{isArabic ? 'إيراني' : 'Iranian'}</MenuItem>
          <MenuItem value='Iraqi'>{isArabic ? 'عراقي' : 'Iraqi'}</MenuItem>
          <MenuItem value='Jordanian'>
            {isArabic ? 'أردني' : 'Jordanian'}
          </MenuItem>
          <MenuItem value='Kuwaiti'>{isArabic ? 'كويتي' : 'Kuwaiti'}</MenuItem>
          <MenuItem value='Lebanese'>
            {isArabic ? 'لبناني' : 'Lebanese'}
          </MenuItem>
          <MenuItem value='Mauritanian'>
            {isArabic ? 'موريتاني' : 'Mauritanian'}
          </MenuItem>
          <MenuItem value='Moroccan'>
            {isArabic ? 'مغربي' : 'Moroccan'}
          </MenuItem>
          <MenuItem value='Omani'>{isArabic ? 'عماني' : 'Omani'}</MenuItem>
          <MenuItem value='Pakistani'>
            {isArabic ? 'باكستاني' : 'Pakistani'}
          </MenuItem>
          <MenuItem value='Palestinian'>
            {isArabic ? 'فلسطيني' : 'Palestinian'}
          </MenuItem>
          <MenuItem value='Qatari'>{isArabic ? 'قطري' : 'Qatari'}</MenuItem>
          <MenuItem value='Saudi'>{isArabic ? 'سعودي' : 'Saudi'}</MenuItem>
          <MenuItem value='Somalian'>
            {isArabic ? 'صومالي' : 'Somalian'}
          </MenuItem>
          <MenuItem value='Sudanese'>
            {isArabic ? 'سوداني' : 'Sudanese'}
          </MenuItem>
          <MenuItem value='Syrian'>{isArabic ? 'سوري' : 'Syrian'}</MenuItem>
          <MenuItem value='Tunisian'>
            {isArabic ? 'تونسي' : 'Tunisian'}
          </MenuItem>
          <MenuItem value='Yemeni'>{isArabic ? 'يمني' : 'Yemeni'}</MenuItem>
          <MenuItem value='Other'>{isArabic ? 'أخرى' : 'Other'}</MenuItem>
          <MenuItem value='Prefer not to say'>
            {isArabic ? 'أفضل عدم القول' : 'Prefer not to say'}
          </MenuItem>
        </TextField>

     

        <TextField
          select
          label={isArabic ? 'الدخل الشهري' : 'Household Income'}
          {...register('household_income', { required: true })}
          variant='outlined'
          fullWidth
          className={styles.formField}
          value={fields.household_income}>
          <MenuItem value={`Less than 1500 ${currency.en} per month`}>
            {isArabic
              ? `أقل من 1500 ${currency.ar} شهرياً`
              : `Less than 1500 ${currency.en} per month`}
          </MenuItem>
          <MenuItem value={`5000 - 10000 ${currency.en} per month`}>
            {isArabic
              ? `5000 - 10000 ${currency.ar} شهرياً`
              : `5000 - 10000 ${currency.en} per month`}
          </MenuItem>
          <MenuItem value={`10000 - 20000 ${currency.en} per month`}>
            {isArabic
              ? `10000 - 20000 ${currency.ar} شهرياً`
              : `10000 - 20000 ${currency.en} per month`}
          </MenuItem>
          <MenuItem value={`More than 20000 ${currency.en} per month`}>
            {isArabic
              ? `أكثر من 20000 ${currency.ar} شهرياً`
              : `More than 20000 ${currency.en} per month`}
          </MenuItem>
          <MenuItem value={isArabic ? 'أفضل عدم القول' : 'Prefer not to say'}>
            {isArabic ? 'أفضل عدم القول' : 'Prefer not to say'}
          </MenuItem>
        </TextField>

        <TextField
          select
          label={isArabic ? 'المستوى التعليمي' : 'Education Level'}
          {...register('education_level', { required: true })}
          variant='outlined'
          fullWidth
          className={styles.formField}
          value={fields.education_level}>
          <MenuItem value='Not completed'>
            {isArabic ? 'لم يكمل' : 'Not completed'}
          </MenuItem>
          <MenuItem value='High school or equivalent'>
            {isArabic ? 'المدرسة الثانوية أو ما يعادلها' : 'High School'}
          </MenuItem>
          <MenuItem value='Bachelor’s Degree'>
            {isArabic ? 'درجة البكالوريوس' : 'Bachelor’s Degree'}
          </MenuItem>
          <MenuItem value='Master’s Degree'>
            {isArabic ? 'درجة الماجستير' : 'Master’s Degree'}
          </MenuItem>
          <MenuItem value='Doctorate or higher'>
            {isArabic ? 'دكتوراه أو أعلى' : 'PhD'}
          </MenuItem>
          <MenuItem value={isArabic ? 'أفضل عدم القول' : 'Prefer not to say'}>
            {isArabic ? 'أفضل عدم القول' : 'Prefer not to say'}
          </MenuItem>
        </TextField>

        <TextField
          select
          label={isArabic ? 'المهنة' : 'Occupation'}
          {...register('occupation', { required: true })}
          variant='outlined'
          fullWidth
          className={styles.formField}
          value={fields.occupation}>
          <MenuItem value='Student'>{isArabic ? 'طالب' : 'Student'}</MenuItem>
          <MenuItem value='Employee -non professional worker'>
            {isArabic
              ? 'موظف - عامل غير محترف'
              : 'Employee -non professional worker'}
          </MenuItem>
          <MenuItem value='Professional worker'>
            {isArabic ? 'عامل محترف' : 'Professional worker'}
          </MenuItem>
          <MenuItem value='Business owner'>
            {isArabic ? 'صاحب عمل' : 'Business owner'}
          </MenuItem>
          <MenuItem value='Retired'>{isArabic ? 'متقاعد' : 'Retired'}</MenuItem>
          <MenuItem value='I do not work/ House Wife'>
            {isArabic ? 'لا أعمل / ربة منزل' : 'I do not work/ House Wife'}
          </MenuItem>
        </TextField>

        <TextField
          select
          label={isArabic ? 'الصناعة' : 'Industry'}
          {...register('industry', { required: true })}
          variant='outlined'
          fullWidth
          className={styles.formField}
          value={fields.industry}>
          <MenuItem value='Advertising/Media/Publishing/Public Relations'>
            {isArabic
              ? 'الإعلان / وسائل الإعلام / النشر / العلاقات العامة'
              : 'Advertising/Media/Publishing/Public Relations'}
          </MenuItem>
          <MenuItem value='Banking/Finance'>
            {isArabic ? 'المصرفية / التمويل' : 'Banking/Finance'}
          </MenuItem>
          <MenuItem value='Education'>
            {isArabic ? 'التعليم' : 'Education'}
          </MenuItem>
          <MenuItem value='Healthcare'>
            {isArabic ? 'الرعاية الصحية' : 'Healthcare'}
          </MenuItem>
          <MenuItem value='Information Technology'>
            {isArabic ? 'تكنولوجيا المعلومات' : 'Information Technology'}
          </MenuItem>
          <MenuItem value='Manufacturing'>
            {isArabic ? 'التصنيع' : 'Manufacturing'}
          </MenuItem>
          <MenuItem value='Retail'>
            {isArabic ? 'البيع بالتجزئة' : 'Retail'}
          </MenuItem>
          <MenuItem value='I do not work/ House Wife'>
            {isArabic ? 'لا أعمل / ربة منزل' : 'I do not work/ House Wife'}
          </MenuItem>
          <MenuItem value={isArabic ? 'أفضل عدم القول' : 'Prefer not to say'}>
            {isArabic ? 'أفضل عدم القول' : 'Prefer not to say'}
          </MenuItem>
        </TextField>

        <TextField
          select
          label={isArabic ? 'عدد السيارات المملوكة' : 'Owned Cars'}
          {...register('owned_cars', { required: true })}
          variant='outlined'
          fullWidth
          className={styles.formField}
          value={fields.owned_cars}>
          <MenuItem value='We do not own any cars'>
            {isArabic ? 'نحن لا نملك أي سيارات' : 'We do not own any cars'}
          </MenuItem>
          <MenuItem value='1 car only'>
            {isArabic ? 'سيارة واحدة فقط' : '1 car only'}
          </MenuItem>
          <MenuItem value='2 cars'>{isArabic ? 'سيارتان' : '2 cars'}</MenuItem>
          <MenuItem value='3 or more cars'>
            {isArabic ? 'ثلاث سيارات أو أكثر' : '3 or more cars'}
          </MenuItem>
        </TextField>

        <TextField
          select
          label={isArabic ? 'الإقامة' : 'Accommodation'}
          {...register('accommodation', { required: true })}
          variant='outlined'
          fullWidth
          className={styles.formField}
          value={fields.accommodation}>
          <MenuItem value='Rented Apartment'>
            {isArabic ? 'شقة مستأجرة' : 'Rented Apartment'}
          </MenuItem>
          <MenuItem value='Owned Apartment'>
            {isArabic ? 'شقة مملوكة' : 'Owned Apartment'}
          </MenuItem>
          <MenuItem value='Rented house'>
            {isArabic ? 'منزل مستأجر' : 'Rented house'}
          </MenuItem>
          <MenuItem value='Owned house'>
            {isArabic ? 'منزل مملوك' : 'Owned house'}
          </MenuItem>
          <MenuItem value='Living with Family'>
            {isArabic ? 'العيش مع العائلة' : 'Living with Family'}
          </MenuItem>
        </TextField>

        <TextField
          select
          label={isArabic ? 'عادات السفر' : 'Travel Habits'}
          {...register('travel_habits', { required: true })}
          variant='outlined'
          fullWidth
          className={styles.formField}
          value={fields.travel_habits}>
          <MenuItem value='I do not travel at all'>
            {isArabic ? 'لا أسافر على الإطلاق' : 'I do not travel at all'}
          </MenuItem>
          <MenuItem value='I travel for business at least once a year'>
            {isArabic
              ? 'أسافر للعمل مرة واحدة على الأقل في السنة'
              : 'I travel for business at least once a year'}
          </MenuItem>
          <MenuItem value='I travel for leisure at least once a year'>
            {isArabic
              ? 'أسافر للترفيه مرة واحدة على الأقل في السنة'
              : 'I travel for leisure at least once a year'}
          </MenuItem>
          <MenuItem value='I travel for both Travel and leisure at least once a year'>
            {isArabic
              ? 'أسافر للعمل والترفيه مرة واحدة على الأقل في السنة'
              : 'I travel for both Travel and leisure at least once a year'}
          </MenuItem>
          <MenuItem value='I prefer not to share'>
            {isArabic ? 'أفضل عدم المشاركة' : 'I prefer not to share'}
          </MenuItem>
        </TextField>

        <TextField
          select
          label={isArabic ? 'عدد أفراد الأسرة' : 'Family Members'}
          {...register('family_members', { required: true })}
          variant='outlined'
          fullWidth
          className={styles.formField}
          value={fields.family_members}>
          <MenuItem value='1'>{isArabic ? '1' : '1'}</MenuItem>
          <MenuItem value='2'>{isArabic ? '2' : '2'}</MenuItem>
          <MenuItem value='3'>{isArabic ? '3' : '3'}</MenuItem>
          <MenuItem value='4'>{isArabic ? '4' : '4'}</MenuItem>
          <MenuItem value='5 or more'>
            {isArabic ? '5 أو أكثر' : '5 or more'}
          </MenuItem>
        </TextField>

        <Button
          type='submit'
          variant='contained'
          color='primary'
          disabled={loading}
          className={styles.submitButton}>
          {loading ? t('submitting') : t('submit')}
        </Button>
      </form>
    </div>
  );
};

export default ProfileCompletionForm;
