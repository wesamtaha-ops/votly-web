"use client";

import { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./OtpVerification.module.css";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { callApi } from "../../helper";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl"; // Import for translations
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "../../../../lib/firebase";

const OtpVerification = ({ contactInfo, type }) => {
  const t = useTranslations("OtpVerification"); // Initialize translations
  const inputsRef = useRef([]);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [firebaseVerificationId, setFirebaseVerificationId] = useState(null);
  const [smsOtpSent, setSmsOtpSent] = useState(false);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const [loading, setLoading] = useState(false); // Loader state
  const [timer, setTimer] = useState(0); // Timer state
  const { data: session, update: updateSession } = useSession();
  const lang = useLocale(); // Get the current locale
  const router = useRouter();

  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };

  const handleInputChange = (index, event) => {
    const value = event.target.value;

    if (value.length > 1) {
      const newOtp = [...otp];
      for (let i = 0; i < value.length && index + i < newOtp.length; i++) {
        newOtp[index + i] = value[i];
      }
      setOtp(newOtp);
      const nextIndex = index + value.length - 1;
      if (nextIndex < inputsRef.current.length) {
        inputsRef.current[nextIndex].focus();
      }
    } else if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handlePaste = async (event) => {
    event.preventDefault();
    const pasteData = (event.clipboardData || window.clipboardData).getData(
      "text"
    );

    if (/^\d{6}$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      inputsRef.current[5]?.focus();
    }
  };

  useEffect(() => {
    const storedTime = localStorage.getItem("otpResendTime");
    const currentTime = new Date().getTime();

    if (storedTime && currentTime < storedTime) {
      const remainingTime = Math.ceil((storedTime - currentTime) / 1000);
      setTimer(remainingTime);
    }

    const interval = setInterval(() => {
      const storedTime = localStorage.getItem("otpResendTime");
      if (storedTime) {
        const currentTime = new Date().getTime();
        const remainingTime = Math.ceil((storedTime - currentTime) / 1000);

        if (remainingTime > 0) {
          setTimer(remainingTime);
        } else {
          setTimer(0);
          localStorage.removeItem("otpResendTime");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const resendOtp = async () => {
    if (loading || timer > 0) return;
    setLoading(true); // Start loader

    try {
      if (type === "email") {
        await callApi({
          type: "post",
          url: "resendOtp",
          userToken: session?.id,
          lang: lang,
        });
        toast.success(t("otpSent"));
      } else {
        handleSendOtp();
      }

      // Set the timer for 60 seconds and store it in localStorage
      const expiryTime = new Date().getTime() + 60000;
      localStorage.setItem("otpResendTime", expiryTime);
      setTimer(60);

      // Start countdown
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            localStorage.removeItem("otpResendTime");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error(t("otpSendError"));
    } finally {
      setLoading(false); // Stop loader
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      toast.error(t("enterValidOtp"));
      return;
    }

    setLoading(true); // Start loader

    let response;
    try {
      if (type === "email") {
        response = await callApi({
          type: "post",
          url: "emailVerify",
          data: { code: enteredOtp },
          userToken: session?.id,
        });
      } else {
        response = await handleVerifyOtp(enteredOtp);
      }

      if (response.status === 200) {
        toast.success(t("otpVerified"));
        await updateSession({ user: response.data });
        await reloadSession();
        router.push(
          type === "email"
            ? "/mobile-verification"
            : session?.user?.is_profile_completed
            ? "/"
            : "/complete-profile"
        );
      } else {
        toast.error(t("invalidOtp"));
      }
    } catch (error) {
      toast.error(t("otpVerificationError"));
    } finally {
      setLoading(false); // Stop loader
    }
  };

  useEffect(() => {
    if (!recaptchaVerifier) {
      const localRecaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
      setRecaptchaVerifier(localRecaptchaVerifier);
    }
  }, [recaptchaVerifier]);

  const handleSendOtp = async (notify = true) => {
    setLoading(true); // Start loader
    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        "+" + contactInfo,
        recaptchaVerifier
      );
      setFirebaseVerificationId(confirmationResult.verificationId);
      if (notify) {
        toast.success(t("otpSentSuccess"));
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(t("otpSendError"));
    } finally {
      setLoading(false); // Stop loader
    }
  };

  const handleVerifyOtp = async (otp) => {
    if (!otp || !firebaseVerificationId) {
      toast.error(t("enterOtp"));
      return { status: 400 };
    }

    try {
      const credential = PhoneAuthProvider.credential(
        firebaseVerificationId,
        otp
      );
      await signInWithCredential(auth, credential);
      return await callApi({
        type: "post",
        url: "mobileVerify",
        userToken: session?.id,
      });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return { status: 400 };
    }
  };

  useEffect(() => {
    if (!smsOtpSent && recaptchaVerifier) {
      handleSendOtp(false);
      setSmsOtpSent(true);
    }
  }, [smsOtpSent, recaptchaVerifier]);

  return (
    <div
      className={styles.otpContainer}
      style={{ opacity: loading ? 0.5 : 1 }} // Adjust opacity when loading
    >
      <div id="recaptcha-container"></div>
      <div className={styles.card}>
        {type === "mobile" && (
          <img
            src="https://static.vecteezy.com/system/resources/previews/025/674/495/non_2x/verification-otp-one-time-password-has-been-send-input-code-with-smartphone-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
            alt="otp"
            className={styles.otpImage}
          />
        )}
        {type === "email" && (
          <img
            src="https://blog.typingdna.com/wp-content/uploads/2021/11/email_OTP.jpg"
            alt="otp"
            className={styles.otpImage}
          />
        )}
        <h2 className={styles.title}>
          {t("enterCode")} <br /> {contactInfo}
        </h2>
        <div dir="ltr" className={styles.otpInputs}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className={styles.otpInput}
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleInputChange(index, e)}
              onPaste={handlePaste} // Add onPaste event listener
              disabled={loading} // Disable input when loading
            />
          ))}
        </div>
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={loading} // Disable button when loading
        >
          {loading ? t("loading") : t("submit")} {/* Show loading text */}
        </button>
        <button
          className={
            loading || timer > 0 ? styles.btnResendDisabled : styles.btnResend
          }
          onClick={resendOtp}
          disabled={loading || timer > 0} // Disable button when loading
        >
          {timer > 0 ? `${t("resendOtpIn")} ${timer}s` : t("resendOtp")}
        </button>
      </div>
    </div>
  );
};

OtpVerification.propTypes = {
  contactInfo: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default OtpVerification;
