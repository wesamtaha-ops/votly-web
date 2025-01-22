"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./LoginForm.module.css";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl"; // Import for translations
import Button from "../Shared/Button";
import toast from "react-hot-toast"; // Import toast for notifications

const Login = () => {
  const [loading, setLoading] = useState(false); // Loader state
  const searchParams = useSearchParams();
  const t = useTranslations("Login"); // Initialize translations
  const lang = useLocale(); // Get the current locale

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    clearErrors,
    resetField,
  } = useForm();

  const onSubmit = async (payload) => {
    setLoading(true); // Start loading
    clearErrors(); // Clear any previous errors before a new request

    try {
      const result = await signIn("credentials", {
        email: payload.email.toLowerCase(),
        password: payload.password,
        lang: lang,
        redirect: false,
      });

      if (result.error) {
        setError("submit", {
          message: t("loginFailed"),
        });
        toast.error(t("loginFailed")); // Show error toast
        setTimeout(() => {
          clearErrors(); // Clear the error after 5 seconds
        }, 3000);
      } else {
        const callbackUrl = searchParams.get("callbackUrl");
        window.location.href = callbackUrl ? callbackUrl : "/";
      }
    } catch (error) {
      setError("submit", {
        message: t("loginFailed"),
      });
      toast.error(t("loginFailed")); // Show error toast
      setTimeout(() => {
        clearErrors(); // Clear the error after 5 seconds
      }, 3000);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const validateEmailOrPhone = (value) => {
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    const phonePattern = /^\+?\d{10,15}$/;

    // If it's a phone number but doesn't start with +, add it
    if (phonePattern.test(value) && !value.startsWith("+")) {
      return `+${value}`;
    }

    if (emailPattern.test(value) || phonePattern.test(value)) {
      return true;
    }

    return t("validEmailOrPhone");
  };

  // Handle "Enter" keypress to submit the form
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default form submit behavior
      handleSubmit(onSubmit)(); // Trigger the form submit
    }
  };

  return (
    <div
      className={styles.loginContainer}
      style={{ opacity: loading ? 0.5 : 1 }}
    >
      <div className={styles.loginBox}>
        <h2 className={styles.title}>{t("logIn")}</h2>
        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
          onKeyPress={handleKeyPress} // Listen for "Enter" keypress
        >
          {/* Display request error */}
          {errors.submit && (
            <p role="alert" className={styles.error}>
              {errors.submit.message}
            </p>
          )}

          <input
            type="text"
            placeholder={t("emailOrPhone")}
            className={`${styles.input} ${
              errors.email ? styles.errorBorder : ""
            }`}
            {...register("email", {
              required: t("emailRequired"),
              validate: validateEmailOrPhone,
            })}
            disabled={loading} // Disable input when loading
          />
          {errors.email && (
            <p role="alert" className={styles.error}>
              {errors.email.message}
            </p>
          )}

          <input
            type="password"
            placeholder={t("password")}
            className={`${styles.input} ${
              errors.password ? styles.errorBorder : ""
            }`}
            {...register("password", { required: t("passwordRequired") })}
            disabled={loading} // Disable input when loading
          />
          {errors.password && (
            <p role="alert" className={styles.error}>
              {errors.password.message}
            </p>
          )}

          <Button
            title={loading ? t("loading") : t("logIn")} // Show "loading..." while submitting
            style={{ fontFamily: "Almarai", marginTop: 20 }}
            disabled={loading} // Disable button when loading
          />
        </form>
        <br />
        <Link href="/forgot-password" className={styles.forgotPasswordLink}>
          {t("forgotPassword")}
        </Link>
        <br />
        <br />
        <Link href="/register" className={styles.forgotPasswordLink}>
          {t("register")}
        </Link>
      </div>
    </div>
  );
};

export default Login;
