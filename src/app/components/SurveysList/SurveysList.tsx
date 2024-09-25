import { useState, useEffect } from 'react'; // Import useState and useEffect for loading

const SurveysList = () => {
    const t = useTranslations('Surveys'); // Initialize translations
    const lang = useLocale(); // Get the current locale
    const isArabic = lang === 'ar';

    const [loading, setLoading] = useState(true); // New loading state

    // English surveys array
    const englishSurveys = [
        {
            id: 1,
            title: 'Customer Satisfaction Survey',
            description: 'Help us improve our services by answering a few questions.',
            time: 5,
            price: 1,
        },
        {
            id: 2,
            title: 'Product Feedback Survey',
            description: 'Share your thoughts on our latest product line.',
            time: 20,
            price: 3,
        },
        {
            id: 3,
            title: 'Website Usability Survey',
            description: 'Give us feedback on your experience using our website.',
            time: 10,
            price: 2,
        },
    ];

    // Arabic surveys array
    const arabicSurveys = [
        {
            id: 1,
            title: 'استطلاع رضا العملاء',
            description: 'ساعدنا على تحسين خدماتنا من خلال الإجابة على بعض الأسئلة.',
            time: 5,
            price: 1,
        },
        {
            id: 2,
            title: 'استطلاع آراء حول المنتجات',
            description: 'شاركنا رأيك في أحدث منتجاتنا.',
            time: 20,
            price: 3,
        },
        {
            id: 3,
            title: 'استطلاع سهولة استخدام الموقع',
            description: 'أخبرنا بتجربتك في استخدام موقعنا.',
            time: 10,
            price: 2,
        },
    ];

    // Determine which survey array to use based on language
    const surveys = lang === 'ar' ? arabicSurveys : englishSurveys;

    // Simulate data loading
    useEffect(() => {
        // Simulate an API call or data load
        const loadSurveys = async () => {
            setLoading(true); // Start loading
            // Simulate delay for loading data
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setLoading(false); // End loading
        };

        loadSurveys();
    }, []);

    return (
        <div className={styles.surveysContainer}>
            {loading ? (
                <div className={styles.spinner}></div> // Show spinner while loading
            ) : (
                <>
                    <h2 className={styles.title}>{t('earnBySurveys')}</h2>
                    <p className={styles.surveyDescription}>{t('surveyDescription')}</p>
                    <br /><br />
                    <div className={styles.surveysGrid}>
                        {surveys.map((survey) => (
                            <div key={survey.id} className={styles.surveyCard}>
                                <h3 className={styles.surveyTitle}>{survey.title}</h3>
                                <p className={styles.surveyDescription}>{survey.description}</p>
                                <div className={styles.surveyInfo}>
                                    <img
                                        src="https://i.etsystatic.com/36262552/r/il/aa81a7/4191400611/il_570xN.4191400611_23uk.jpg"
                                        alt={t('timeIconAlt')}
                                        className={styles.timeIcon}
                                    />
                                    <span style={{
                                        marginRight: lang === 'ar' ? '0px' : '20px',
                                        marginLeft: lang === 'en' ? '0px' : '20px',
                                        fontWeight: 'bold',
                                    }}>
                                        {survey.time} {t('mins')}
                                    </span>

                                    <img
                                        src="https://i.pinimg.com/564x/a4/91/7a/a4917a4fcb3b1a6b3416e27491d9422b.jpg"
                                        alt={t('priceIconAlt')}
                                        className={styles.timeIcon2}
                                    />
                                    <span
                                        style={{
                                            fontWeight: 'bold',
                                            marginLeft: '10px',
                                        }}>
                                        {survey.price} {t('currency')}
                                    </span>
                                </div>
                                <button className={styles.takeSurveyButton}>
                                    {t('takeSurvey')}
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default SurveysList;
