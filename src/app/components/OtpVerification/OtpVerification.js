"use client";

import { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./OtpVerification.module.css";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { callApi } from "../../helper";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl"; // Import for translations
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
  const [message, setMessage] = useState("");
  const [smsOtpSent, setSmsOtpSent] = useState(false);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();

  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };

  const handleInputChange = (index, event) => {
    const value = event.target.value;

    // Check if pasted value contains more than one character (indicating a paste action)
    if (value.length > 1) {
      // Split the pasted value and update the OTP array
      const newOtp = [...otp];
      for (let i = 0; i < value.length && index + i < newOtp.length; i++) {
        newOtp[index + i] = value[i];
      }
      setOtp(newOtp);

      // Move focus to the next empty input (if available)
      const nextIndex = index + value.length - 1;
      if (nextIndex < inputsRef.current.length) {
        inputsRef.current[nextIndex].focus();
      }
    } else if (/^[0-9]$/.test(value)) {
      // If single digit input, update the current input
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to the next input field
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

    // Check if the pasted data is a 6-digit OTP
    if (/^\d{6}$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);

      // Move focus to the last input after filling all fields
      inputsRef.current[5]?.focus();
    }
  };

  const resendOtp = async () => {
    if (type == "email") {
      await callApi({
        type: "post",
        url: "resendOtp",
        userToken: session?.id,
      });
      toast.success(t("otpSent"));
    } else {
      handleSendOtp();
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      toast(t("enterValidOtp"));
      return;
    }

    let response;
    if (type == "email") {
      response = await callApi({
        type: "post",
        url: "emailVerify",
        data: { code: enteredOtp },
        userToken: session?.id,
      });
    } else {
      response = await handleVerifyOtp(enteredOtp);
    }

    if (response.status == 200) {
      toast.success(t("otpVerified"));
      await updateSession({ user: response.data });
      await reloadSession();
      router.push(
        type == "email"
          ? "/mobile-verification"
          : session?.user?.is_profile_completed
          ? "/"
          : "/complete-profile"
      );
    } else {
      toast.error(t("invalidOtp"));
    }
  };

  useEffect(() => {
    if (!recaptchaVerifier) {
      // Create the recaptcha verifier
      const localRecaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container", // This should match the ID of the HTML element
        {
          size: "invisible", // reCAPTCHA is invisible
        }
      );

      setRecaptchaVerifier(localRecaptchaVerifier);
    }
  }, [recaptchaVerifier]);

  const handleSendOtp = async (notify = true) => {
    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        "+" + contactInfo,
        recaptchaVerifier
      );
      setFirebaseVerificationId(confirmationResult.verificationId);
      if (notify) {
        toast.success("OTP has been sent successfully");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Error sending OTP. Please try again.");
    } finally {
    }
  };

  const handleVerifyOtp = async (otp) => {
    if (!otp || !firebaseVerificationId) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      const credential = PhoneAuthProvider.credential(
        firebaseVerificationId,
        otp
      ); // Create credential using OTP and verificationId
      await signInWithCredential(auth, credential); // Sign in using the credential

      // toast.success("Phone number verified successfully");

      // After verification, update the phone verification status in the backend
      return await callApi({
        type: "post",
        url: "mobileVerify",
        userToken: session?.id,
      });
    } catch (error) {
      console.log("error", error);
      return {
        status: 400,
      };
    }
  };

  useEffect(() => {
    if (!smsOtpSent && recaptchaVerifier) {
      handleSendOtp(false);
      setSmsOtpSent(true);
    }
  }, [smsOtpSent, recaptchaVerifier]);

  return (
    <div className={styles.otpContainer}>
      <div id="recaptcha-container"></div>
      <div className={styles.card}>
        {type == "mobile" && (
          <img
            src="https://static.vecteezy.com/system/resources/previews/025/674/495/non_2x/verification-otp-one-time-password-has-been-send-input-code-with-smartphone-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
            alt="otp"
            className={styles.otpImage}
          />
        )}
        {type == "email" && (
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
              onPaste={handlePaste} // Add onPaste event listener to the first input
            />
          ))}
        </div>
        <button className={styles.submitButton} onClick={handleSubmit}>
          {t("submit")}
        </button>
        <button className={styles.btnResend} onClick={resendOtp}>
          {t("resendOtp")}
        </button>
      </div>
    </div>
  );
};

OtpVerification.propTypes = {
  contactInfo: PropTypes.string.isRequired,
};

export default OtpVerification;
