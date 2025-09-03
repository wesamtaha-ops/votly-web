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
    
    categoriesData.forEach(category => {
      // Skip hidden categories
      if (category.hidden) return;
      
      // Process questions directly in category
      if (category.questions) {
        category.questions.forEach(question => {
          // Skip hidden questions
          if (question.hidden) return;
          
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
      if (category.synoQuestionTypeId) {
        // This is actually a question, not a category
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
    
    return questions;
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
        const answer = answers.find((answer) => answer.questionId === question.id);
        acc[question.id] = answer?.id;
        return acc;
      }, {});
      console.log('Processed fields:', fields);
      console.log('Flat questions:', flatQuestions);
      setAllLoaded(true);
      setAllFields(fields);
    }
  }, [flatQuestions, answers, questionsLoaded, answersLoaded]);

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
              {/* Group questions by category */}
              {categories
                .filter(category => !category.hidden)
                .map(category => {
                  // Get questions for this category
                  const categoryQuestions = flatQuestions.filter(q => 
                    q.categoryId === category.id || 
                    (category.synoQuestionTypeId && q.id === category.id)
                  );
                  
                  if (categoryQuestions.length === 0) return null;
                  
                  return (
                    <div key={category.id} className={styles.categorySection}>
                      {/* Category Header */}
                      {category.translations && (
                        <Typography 
                          variant="h6" 
                          className={styles.categoryTitle}
                          style={{ color: '#fff', marginBottom: '16px', marginTop: '24px' }}
                        >
                          {getTranslation(category.translations, lang)}
                        </Typography>
                      )}
                      
                      {/* Questions in this category */}
                      {categoryQuestions.map((question) => {
                        const isMultiSelect = question.synoQuestionTypeId === 3; // Multi-select questions
                        
                        return (
                          <TextField
                            key={question.id}
                            select={!isMultiSelect}
                            label={question.questionText}
                            variant="outlined"
                            fullWidth
                            className={styles.formField}
                            value={allFields[question.id] || ""}
                            onChange={(e) => handleElChange(question.id, e.target.value)}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            SelectProps={!isMultiSelect ? {
                              displayEmpty: true,
                              renderValue: (value) => {
                                if (!value) return "";
                                const answer = question.answers.find(a => a.id === value);
                                return answer ? answer.text : "";
                              }
                            } : {
                              multiple: true,
                              displayEmpty: true,
                              renderValue: (selected) => {
                                if (!selected || selected.length === 0) return "";
                                return selected.map(id => {
                                  const answer = question.answers.find(a => a.id === id);
                                  return answer ? answer.text : "";
                                }).join(', ');
                              }
                            }}
                          >
                            <MenuItem value="" disabled>
                              {t("selectOption")}
                            </MenuItem>
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
                        );
                      })}
                    </div>
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
