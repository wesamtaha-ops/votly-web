"use client"; // Ensure this component is treated as a client-side component

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl"; // Import for translations
import styles from "./ForgotPassword.module.css";
import { callApi } from "../../helper";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
  const t = useTranslations("ForgotPassword"); // Initialize translations
  const [sentMode, setSentMode] = useState(false); // Email sent mode
  const [otpSent, setOtpSent] = useState(false); // OTP sent mode
  const [otpVerified, setOtpVerified] = useState(false); // OTP verified mode
  const router = useRouter();

  // Form handling
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  // Handle email submission
  const onSubmitEmail = async (data) => {
    const res = await callApi({
      type: "post",
      url: "forget",
      data: {
        email: data["email"],
      },
    });

    setSentMode(true);
    setOtpSent(true);

    toast.success("OTP has been sent to your email");
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

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>{t("forgotPasswordTitle")}</h2>

      {/* Step 1: Email Submission */}
      {!sentMode && (
        <form onSubmit={handleSubmit(onSubmitEmail)}>
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
          <br />
          <button className={styles.button} type="submit">
            {t("resetPasswordButton")}
          </button>
        </form>
      )}

      {/* Step 2: OTP Submission */}
      {otpSent && !otpVerified && (
        <form onSubmit={handleSubmit(onSubmitOtp)}>
          <input
            className={styles.input}
            {...register("otp", {
              required: t("otpRequired"),
              minLength: { value: 6, message: t("otpInvalid") },
            })}
            placeholder={t("otpPlaceholder")}
          />
          {errors.otp && <p className={styles.error}>{errors.otp.message}</p>}
          <br />
          <button className={styles.button} type="submit">
            {t("verifyOtpButton")}
          </button>
        </form>
      )}

      {/* Step 3: New Password Submission */}
      {otpVerified && (
        <form onSubmit={handleSubmit(onSubmitNewPassword)}>
          <input
            type="password"
            className={styles.input}
            {...register("newPassword", {
              required: t("passwordRequired"),
              minLength: { value: 6, message: t("passwordMinLength") },
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
          <br />
          <button className={styles.button} type="submit">
            {t("setNewPasswordButton")}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
