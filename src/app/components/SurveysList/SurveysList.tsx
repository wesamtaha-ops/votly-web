'use client';

import styles from './SurveysList.module.css';

const SurveysList = () => {
    const surveys = [
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
        // Add more surveys as needed
    ];

    return (
        <div className={styles.surveysContainer}>
            <h2 className={styles.title}>Earn money by completing surveys</h2>
            <p className={styles.surveyDescription}>Paid surveys are a convenient side hustle for anyone who wants to earn a little extra.
                Earn points for each survey you complete and use them to get cash or gift cards.</p>
            <br /><br />
            <div className={styles.surveysGrid}>
                {surveys.map((survey) => (
                    <div key={survey.id} className={styles.surveyCard}>
                        <h3 className={styles.surveyTitle}>{survey.title}</h3>
                        <p className={styles.surveyDescription}>{survey.description}</p>
                        <div className={styles.surveyInfo}>
                            <img src="https://i.etsystatic.com/36262552/r/il/aa81a7/4191400611/il_570xN.4191400611_23uk.jpg" alt="Time Icon" className={styles.timeIcon} />
                            <span style={{
                                marginRight: '40px',
                                fontWeight: 'bold',
                            }} >{survey.time} mins</span>

                            <img src="https://i.pinimg.com/564x/a4/91/7a/a4917a4fcb3b1a6b3416e27491d9422b.jpg" alt="Time Icon" className={styles.timeIcon} />
                            <span
                                style={{
                                    fontWeight: 'bold',
                                    marginLeft: '10px',
                                }}>${survey.price}</span>
                        </div>
                        <button className={styles.takeSurveyButton}>Take Survey</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SurveysList;
