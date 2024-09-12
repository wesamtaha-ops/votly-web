"use client";

import { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./OtpVerification.module.css";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { callApi } from "../../../helper";
import { useRouter } from "next/navigation";
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "../../../lib/firebase";

const OtpVerification = ({ contactInfo, type }) => {
  const inputsRef = useRef([]);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [firebaseVerificationId, setFirebaseVerificationId] = useState(null);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { data: session, update: updateSession } = useSession();
  const userToken = session?.id;
  const router = useRouter();
  const [smsOtpSent, setSmsOtpSent] = useState(false);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);

  const handleInputChange = (index, event) => {
    const value = event.target.value;
    if (/^[0-9]$/.test(value)) {
      // Only allow digits
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1].focus();
      }
    } else if (value.length > 1) {
      // Handle paste event
      handlePaste(index, value);
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputsRef.current[index - 1].focus();
      }
    } else if (/^[0-9]$/.test(event.key)) {
      const newOtp = [...otp];
      newOtp[index] = event.key;
      setOtp(newOtp);
      if (index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1].focus();
      }
      event.preventDefault(); // Prevent double typing
    }
  };

  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };

  const handlePaste = (index, value) => {
    const newOtp = [...otp];
    const digits = value.slice(0, 6 - index).split("");
    digits.forEach((digit, i) => {
      newOtp[index + i] = digit;
    });
    setOtp(newOtp);
    // Focus on the last filled input
    const nextIndex = index + digits.length - 1;
    if (nextIndex < inputsRef.current.length) {
      inputsRef.current[nextIndex].focus();
    }
  };

  const resendOtp = async () => {
    if (type == "email") {
      await callApi({
        type: "post",
        url: "resendOtp",
        userToken: userToken,
      });

      toast.success("OTP has been sent successfully");
    } else {
      handleSendOtp();
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      toast("Enter valid otp");
      return;
    }

    let response;
    if (type == "email") {
      response = await callApi({
        type: "post",
        url: type == "emailVerify",
        data: {
          code: enteredOtp,
        },
        userToken: userToken,
      });
    } else {
      response = handleVerifyOtp(enteredOtp);
    }
    if (response.status == 200) {
      toast.success("OTP verified successfully!");
      await updateSession({ user: response.data });
      await reloadSession();

      router.push(type == "email" ? "/mobile-verification" : "/");
    } else {
      toast.error("Invalid OTP. Please try again.");
      setIsSuccess(false);
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
  }, []);

  const handleSendOtp = async (notify = true) => {
    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        contactInfo,
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

      toast.success("Phone number verified successfully");

      // After verification, update the phone verification status in the backend
      return await callApi({
        type: "post",
        url: type == "emailVerify",
        data: {
          code: enteredOtp,
        },
        userToken: userToken,
      });
    } catch (error) {
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
        <div id="recaptcha-container"></div>

        <h2 className={styles.title}>
          Enter the 6-digit code sent to <br /> {contactInfo}
        </h2>
        <div className={styles.otpInputs}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className={styles.otpInput}
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleInputChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </div>
        <button className={styles.submitButton} onClick={handleSubmit}>
          Submit
        </button>
        {message && (
          <p
            className={`${styles.message} ${
              isSuccess ? styles.success : styles.error
            }`}
          >
            {message}
          </p>
        )}

        <button className={styles.btnResend} onClick={resendOtp}>
          Resend Code
        </button>
      </div>
    </div>
  );
};

OtpVerification.propTypes = {
  contactInfo: PropTypes.string.isRequired,
};

export default OtpVerification;
