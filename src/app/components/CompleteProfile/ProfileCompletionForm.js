"use client"; // Ensures this is a client-side component

import React, { useState, useEffect } from "react";
import { set, useForm } from "react-hook-form";
import {
  CircularProgress,
  TextField,
  Button,
  MenuItem,
  Typography,
} from "@mui/material";
import styles from "./ProfileCompletionForm.module.css";
import { useLocale, useTranslations } from "next-intl"; // Import for translations
import { callApi } from "../../helper";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Router } from "next/router";

const ProfileCompletionForm = ({ profile, onSubmit }) => {
  const t = useTranslations("ProfileCompletionForm"); // Initialize translations

  const { data: session } = useSession();
  const userToken = session?.id;
  const lang = useLocale();

  const [questions, setQuestions] = useState([]);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [answersLoaded, setAnswersLoaded] = useState(false);
  const [answersLoading, setAnswersLoading] = useState(false);

  const [allFields, setAllFields] = useState({});
  const [allLoaded, setAllLoaded] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  // loading questions
  async function fetchQuestions() {
    setQuestionsLoading(true);
    if (!questionsLoading && !questionsLoaded) {
      const response = await callApi({
        type: "get",
        url: "userProfileQuestions",
        userToken: userToken,
        lang: lang,
      });

      setQuestionsLoading(false);
      setQuestionsLoaded(true);
      setQuestions(response?.externalResponse?.data ?? []);
    }
  }

  // loading answers
  async function fetchAnswers() {
    setAnswersLoading(true);
    if (!answersLoading && !answersLoaded) {
      const response = await callApi({
        type: "get",
        url: "userProfileAnswers",
        userToken: userToken,
      });

      setAnswersLoading(false);
      setAnswers(response?.externalResponse ?? []);
      setAnswersLoaded(true);
    }
  }

  useEffect(() => {
    if (userToken) {
      fetchQuestions();
      fetchAnswers();
    }
  }, [userToken, session]);

  useEffect(() => {
    if (questionsLoaded && answersLoaded) {
      const fields = questions.reduce((acc, item, index) => {
        const answer = answers.find((answer) => answer.questionId === item.id);
        acc[item.id] = answer?.id;
        return acc;
      }, {});
      console.log(fields);
      setAllLoaded(true);
      setAllFields(fields);
    }
  }, [questions, answers]);

  const completedFields = Object.values(allFields).filter(Boolean).length;
  const totalFields = Object.keys(allFields).length;
  const completionPercentage = (completedFields / totalFields) * 100;

  const handleElChange = async (key, value) => {
    setAllFields({
      ...allFields,
      [key]: value,
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    const payload = Object.entries(allFields)
      .filter(([questionId, id]) => id !== undefined && id !== null) // Check if id exists
      .map(([questionId, id]) => ({
        questionId: parseInt(questionId), // Convert questionId to a number
        id: id, // Use the value as is
      }));

    await callApi({
      type: "post",
      url: "userProfileAnswers",
      userToken: userToken,
      data: {
        complete: completedFields == totalFields,
        answers: payload,
      },
    });

    toast("Profile Updated successfully!");
    window.location.href = "/surveys";
    setSubmitting(false);
  };

  return (
    <div className={styles.container}>
      {!allLoaded ? (
        <CircularProgress className={styles.spinner} /> // Show spinner while data is loading
      ) : (
        <>
          <div className={styles.twoRowMobile}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "inherit",
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                style={{ color: "#fff" }}
                gutterBottom
              >
                {t("beforeContinue")}
              </Typography>
              <Typography
                variant="h6"
                component="h4"
                style={{ color: "#fff" }}
                gutterBottom
              >
                {t("moreDetails")}
              </Typography>
            </div>

            <div className={styles.progressContainer}>
              <CircularProgress
                variant="determinate"
                value={completionPercentage}
              />
              <Typography variant="body1" className={styles.progressText}>
                {Math.round(completionPercentage)}% {t("complete")}
              </Typography>
            </div>
          </div>

          {allLoaded && (
            <div className={styles.form}>
              {questions.map((question, index) => {
                const selectedAnswer = question.answers.find(
                  (answer) => answer.id === allFields[question.id]
                );
                return (
                  <TextField
                    key={question.id}
                    select
                    label={question.text}
                    variant="outlined"
                    fullWidth
                    className={styles.formField}
                    value={allFields[question.id] || ""}
                    onChange={(e) =>
                      handleElChange(question.id, e.target.value)
                    }
                  >
                    {question.answers.map((answer) => (
                      <MenuItem key={answer.id} value={answer.id}>
                        {answer.label}
                      </MenuItem>
                    ))}
                  </TextField>
                );
              })}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting}
                onClick={handleSubmit}
                className={styles.submitButton}
              >
                {submitting ? t("submitting") : t("submit")}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileCompletionForm;
