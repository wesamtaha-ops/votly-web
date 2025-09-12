"use client"; // Ensure this component is treated as a client-side component

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl"; // Import for translations
import styles from "./ForgotPassword.module.css";
import { callApi } from "../../helper";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
  const t = useTranslations("ForgotPassword"); // Initialize translations
  const [sentMode, setSentMode] = useState(false); // Email sent mode
  const [otpSent, setOtpSent] = useState(false); // OTP sent mode
  const [otpVerified, setOtpVerified] = useState(false); // OTP verified mode
  const [countdown, setCountdown] = useState(0); // Countdown timer
  const [canResend, setCanResend] = useState(false); // Can resend OTP
  const [userEmail, setUserEmail] = useState(""); // Store user email for resend
  const lang = useLocale(); // Get the current locale
  const router = useRouter();

  // Form handling
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0 && otpSent) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, otpSent]);

  // Handle email submission
  const onSubmitEmail = async (data) => {
    await callApi({
      type: "post",
      url: "forget",
      data: {
        email: data["email"],
      },
      lang: lang,
    });

    setUserEmail(data["email"]);
    setSentMode(true);
    setOtpSent(true);
    setCountdown(120); // 2 minutes countdown
    setCanResend(false);

    toast.success(t("otpSentMessage"));
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    try {
      await callApi({
        type: "post",
        url: "forget",
        data: {
          email: userEmail,
        },
        lang: lang,
      });

      setCountdown(120); // Reset to 2 minutes
      setCanResend(false);
      toast.success(t("otpSentMessage"));
    } catch (error) {
      toast.error(t("resendFailed"));
    }
  };

  // Handle OTP submission
  const onSubmitOtp = async (data) => {
    const res = await callApi({
      type: "post",
      url: "forgetVerifyOtp",
      data: {
        forget_password_key: data["otp"],
      },
    });

    if (res.status == 200) {
      setOtpVerified(true);
    } else {
      toast.error("OTP is incorrect");
    }
  };

  // Handle new password submission
  const onSubmitNewPassword = async (data) => {
    const res = await callApi({
      type: "post",
      url: "forgetUpdatePassword",
      data: {
        forget_password_key: data["otp"],
        password: data["newPassword"],
      },
    });

    if (res.status == 200) {
      router.push("/login");
    } else {
      toast.error("Something went wrong! please try again later");
    }
  };

  // Format countdown time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderStepIndicator = () => {
    return (
      <div className={styles.stepIndicator}>
        <div className={`${styles.step} ${!sentMode ? styles.stepActive : ''}`} />
        <div className={`${styles.step} ${sentMode && !otpVerified ? styles.stepActive : ''}`} />
        <div className={`${styles.step} ${otpVerified ? styles.stepActive : ''}`} />
      </div>
    );
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>{t("forgotPasswordTitle")}</h2>
      {renderStepIndicator()}

      {/* Step 1: Email Submission */}
      {!sentMode && (
        <form className={styles.form} onSubmit={handleSubmit(onSubmitEmail)}>
          <input
            className={styles.input}
            {...register("email", {
              required: t("emailRequired"),
              pattern: { value: /^\S+@\S+$/i, message: t("invalidEmail") },
            })}
            placeholder={t("emailPlaceholder")}
          />
          {errors.email && (
            <p className={styles.error}>{errors.email.message}</p>
          )}
          <button className={styles.button} type="submit">
            {t("resetPasswordButton")}
          </button>
        </form>
      )}

      {/* Step 2: OTP Submission */}
      {otpSent && !otpVerified && (
        <form className={styles.form} onSubmit={handleSubmit(onSubmitOtp)}>
          <input
            className={styles.input}
            {...register("otp", {
              required: t("otpRequired"),
              minLength: { value: 6, message: t("otpInvalid") },
            })}
            placeholder={t("otpPlaceholder")}
          />
          {errors.otp && <p className={styles.error}>{errors.otp.message}</p>}
          <button className={styles.button} type="submit">
            {t("verifyOtpButton")}
          </button>
          
          {/* Resend OTP Section */}
          <div className={styles.resendSection}>
            {countdown > 0 ? (
              <p className={styles.countdownText}>
                {t("resendCodeIn")} {formatTime(countdown)} {t("seconds")}
              </p>
            ) : (
              <button
                type="button"
                className={styles.resendButton}
                onClick={handleResendOtp}
                disabled={!canResend}
              >
                {t("resendCode")}
              </button>
            )}
          </div>
        </form>
      )}

      {/* Step 3: New Password Submission */}
      {otpVerified && (
        <form className={styles.form} onSubmit={handleSubmit(onSubmitNewPassword)}>
          <input
            type="password"
            className={styles.input}
            {...register("newPassword", {
              required: t("passwordRequired"),
              minLength: { value: 8, message: t("passwordMinLength") },
            })}
            placeholder={t("newPasswordPlaceholder")}
          />
          {errors.newPassword && (
            <p className={styles.error}>{errors.newPassword.message}</p>
          )}
          <input
            type="password"
            className={styles.input}
            {...register("confirmPassword", {
              required: t("confirmPasswordRequired"),
              validate: (value) =>
                value === watch("newPassword") || t("passwordsDoNotMatch"),
            })}
            placeholder={t("confirmPasswordPlaceholder")}
          />
          {errors.confirmPassword && (
            <p className={styles.error}>{errors.confirmPassword.message}</p>
          )}
          <button className={styles.button} type="submit">
            {t("setNewPasswordButton")}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
