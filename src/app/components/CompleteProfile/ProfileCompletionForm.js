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
      residence: '',
      travel_habits: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [residenceOptions, setResidenceOptions] = useState([]);
  const [currency, setCurrency] = useState({ en: 'USD', ar: ' دولار أمريكي' }); // Default currency
  const t = useTranslations('ProfileCompletionForm'); // Initialize translations
  const lang = useLocale(); // Get the current locale
  const isArabic = lang === 'ar';

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
    const cityOptions = {
      African: isArabic
        ? [
            'لاغوس',
            'القاهرة',
            'كينشاسا',
            'جوهانسبرج',
            'نيروبي',
            'أديس أبابا',
            'الدار البيضاء',
            'أكرا',
            'الجزائر',
            'كيب تاون',
            'أبيدجان',
            'الخرطوم',
            'داكار',
            'دوالا',
            'لواندا',
            'كمبالا',
            'تونس',
            'دار السلام',
            'مابوتو',
            'لوساكا',
          ]
        : [
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
          ],
      Algerian: isArabic
        ? [
            'الجزائر',
            'وهران',
            'قسنطينة',
            'عنابة',
            'البليدة',
            'باتنة',
            'الجلفة',
            'سطيف',
            'تلمسان',
            'بسكرة',
            'بجاية',
            'سكيكدة',
            'تيزي وزو',
            'ورقلة',
            'قالمة',
          ]
        : [
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
      American: isArabic
        ? [
            'نيويورك',
            'لوس أنجلوس',
            'شيكاغو',
            'هيوستن',
            'فينيكس',
            'فيلادلفيا',
            'سان أنطونيو',
            'سان دييغو',
            'دالاس',
            'سان خوسيه',
            'أوستن',
            'جاكسونفيل',
            'فورت وورث',
            'كولومبوس',
            'شارلوت',
            'سان فرانسيسكو',
            'إنديانابوليس',
            'سياتل',
            'دنفر',
            'واشنطن العاصمة',
          ]
        : [
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
      Bahraini: isArabic
        ? [
            'المنامة',
            'المحرق',
            'الرفاع',
            'مدينة حمد',
            'مدينة عيسى',
            'سترة',
            'البديع',
            'جدحفص',
            'المالكية',
            'عراد',
            'السنابس',
            'توبلي',
            'جرداب',
            'الحد',
            'الزلاق',
          ]
        : [
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
      Bangladeshi: isArabic
        ? [
            'دكا',
            'تشيتاغونغ',
            'خولنا',
            'راجشاهي',
            'سيلهيت',
            'مايمينسينغ',
            'باريزال',
            'كوميلا',
            'رنكبور',
            'غازيبور',
            'نارايانغانج',
            'نارسينغدي',
            'سافار',
            'كوكس بازار',
            'جيسور',
          ]
        : [
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
      Comoran: isArabic
        ? [
            'موروني',
            'موتسامودو',
            'فومبوني',
            'دوموني',
            'تسيمبيو',
            'بندامادجي',
            'كانغاني',
            'مبيني',
            'مويا',
            'أونغوني',
            'مبوني',
            'مفوني',
          ]
        : [
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
      Djiboutian: isArabic
        ? [
            'جيبوتي',
            'علي صبيح',
            'تاجورة',
            'أوبوك',
            'دخيل',
            'أرتا',
            'قوبيتو',
            'هول هول',
            'غلافة',
            'عسيلة',
            'يوبوكي',
            'قوبيتو',
          ]
        : [
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
      Egyptian: isArabic
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
      Emirati: isArabic
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
      European: isArabic
        ? [
            'لندن',
            'باريس',
            'برلين',
            'مدريد',
            'روما',
            'فيينا',
            'أثينا',
            'لشبونة',
            'أمستردام',
            'بروكسل',
            'كوبنهاغن',
            'ستوكهولم',
            'أوسلو',
            'هلسنكي',
            'وارسو',
            'بودابست',
            'براغ',
            'زيورخ',
            'برشلونة',
            'ميلان',
          ]
        : [
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
          ],
      Filipino: isArabic
        ? [
            'مانيلا',
            'كويزون سيتي',
            'دافاو سيتي',
            'سيبو سيتي',
            'زامبوانغا سيتي',
            'تاجويج',
            'كاغايان دي أورو',
            'جنرال سانتوس',
            'إيلويلو سيتي',
            'كلامبا',
            'باجولود',
            'ماكاتي',
            'باسيج',
            'أنتيبولو',
            'مونتينلوبا',
          ]
        : [
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
      Indian: isArabic
        ? [
            'مومباي',
            'دلهي',
            'بنغالور',
            'حيدر أباد',
            'تشيناي',
            'كولكاتا',
            'أحمد أباد',
            'بوني',
            'سورات',
            'جايبور',
            'كانبور',
            'ناجبور',
            'لكناو',
            'ثين',
            'بوبال',
            'إندور',
            'باتنا',
            'فادودارا',
            'غازي أباد',
            'لوديانا',
          ]
        : [
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
      Iranian: isArabic
        ? [
            'طهران',
            'مشهد',
            'أصفهان',
            'كرج',
            'شيراز',
            'تبريز',
            'قم',
            'أهواز',
            'كرمنشاه',
            'أورميا',
            'رشت',
            'زاهدان',
            'همدان',
            'يزد',
            'أراك',
            'أردبيل',
          ]
        : [
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
      Iraqi: isArabic
        ? [
            'بغداد',
            'البصرة',
            'الموصل',
            'أربيل',
            'كربلاء',
            'النجف',
            'كركوك',
            'الرمادي',
            'الحلة',
            'الناصرية',
            'العمارة',
            'الديوانية',
            'الفلوجة',
            'الكوت',
            'السماوة',
            'تكريت',
            'سامراء',
            'دهوك',
            'السليمانية',
          ]
        : [
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
      Jordanian: isArabic
        ? [
            'عمان',
            'الزرقاء',
            'إربد',
            'العقبة',
            'المفرق',
            'الرصيفة',
            'مادبا',
            'السلط',
            'جرش',
            'معان',
            'عجلون',
            'الطفيلة',
            'الكرك',
          ]
        : [
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
      Kuwaiti: isArabic
        ? [
            'مدينة الكويت',
            'حولي',
            'السالمية',
            'الفحيحيل',
            'الجهراء',
            'مبارك الكبير',
            'الفروانية',
            'المهبولة',
            'الأحمدي',
            'صباح السالم',
          ]
        : [
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
      Lebanese: isArabic
        ? [
            'بيروت',
            'طرابلس',
            'صيدا',
            'صور',
            'جونيه',
            'زحلة',
            'جبيل',
            'عاليه',
            'بعلبك',
            'البترون',
            'بشامون',
            'عكار',
            'بنت جبيل',
            'جزين',
            'الشوف',
            'زغرتا',
            'حاصبيا',
            'راشيا',
          ]
        : [
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
      Libyan: isArabic
        ? [
            'طرابلس',
            'بنغازي',
            'مصراتة',
            'البيضاء',
            'الزاوية',
            'زليتن',
            'الخمس',
            'صبراتة',
            'طبرق',
            'اجدابيا',
            'سرت',
            'غدامس',
            'سبها',
            'الجفرة',
            'بني وليد',
            'غات',
            'نالوت',
          ]
        : [
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
      Mauritanian: isArabic
        ? [
            'نواكشوط',
            'نواذيبو',
            'كيهيدي',
            'روصو',
            'ازويرات',
            'أطار',
            'تجكجة',
            'ألاك',
            'أكجوجت',
            'كيفة',
            'النعمة',
            'بوتلميت',
            'مدجورية',
          ]
        : [
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
      Moroccan: isArabic
        ? [
            'الدار البيضاء',
            'الرباط',
            'فاس',
            'مراكش',
            'طنجة',
            'أكادير',
            'مكناس',
            'وجدة',
            'القنيطرة',
            'تطوان',
            'آسفي',
            'الجديدة',
            'بني ملال',
            'الناظور',
            'الخميسات',
            'خريبكة',
            'كلميم',
            'تازة',
            'ورزازات',
          ]
        : [
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
      Omani: isArabic
        ? [
            'مسقط',
            'صلالة',
            'صحار',
            'نزوى',
            'صور',
            'البريمي',
            'خصب',
            'الرستاق',
            'إبراء',
            'مطرح',
            'السيب',
            'سمائل',
            'السويق',
          ]
        : [
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
      Pakistani: isArabic
        ? [
            'كراتشي',
            'لاهور',
            'فيصل آباد',
            'روالبندي',
            'مولتان',
            'بيشاور',
            'إسلام آباد',
            'كويتا',
            'غوجرانوالا',
            'سيالكوت',
            'سرغودها',
            'بهاولبور',
            'سوكور',
            'لاركانا',
            'شيخوپورا',
            'جانغ',
            'حيدر آباد',
            'ساہیوال',
            'ماردان',
          ]
        : [
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
      Palestinian: isArabic
        ? [
            'رام الله',
            'غزة',
            'الخليل',
            'نابلس',
            'بيت لحم',
            'جنين',
            'أريحا',
            'خان يونس',
            'رفح',
            'دير البلح',
            'طولكرم',
            'قلقيلية',
            'سلفيت',
          ]
        : [
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
      Qatari: isArabic
        ? [
            'الدوحة',
            'الريان',
            'الوكرة',
            'الخُر',
            'أم صلال',
            'دوخان',
            'مسيعيد',
            'مدينة الشمال',
            'الشحانية',
            'لوسيل',
            'الضعاين',
          ]
        : [
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
      Saudi: isArabic
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
      Somalian: isArabic
        ? [
            'مقديشو',
            'هرجيسا',
            'بوصاصو',
            'كيسمايو',
            'جالكعيو',
            'بيدوة',
            'بربرة',
            'غاروي',
            'أفجوي',
            'بلدوين',
            'جوهر',
            'مركة',
            'بوراما',
            'قرطو',
            'غارووي',
            'لاسعانود',
          ]
        : [
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
      'Sri-Lankan': isArabic
        ? [
            'كولومبو',
            'كاندي',
            'جالي',
            'جافنا',
            'نيغومبو',
            'أنورادابورا',
            'راتنابورا',
            'ماتارا',
            'ترينكومالي',
            'باتيكالوا',
            'كالموناي',
            'فوفونيا',
            'كورونيغالا',
            'بادولا',
            'بوتالام',
          ]
        : [
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
      Sudanese: isArabic
        ? [
            'الخرطوم',
            'أم درمان',
            'بورتسودان',
            'كسلا',
            'الأبيض',
            'نيالا',
            'الفاشر',
            'الجنينة',
            'سنار',
            'عطبرة',
            'ود مدني',
            'كوستي',
            'دنقلا',
            'الدامر',
            'القضارف',
          ]
        : [
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
      Syrian: isArabic
        ? [
            'دمشق',
            'حلب',
            'حمص',
            'اللاذقية',
            'حماة',
            'الرقة',
            'دير الزور',
            'إدلب',
            'طرطوس',
            'درعا',
            'الحسكة',
            'القامشلي',
            'دوما',
            'منبج',
            'الباب',
            'سلمية',
          ]
        : [
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
      Tunisian: isArabic
        ? [
            'تونس',
            'صفاقس',
            'سوسة',
            'القيروان',
            'قابس',
            'بنزرت',
            'أريانة',
            'قفصة',
            'الكاف',
            'توزر',
            'المنستير',
            'مدنين',
            'نابل',
            'جرجيس',
            'باجة',
            'بن عروس',
            'تطاوين',
          ]
        : [
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
      Yemeni: isArabic
        ? [
            'صنعاء',
            'عدن',
            'تعز',
            'الحديدة',
            'إب',
            'المكلا',
            'ذمار',
            'المكلا',
            'سيئون',
            'زبيد',
            'عمران',
            'البيضاء',
            'شبام',
            'لحج',
            'الحديدة',
          ]
        : [
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
        setCurrency({ en: 'ILS', ar: 'شيكل إسرائيلي' });
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
          label={isArabic ? 'المدينة' : 'Residence City'}
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
