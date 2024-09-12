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
      residence: '',
      travel_habits: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [residenceOptions, setResidenceOptions] = useState([]);

  const fields = {
    nationality: watch('nationality'),
    household_income: watch('household_income'),
    education_level: watch('education_level'),
    residence: watch('residence'),
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
        residence: profile.residence,
        occupation: profile.occupation,
        industry: profile.industry,
        owned_cars: profile.owned_cars,
        accommodation: profile.accommodation,
        travel_habits: profile.travel_habits,
        family_members: profile.family_members,
      });
    }
  }, [profile]);

  useEffect(() => {
    const cityOptions = {
      African: [
        'Lagos',
        'Cairo',
        'Kinshasa',
        'Johannesburg',
        'Nairobi',
        'Addis Ababa',
        'Casablanca',
        'Accra',
        'Algiers',
        'Cape Town',
        'Abidjan',
        'Khartoum',
        'Dakar',
        'Douala',
        'Luanda',
        'Kampala',
        'Tunis',
        'Dar es Salaam',
        'Maputo',
        'Lusaka',
      ], // Represents major cities across Africa
      Algerian: [
        'Algiers',
        'Oran',
        'Constantine',
        'Annaba',
        'Blida',
        'Batna',
        'Djelfa',
        'Sétif',
        'Tlemcen',
        'Biskra',
        'Béjaïa',
        'Skikda',
        'Tizi Ouzou',
        'Ouargla',
        'Guelma',
      ],
      American: [
        'New York',
        'Los Angeles',
        'Chicago',
        'Houston',
        'Phoenix',
        'Philadelphia',
        'San Antonio',
        'San Diego',
        'Dallas',
        'San Jose',
        'Austin',
        'Jacksonville',
        'Fort Worth',
        'Columbus',
        'Charlotte',
        'San Francisco',
        'Indianapolis',
        'Seattle',
        'Denver',
        'Washington, D.C.',
      ],
      Bahraini: [
        'Manama',
        'Muharraq',
        'Riffa',
        'Hamad Town',
        'Isa Town',
        'Sitra',
        'Budaiya',
        'Jidhafs',
        'Malkiya',
        'Arad',
        'Sanabis',
        'Tubli',
        'Jurdab',
        'Hidd',
        'Zallaq',
      ],
      Bangladeshi: [
        'Dhaka',
        'Chittagong',
        'Khulna',
        'Rajshahi',
        'Sylhet',
        'Mymensingh',
        'Barisal',
        'Comilla',
        'Rangpur',
        'Gazipur',
        'Narayanganj',
        'Narsingdi',
        'Savar',
        'Cox’s Bazar',
        'Jessore',
      ],
      Comoran: [
        'Moroni',
        'Mutsamudu',
        'Fomboni',
        'Domoni',
        'Tsimbeo',
        'Bandamadji',
        'Kangani',
        'Mbeni',
        'Moya',
        'Ongoni',
        'Mboeni',
        'Mvouni',
      ],
      Djiboutian: [
        'Djibouti',
        'Ali Sabieh',
        'Tadjoura',
        'Obock',
        'Dikhil',
        'Arta',
        'Goubétto',
        'Holhol',
        'Galafi',
        'As Eyla',
        'Yoboki',
        'Goubeto',
      ],
      Egyptian: [
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
      Emirati: [
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
      European: [
        'London',
        'Paris',
        'Berlin',
        'Madrid',
        'Rome',
        'Vienna',
        'Athens',
        'Lisbon',
        'Amsterdam',
        'Brussels',
        'Copenhagen',
        'Stockholm',
        'Oslo',
        'Helsinki',
        'Warsaw',
        'Budapest',
        'Prague',
        'Zurich',
        'Barcelona',
        'Milan',
      ], // Example cities, replace with actual data for specific countries
      Filipino: [
        'Manila',
        'Quezon City',
        'Davao City',
        'Cebu City',
        'Zamboanga City',
        'Taguig',
        'Cagayan de Oro',
        'General Santos',
        'Iloilo City',
        'Calamba',
        'Bacolod',
        'Makati',
        'Pasig',
        'Antipolo',
        'Muntinlupa',
      ],
      Indian: [
        'Mumbai',
        'Delhi',
        'Bangalore',
        'Hyderabad',
        'Chennai',
        'Kolkata',
        'Ahmedabad',
        'Pune',
        'Surat',
        'Jaipur',
        'Kanpur',
        'Nagpur',
        'Lucknow',
        'Thane',
        'Bhopal',
        'Indore',
        'Patna',
        'Vadodara',
        'Ghaziabad',
        'Ludhiana',
      ],
      Iranian: [
        'Tehran',
        'Mashhad',
        'Isfahan',
        'Karaj',
        'Shiraz',
        'Tabriz',
        'Qom',
        'Ahvaz',
        'Kermanshah',
        'Urmia',
        'Rasht',
        'Zahedan',
        'Hamadan',
        'Yazd',
        'Arak',
        'Ardabil',
      ],
      Iraqi: [
        'Baghdad',
        'Basra',
        'Mosul',
        'Erbil',
        'Karbala',
        'Najaf',
        'Kirkuk',
        'Ramadi',
        'Hilla',
        'Nasiriyah',
        'Amarah',
        'Diwaniyah',
        'Fallujah',
        'Kut',
        'Samawah',
        'Tikrit',
        'Samara',
        'Duhok',
        'Sulaimaniyah',
      ],
      Jordanian: [
        'Amman',
        'Zarqa',
        'Irbid',
        'Aqaba',
        'Mafraq',
        'Russeifa',
        'Madaba',
        'As-Salt',
        'Jerash',
        "Ma'an",
        'Ajloun',
        'Tafilah',
        'Karak',
      ],
      Kuwaiti: [
        'Kuwait City',
        'Hawalli',
        'Salmiya',
        'Fahaheel',
        'Al Jahra',
        'Mubarak Al-Kabeer',
        'Farwaniya',
        'Mahboula',
        'Al Ahmadi',
        'Sabah Al-Salem',
      ],
      Lebanese: [
        'Beirut',
        'Tripoli',
        'Sidon',
        'Tyre',
        'Jounieh',
        'Zahle',
        'Byblos',
        'Aley',
        'Baalbek',
        'Batroun',
        'Bchamoun',
        'Akkar',
        'Bint Jbeil',
        'Jezzine',
        'Chouf',
        'Zgharta',
        'Hasbaya',
        'Rashaya',
      ],
      Libyan: [
        'Tripoli',
        'Benghazi',
        'Misrata',
        'Bayda',
        'Zawiya',
        'Zliten',
        'Khoms',
        'Sabratha',
        'Tobruk',
        'Ajdabiya',
        'Sirte',
        'Ghadames',
        'Sabha',
        'Al-Jufra',
        'Bani Walid',
        'Ghat',
        'Nalut',
      ],
      Mauritanian: [
        'Nouakchott',
        'Nouadhibou',
        'Kaedi',
        'Rosso',
        'Zouerat',
        'Atar',
        'Tidjikja',
        'Aleg',
        'Akjoujt',
        'Kiffa',
        'Nema',
        'Boutilimit',
        'Moudjeria',
      ],
      Moroccan: [
        'Casablanca',
        'Rabat',
        'Fes',
        'Marrakesh',
        'Tangier',
        'Agadir',
        'Meknes',
        'Oujda',
        'Kenitra',
        'Tetouan',
        'Safi',
        'El Jadida',
        'Beni Mellal',
        'Nador',
        'Khemisset',
        'Khouribga',
        'Guelmim',
        'Taza',
        'Ouarzazate',
      ],
      Omani: [
        'Muscat',
        'Salalah',
        'Sohar',
        'Nizwa',
        'Sur',
        'Buraimi',
        'Khasab',
        'Rustaq',
        'Ibra',
        'Muttrah',
        'Seeb',
        'Samail',
        'Al Suwaiq',
      ],
      Pakistani: [
        'Karachi',
        'Lahore',
        'Faisalabad',
        'Rawalpindi',
        'Multan',
        'Peshawar',
        'Islamabad',
        'Quetta',
        'Gujranwala',
        'Sialkot',
        'Sargodha',
        'Bahawalpur',
        'Sukkur',
        'Larkana',
        'Sheikhupura',
        'Jhang',
        'Hyderabad',
        'Sahiwal',
        'Mardan',
      ],
      Palestinian: [
        'Ramallah',
        'Gaza',
        'Hebron',
        'Nablus',
        'Bethlehem',
        'Jenin',
        'Jericho',
        'Khan Yunis',
        'Rafah',
        'Deir al-Balah',
        'Tulkarm',
        'Qalqilya',
        'Salfit',
      ],
      // Add other nationalities with corresponding cities here...
      Qatari: [
        'Doha',
        'Al Rayyan',
        'Al Wakrah',
        'Al Khor',
        'Umm Salal',
        'Dukhan',
        'Mesaieed',
        'Madinat ash Shamal',
        'Al Shahaniya',
        'Lusail',
        'Al Daayen',
      ],
      Saudi: [
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
      Somalian: [
        'Mogadishu',
        'Hargeisa',
        'Bosaso',
        'Kismayo',
        'Galkayo',
        'Baidoa',
        'Berbera',
        'Garowe',
        'Afgooye',
        'Beledweyne',
        'Jowhar',
        'Merca',
        'Borama',
        'Qardho',
        'Garoowe',
        'Las Anod',
      ],
      'Sri-Lankan': [
        'Colombo',
        'Kandy',
        'Galle',
        'Jaffna',
        'Negombo',
        'Anuradhapura',
        'Ratnapura',
        'Matara',
        'Trincomalee',
        'Batticaloa',
        'Kalmunai',
        'Vavuniya',
        'Kurunegala',
        'Badulla',
        'Puttalam',
      ],
      Sudanese: [
        'Khartoum',
        'Omdurman',
        'Port Sudan',
        'Kassala',
        'Al Ubayyid',
        'Nyala',
        'El Fasher',
        'Geneina',
        'Sennar',
        'Atbara',
        'Wad Madani',
        'Kosti',
        'Dongola',
        'Ed Damer',
        'Al Qadarif',
      ],
      Syrian: [
        'Damascus',
        'Aleppo',
        'Homs',
        'Latakia',
        'Hama',
        'Raqqa',
        'Deir ez-Zor',
        'Idlib',
        'Tartus',
        'Daraa',
        'Al-Hasakah',
        'Qamishli',
        'Douma',
        'Manbij',
        'Al Bab',
        'Salamiyah',
      ],
      Tunisian: [
        'Tunis',
        'Sfax',
        'Sousse',
        'Kairouan',
        'Gabes',
        'Bizerte',
        'Ariana',
        'Gafsa',
        'El Kef',
        'Tozeur',
        'Monastir',
        'Medenine',
        'Nabeul',
        'Zarzis',
        'Beja',
        'Ben Arous',
        'Tataouine',
      ],
      Yemeni: [
        "Sana'a",
        'Aden',
        'Taiz',
        'Hodeidah',
        'Ibb',
        'Mukalla',
        'Dhamar',
        'Al Mukalla',
        "Say'un",
        'Zabid',
        'Amran',
        'Al Bayda',
        'Shibam',
        'Lahij',
        'Al Hudaydah',
      ],
      Other: ['Other'], // Placeholder for other nationalities
      'Prefer not to say': ['Prefer not to say'],
    };

    setResidenceOptions(cityOptions[fields.nationality] || []);
  }, [fields.nationality]);

  const completedFields = Object.values(fields).filter(Boolean).length;
  const totalFields = Object.keys(fields).length;
  const completionPercentage = (completedFields / totalFields) * 100;

  const handleFormSubmit = async (data) => {
    setLoading(true);
    await onSubmit(data);
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
        }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: 'inherit',
          }}>
          <Typography variant='h4' component='h1' gutterBottom>
            Before you continue...
          </Typography>
          <Typography variant='h6' component='h4' gutterBottom>
            We need a few more details to complete your profile
          </Typography>
        </div>
        <div className={styles.progressContainer}>
          <CircularProgress
            variant='determinate'
            value={completionPercentage}
          />
          <Typography variant='body1' className={styles.progressText}>
            {Math.round(completionPercentage)}% Complete
          </Typography>
        </div>
      </div>
      <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
        <TextField
          select
          label='Nationality'
          {...register('nationality', { required: true })}
          variant='outlined'
          fullWidth
          className={styles.formField}
          value={fields.nationality}>
          <MenuItem value='African'>African</MenuItem>
          <MenuItem value='Algerian'>Algerian</MenuItem>
          <MenuItem value='American'>American</MenuItem>
          <MenuItem value='Bangladeshi'>Bangladeshi</MenuItem>
          <MenuItem value='Comoran'>Comoran</MenuItem>
          <MenuItem value='Djiboutian'>Djiboutian</MenuItem>
          <MenuItem value='Djiboutian'>Djiboutian</MenuItem>
          <MenuItem value='Djiboutian'>Djiboutian</MenuItem>
          <MenuItem value='European'>European</MenuItem>
          <MenuItem value='Filipino'>Filipino</MenuItem>
          <MenuItem value='Indian'>Indian</MenuItem>
          <MenuItem value='Iranian'>Iranian</MenuItem>
          <MenuItem value='Iraqi'>Iraqi</MenuItem>
          <MenuItem value='Jordanian'>Jordanian</MenuItem>
          <MenuItem value='Kuwaiti'>Kuwaiti</MenuItem>
          <MenuItem value='Lebanese'>Lebanese</MenuItem>
          <MenuItem value='Mauritanian'>Mauritanian</MenuItem>
          <MenuItem value='Moroccan'>Moroccan</MenuItem>
          <MenuItem value='Omani'>Omani</MenuItem>
          <MenuItem value='Pakistani'>Pakistani</MenuItem>
          <MenuItem value='Palestinian'>Palestinian</MenuItem>
          <MenuItem value='Qatari'>Qatari</MenuItem>
          <MenuItem value='Saudi'>Saudi</MenuItem>
          <MenuItem value='Somalian'>Somalian</MenuItem>
          <MenuItem value='Sudanese'>Sudanese</MenuItem>
          <MenuItem value='Syrian'>Syrian</MenuItem>
          <MenuItem value='Tunisian'>Tunisian</MenuItem>
          <MenuItem value='Yemeni'>Yemeni</MenuItem>
          <MenuItem value='Other'>Other</MenuItem>
          <MenuItem value='Prefer not to say'>Prefer not to say</MenuItem>
        </TextField>

        <TextField
          select
          label='Residence'
          {...register('residence', { required: true })}
          variant='outlined'
          fullWidth
          className={styles.formField}
          value={fields.residence}
          disabled={!fields.nationality || !residenceOptions.length} // Disable if no cities are available
        >
          {residenceOptions.map((city, index) => (
            <MenuItem key={index} value={city}>
              {city}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label='Household Income'
          {...register('household_income', { required: true })}
          variant='outlined'
          fullWidth
          className={styles.formField}
          value={fields.household_income}>
          <MenuItem value='Less than 1500 SAR per month'>
            Less than 1500 SAR per month
          </MenuItem>
          <MenuItem value='5000 - 10000 SAR per month'>
            5000 - 10000 SAR per month
          </MenuItem>
          <MenuItem value='10000 - 20000 SAR per month'>
            10000 - 20000 SAR per month
          </MenuItem>
          <MenuItem value='More than 20000 SAR per month'>
            More than 20000 SAR per month
          </MenuItem>
          <MenuItem value='Prefer not to say'>Prefer not to say</MenuItem>
        </TextField>

        <TextField
          select
          label='Education Level'
          {...register('education_level', { required: true })}
          variant='outlined'
          fullWidth
          className={styles.formField}
          value={fields.education_level}>
          <MenuItem value='Not completed'>Not completed</MenuItem>
          <MenuItem value='High school or equivalent'>High School</MenuItem>
          <MenuItem value='Bachelor’s Degree'>Bachelor’s Degree</MenuItem>
          <MenuItem value='Master’s Degree'>Master’s Degree</MenuItem>
          <MenuItem value='Doctorate or higher'>PhD</MenuItem>
          {/* Add other education options here */}
          <MenuItem value='Prefer not to say'>Prefer not to say</MenuItem>
        </TextField>

        <TextField
          select
          label='Occupation'
          {...register('occupation', { required: true })}
          variant='outlined'
          fullWidth
          className={styles.formField}
          value={fields.occupation}>
          <MenuItem value='Student'>Student</MenuItem>
          <MenuItem value='Employee -non professional worker'>
            Employee -non professional worker
          </MenuItem>
          <MenuItem value='Professional worker'>Professional worker</MenuItem>
          <MenuItem value='Business owner'>Business owner</MenuItem>
          <MenuItem value='Retired'>Retired</MenuItem>
          <MenuItem value='I do not work/ House Wife'>
            I do not work/ House Wife
          </MenuItem>
        </TextField>

        <TextField
          select
          label='Industry'
          {...register('industry', { required: true })}
          variant='outlined'
          fullWidth
          className={styles.formField}
          value={fields.industry}>
          <MenuItem value='Advertising/Media/Publishing/Public Relations'>
            Advertising/Media/Publishing/Public Relations
          </MenuItem>
          <MenuItem value='Banking/Finance'>Banking/Finance</MenuItem>
          <MenuItem value='Education'>Education</MenuItem>
          <MenuItem value='Healthcare'>Healthcare</MenuItem>
          <MenuItem value='Information Technology'>
            Information Technology
          </MenuItem>
          <MenuItem value='Manufacturing'>Manufacturing</MenuItem>
          <MenuItem value='Retail'>Retail</MenuItem>
          <MenuItem value='I do not work/ House Wife'>
            I do not work/ House Wife
          </MenuItem>
          <MenuItem value='Prefer not to say'>Prefer not to say</MenuItem>
        </TextField>

        <TextField
          select
          label='Owned Cars'
          {...register('owned_cars', { required: true })}
          variant='outlined'
          fullWidth
          className={styles.formField}
          value={fields.owned_cars}>
          <MenuItem value='We do not own any cars'>
            We do not own any cars
          </MenuItem>
          <MenuItem value='1 car only'>1 car only</MenuItem>
          <MenuItem value='2 cars'>2 cars</MenuItem>
          <MenuItem value='3 or more cars'>3 or more cars</MenuItem>
        </TextField>

        <TextField
          select
          label='Accommodation'
          {...register('accommodation', { required: true })}
          variant='outlined'
          fullWidth
          className={styles.formField}
          value={fields.accommodation}>
          <MenuItem value='Rented Apartment'>Rented Apartment</MenuItem>
          <MenuItem value='Owned Apartment'>Owned Apartment</MenuItem>
          <MenuItem value='Rented house'>Rented house</MenuItem>
          <MenuItem value='Owned house'>Owned house</MenuItem>
          <MenuItem value='Living with Family'>Living with Family</MenuItem>
        </TextField>

        <TextField
          select
          label='Travel Habits'
          {...register('travel_habits', { required: true })}
          variant='outlined'
          fullWidth
          className={styles.formField}
          value={fields.travel_habits}>
          <MenuItem value='I do not travel at all'>
            I do not travel at all
          </MenuItem>
          <MenuItem value='I travel for business at least once a year'>
            I travel for business at least once a year
          </MenuItem>
          <MenuItem value='I travel for leisure at least once a year'>
            I travel for leisure at least once a year
          </MenuItem>
          <MenuItem value='I travel for both Travel and leisure at least once a year'>
            I travel for both Travel and leisure at least once a year
          </MenuItem>
          <MenuItem value='I prefer not to share'>
            I prefer not to share
          </MenuItem>
        </TextField>

        <TextField
          select
          label='Family Members'
          {...register('family_members', { required: true })}
          variant='outlined'
          fullWidth
          className={styles.formField}
          value={fields.family_members}>
          <MenuItem value='1'>1</MenuItem>
          <MenuItem value='2'>2</MenuItem>
          <MenuItem value='3'>3</MenuItem>
          <MenuItem value='4'>4</MenuItem>
          <MenuItem value='5 or more'>5 or more</MenuItem>
        </TextField>

        <Button
          type='submit'
          variant='contained'
          color='primary'
          disabled={loading}
          className={styles.submitButton}>
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </div>
  );
};

export default ProfileCompletionForm;
