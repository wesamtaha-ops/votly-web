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

  const [categories, setCategories] = useState([]);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [answersLoaded, setAnswersLoaded] = useState(false);
  const [answersLoading, setAnswersLoading] = useState(false);

  const [allFields, setAllFields] = useState({});
  const [allLoaded, setAllLoaded] = useState(false);
  const [flatQuestions, setFlatQuestions] = useState([]);

  const [submitting, setSubmitting] = useState(false);

  // Helper function to get translation based on locale
  const getTranslation = (translations, locale) => {
    const translation = translations?.find(t => t.locale === locale);
    return translation?.text || translations?.[0]?.text || '';
  };

  // Helper function to flatten questions from categories
  const flattenQuestions = (categoriesData, locale) => {
    const questions = [];
    const processedQuestionIds = new Set(); // Track processed question IDs to avoid duplicates

    categoriesData.forEach(category => {
      // Skip hidden categories
      if (category.hidden) return;

      // Process questions directly in category
      if (category.questions) {
        category.questions.forEach(question => {
          // Skip hidden questions, questions without code starting with "P", or already processed questions
          if (question.hidden || !question.code || !question.code.startsWith('C') || !question.code.startsWith('P') || processedQuestionIds.has(question.id)) return;

          processedQuestionIds.add(question.id);
          questions.push({
            ...question,
            categoryId: category.id,
            categoryName: getTranslation(category.translations, locale),
            questionText: getTranslation(question.translations, locale),
            answers: question.answers?.map(answer => ({
              ...answer,
              text: getTranslation(answer.translations, locale)
            })) || []
          });
        });
      }

      // Process standalone questions (questions that appear directly in the data array)
      if (category.synoQuestionTypeId && category.code && (category.code.startsWith('P') || category.code.startsWith('C'))) {
        // Skip if already processed
        if (processedQuestionIds.has(category.id)) return;

        processedQuestionIds.add(category.id);
        // This is actually a question, not a category, and has code starting with "P"
        questions.push({
          ...category,
          questionText: getTranslation(category.translations, locale),
          answers: category.answers?.map(answer => ({
            ...answer,
            text: getTranslation(answer.translations, locale)
          })) || []
        });
      }
    });

    // Sort questions by their code for consistent ordering
    return questions.sort((a, b) => {
      const aCode = a.code || '';
      const bCode = b.code || '';
      return aCode.localeCompare(bCode);
    });
  };

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

      const categoriesData = response?.externalResponse?.data ?? [];
      setCategories(categoriesData);

      // Flatten questions for easier processing
      const questions = flattenQuestions(categoriesData, lang);
      setFlatQuestions(questions);
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
      const fields = flatQuestions.reduce((acc, question) => {
        const isMultiSelect = question.synoQuestionTypeId === 3;

        if (isMultiSelect) {
          // For multi-select questions, collect all matching answers into an array
          // Match using synoQuestionId from API response to question.id from questions
          const matchingAnswers = answers
            .filter((answer) => answer.synoQuestionId === question.id)
            .map(answer => answer.synoAnswerId);
          // Only set the array if it has items, otherwise set undefined
          acc[question.id] = matchingAnswers.length > 0 ? matchingAnswers : undefined;

          if (matchingAnswers.length > 0) {
            console.log(`Multi-select question ${question.id} pre-selected with answers:`, matchingAnswers);
          }
        } else {
          // For single-select questions, find the first matching answer
          // Match using synoQuestionId from API response to question.id from questions
          const answer = answers.find((answer) => answer.synoQuestionId === question.id);
          acc[question.id] = answer?.synoAnswerId;

          if (answer) {
            console.log(`Single-select question ${question.id} pre-selected with answer:`, answer.synoAnswerId);
          }
        }
        return acc;
      }, {});
      console.log('Processed fields for pre-selection:', fields);
      console.log('Total questions loaded:', flatQuestions.length);
      console.log('Total answers from API:', answers.length);
      setAllLoaded(true);
      setAllFields(fields);
    }
  }, [flatQuestions, answers, questionsLoaded, answersLoaded]);

  const completedFields = Object.values(allFields).filter(value => {
    if (Array.isArray(value)) {
      return value.length > 0; // For multi-select, check if array has items
    }
    return Boolean(value); // For single select, check if value exists
  }).length;
  const totalFields = Object.keys(allFields).length;
  const completionPercentage = (completedFields / totalFields) * 100;

  const handleElChange = async (key, value, isMultiSelect = false) => {
    if (isMultiSelect) {
      // Handle checkbox array values
      setAllFields({
        ...allFields,
        [key]: value,
      });
    } else {
      // Handle single select values
      setAllFields({
        ...allFields,
        [key]: value,
      });
    }
  };

  const handleCheckboxChange = (questionId, answerId, checked) => {
    const currentValues = allFields[questionId] || [];
    let newValues;

    if (checked) {
      // Add the answer ID if it's not already in the array
      newValues = currentValues.includes(answerId)
        ? currentValues
        : [...currentValues, answerId];
    } else {
      // Remove the answer ID from the array
      newValues = currentValues.filter(id => id !== answerId);
    }

    // Set to undefined if array becomes empty, otherwise set the array
    setAllFields({
      ...allFields,
      [questionId]: newValues.length > 0 ? newValues : undefined,
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    const payload = Object.entries(allFields)
      .filter(([questionId, value]) => {
        if (Array.isArray(value)) {
          return value.length > 0; // For arrays, check if not empty
        }
        return value !== undefined && value !== null && value !== ""; // For single values
      })
      .flatMap(([questionId, value]) => {
        if (Array.isArray(value)) {
          // For multi-select questions, create multiple entries
          return value.map(id => ({
            questionId: parseInt(questionId),
            id: id,
          }));
        } else {
          // For single-select questions, create single entry
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
    <div className={styles.pageWrapper}>
      {!allLoaded ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}>
            <CircularProgress size={60} thickness={4} />
          </div>
          <Typography variant="h6" className={styles.loadingText}>
            Loading your profile questions...
          </Typography>
        </div>
      ) : (
        <div className={styles.mainContainer}>
          {/* Header Section */}
          <div className={styles.headerSection}>
            <div className={styles.headerContent}>
              {/* Circular Progress on the left */}
              <div className={styles.circularProgressContainer}>
                <div className={styles.circularProgress}>
                  <CircularProgress
                    variant="determinate"
                    value={completionPercentage}
                    size={100}
                    thickness={4}
                    className={styles.progressCircle}
                  />
                  <div className={styles.progressText}>
                    <span className={styles.progressNumber}>{Math.round(completionPercentage)}%</span>
                    <span className={styles.progressLabel}>Complete</span>
                  </div>
                </div>
              </div>

              {/* Text content on the right */}
              <div className={styles.textContent}>
                <Typography variant="h3" className={styles.mainTitle}>
                  {t("beforeContinue")}
                </Typography>
                <Typography variant="body1" className={styles.subtitle}>
                  {t("moreDetails")}
                </Typography>
              </div>
            </div>
          </div>

          {/* Questions Grid */}
          <div className={styles.questionsGrid}>
            {flatQuestions.map((question, index) => {
              const isMultiSelect = question.synoQuestionTypeId === 3;
              const isCompleted = allFields[question.id];

              return (
                <div
                  key={question.id}
                  className={`${styles.questionCard} ${isCompleted ? styles.completed : ''}`}
                >
                  <div className={styles.questionHeader}>
                    <div className={`${styles.questionBadge} ${isCompleted ? styles.badgeCompleted : ''}`}>
                      {index + 1}
                    </div>
                    <Typography
                      variant="h6"
                      className={styles.questionTitle}
                      style={{
                        textAlign: lang === 'ar' ? 'right' : 'left',
                        direction: lang === 'ar' ? 'rtl' : 'ltr'
                      }}
                    >
                      {question.questionText}
                    </Typography>
                  </div>

                  <div className={styles.questionContent}>
                    {isMultiSelect ? (
                      <FormControl component="fieldset" className={styles.checkboxGroup}>
                        <FormGroup>
                          {question.answers
                            .filter(answer => !answer.hidden)
                            .map((answer) => {
                              const currentValues = allFields[question.id] || [];
                              const isChecked = currentValues.includes(answer.id);

                              return (
                                <FormControlLabel
                                  key={answer.id}
                                  control={
                                    <Checkbox
                                      checked={isChecked}
                                      onChange={(e) => handleCheckboxChange(question.id, answer.id, e.target.checked)}
                                      className={styles.customCheckbox}
                                    />
                                  }
                                  label={answer.text}
                                  className={`${styles.checkboxLabel} ${isChecked ? styles.checked : ''}`}
                                />
                              );
                            })}
                        </FormGroup>
                      </FormControl>
                    ) : (
                      <TextField
                        select
                        placeholder={t("selectOption")}
                        variant="outlined"
                        fullWidth
                        className={styles.questionInput}
                        value={allFields[question.id] || ""}
                        onChange={(e) => handleElChange(question.id, e.target.value)}
                        SelectProps={{
                          displayEmpty: true,
                          renderValue: (value) => {
                            if (!value) return t("selectOption");
                            const answer = question.answers.find(a => a.id === value);
                            return answer ? answer.text : "";
                          }
                        }}
                      >
                        {question.answers.map((answer) => (
                          <MenuItem
                            key={answer.id}
                            value={answer.id}
                            disabled={answer.hidden}
                          >
                            {answer.text}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Section */}
          <div className={styles.submitSection}>
            <Button
              variant="contained"
              disabled={submitting}
              onClick={handleSubmit}
              className={styles.submitBtn}
              size="large"
            >
              {submitting ? (
                <>
                  <CircularProgress size={20} style={{ marginRight: 8, color: 'white' }} />
                  {t("submitting")}
                </>
              ) : (
                t("submit")
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCompletionForm;
