"use client";

import react, { useState, useEffect } from "react"; // Import useState and useEffect for loading
import { useLocale, useTranslations } from "next-intl";
import { callApi } from "../../helper";
import { useSession } from "next-auth/react";
import styles from "./SurveysList.module.css";
import { useSearchParams } from "next/navigation";

const SurveysList = () => {
  const { data: session } = useSession();
  const t = useTranslations("Surveys"); // Initialize translations
  const lang = useLocale(); // Get the current locale
  //   const isArabic = lang === "ar";
  const userToken = session?.id;
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state

  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  // Simulate data loading
  useEffect(() => {
    if (userToken) fetchData();
  }, [userToken, session]);

  async function fetchData() {
    setLoading(true); // Start loading
    const response = await callApi({
      type: "get",
      url: "survey",
      userToken: userToken,
    });

    if (response.status == 200) {
      setSurveys(response.data);
    }
    setLoading(false); // Stop loading once data is fetched
  }

  return (
    <div className={styles.surveysContainer}>
      {status == "success" && (
        <p role="alert" className={styles.success}>
          You have finished the survey successfully
        </p>
      )}

      {["out", "terminate", "full"].includes(status) && (
        <p role="alert" className={styles.error}>
          You haven't finished the survey successfully!
        </p>
      )}

      {loading ? (
        <div className={styles.spinner}></div> // Show spinner while loading
      ) : (
        <>
          <h2 className={styles.title}>{t("earnBySurveys")}</h2>
          <p className={styles.surveyDescription}>{t("surveyDescription")}</p>
          <br />
          <br />
          <div className={styles.surveysGrid}>
            {surveys.map((survey) => (
              <div key={survey.id} className={styles.surveyCard}>
                <h3 className={styles.surveyTitle}>{survey.title}</h3>
                <p className={styles.surveyDescription}>{survey.description}</p>
                <div className={styles.surveyInfo}>
                  <img
                    src="https://i.etsystatic.com/36262552/r/il/aa81a7/4191400611/il_570xN.4191400611_23uk.jpg"
                    alt={t("timeIconAlt")}
                    className={styles.timeIcon}
                  />
                  <span
                    style={{
                      marginRight: lang === "ar" ? "0px" : "20px",
                      marginLeft: lang === "en" ? "0px" : "20px",
                      fontWeight: "bold",
                    }}
                  >
                    {survey.duration} {t("mins")}
                  </span>

                  <img
                    src="https://i.pinimg.com/564x/a4/91/7a/a4917a4fcb3b1a6b3416e27491d9422b.jpg"
                    alt={t("priceIconAlt")}
                    className={styles.timeIcon2}
                  />
                  <span
                    style={{
                      fontWeight: "bold",
                      marginLeft: "10px",
                    }}
                  >
                    {survey.amount} {survey.currencyIsoCode}
                  </span>
                </div>
                <button
                  className={styles.takeSurveyButton}
                  onClick={() => {
                    window.open(survey.link, "_blank");
                  }}
                >
                  {t("takeSurvey")}
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
