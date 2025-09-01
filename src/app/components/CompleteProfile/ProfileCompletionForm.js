"use client"; // Ensures this is a client-side component

import React, { useState, useEffect } from "react";
import { set, useForm } from "react-hook-form";
import {
  CircularProgress,
  TextField,
  Button,
  MenuItem,
  Typography,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
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
      const fields = questions.reduce((acc, question) => {
        const questionAnswers = answers.filter((answer) => answer.questionId === question.id);
        
        if (question.synoQuestionTypeId === 3) {
          // Multiple choice - store as array
          acc[question.id] = questionAnswers.map(answer => answer.id);
        } else {
          // Single choice - store as single value
          acc[question.id] = questionAnswers.length > 0 ? questionAnswers[0].id : null;
        }
        
        return acc;
      }, {});
      console.log('Loaded fields:', fields);
      setAllLoaded(true);
      setAllFields(fields);
    }
  }, [questions, answers]);

  // Helper function to get question text based on locale
  const getQuestionText = (question) => {
    const translation = question.translations?.find(t => t.locale === lang) || 
                       question.translations?.find(t => t.locale === 'en') ||
                       question.translations?.[0];
    return translation?.text || question.text || `Question ${question.id}`;
  };

  // Helper function to get answer text based on locale
  const getAnswerText = (answer) => {
    const translation = answer.translations?.find(t => t.locale === lang) || 
                       answer.translations?.find(t => t.locale === 'en') ||
                       answer.translations?.[0];
    return translation?.text || answer.text || answer.label || `Answer ${answer.id}`;
  };

  // Helper function to determine question type rendering
  const getQuestionType = (question) => {
    // synoQuestionTypeId: 2 = single choice, 3 = multiple choice
    return question.synoQuestionTypeId;
  };

  const completedFields = Object.values(allFields).filter(value => {
    if (Array.isArray(value)) {
      return value.length > 0; // For multiple choice, check if array has items
    }
    return Boolean(value); // For single choice, check if value exists
  }).length;
  const totalFields = Object.keys(allFields).length;
  const completionPercentage = totalFields > 0 ? (completedFields / totalFields) * 100 : 0;

  const handleElChange = async (key, value, questionType) => {
    if (questionType === 3) { // Multiple choice
      const currentValues = allFields[key] || [];
      const newValues = Array.isArray(currentValues) ? [...currentValues] : [];
      
      if (newValues.includes(value)) {
        // Remove if already selected
        const index = newValues.indexOf(value);
        newValues.splice(index, 1);
      } else {
        // Add if not selected
        newValues.push(value);
      }
      
      setAllFields({
        ...allFields,
        [key]: newValues,
      });
    } else { // Single choice
      setAllFields({
        ...allFields,
        [key]: value,
      });
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    const payload = Object.entries(allFields)
      .filter(([questionId, value]) => {
        if (Array.isArray(value)) {
          return value.length > 0; // For multiple choice, check if array has items
        }
        return value !== undefined && value !== null && value !== ""; // For single choice
      })
      .flatMap(([questionId, value]) => {
        if (Array.isArray(value)) {
          // For multiple choice questions, create multiple entries
          return value.map(id => ({
            questionId: parseInt(questionId),
            id: id,
          }));
        } else {
          // For single choice questions
          return [{
            questionId: parseInt(questionId),
            id: value,
          }];
        }
      });

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
        <div className={styles.spinner}>
          <CircularProgress />
        </div>
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
                {Math.round(completionPercentage)}%
                <br />
                {t("complete")}
              </Typography>
            </div>
          </div>

          {allLoaded && (
            <div className={styles.form}>
              {questions.map((question, index) => {
                const questionType = getQuestionType(question);
                const questionText = getQuestionText(question);
                const currentValue = allFields[question.id];
                
                // Filter out exclusive answers for multiple choice
                const regularAnswers = question.answers?.filter(answer => !answer.isExclusive) || [];
                const exclusiveAnswers = question.answers?.filter(answer => answer.isExclusive) || [];

                if (questionType === 3) {
                  // Multiple Choice Question
                  return (
                    <FormControl key={question.id} component="fieldset" className={styles.formField}>
                      <FormLabel component="legend" className={styles.questionLabel}>
                        {questionText}
                      </FormLabel>
                      <FormGroup>
                        {regularAnswers.map((answer) => (
                          <FormControlLabel
                            key={answer.id}
                            control={
                              <Checkbox
                                checked={Array.isArray(currentValue) && currentValue.includes(answer.id)}
                                onChange={(e) => handleElChange(question.id, answer.id, questionType)}
                                disabled={Array.isArray(currentValue) && currentValue.some(val => 
                                  exclusiveAnswers.find(exc => exc.id === val)
                                )}
                              />
                            }
                            label={getAnswerText(answer)}
                          />
                        ))}
                        {exclusiveAnswers.map((answer) => (
                          <FormControlLabel
                            key={answer.id}
                            control={
                              <Checkbox
                                checked={Array.isArray(currentValue) && currentValue.includes(answer.id)}
                                onChange={(e) => {
                                  // For exclusive answers, clear all other selections
                                  if (e.target.checked) {
                                    setAllFields({
                                      ...allFields,
                                      [question.id]: [answer.id],
                                    });
                                  } else {
                                    setAllFields({
                                      ...allFields,
                                      [question.id]: [],
                                    });
                                  }
                                }}
                              />
                            }
                            label={getAnswerText(answer)}
                          />
                        ))}
                      </FormGroup>
                    </FormControl>
                  );
                } else {
                  // Single Choice Question (Radio buttons or Select)
                  return (
                    <FormControl key={question.id} component="fieldset" className={styles.formField}>
                      <FormLabel component="legend" className={styles.questionLabel}>
                        {questionText}
                      </FormLabel>
                      <RadioGroup
                        value={currentValue || ""}
                        onChange={(e) => handleElChange(question.id, e.target.value, questionType)}
                      >
                        {question.answers?.map((answer) => (
                          <FormControlLabel
                            key={answer.id}
                            value={answer.id}
                            control={<Radio />}
                            label={getAnswerText(answer)}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  );
                }
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
