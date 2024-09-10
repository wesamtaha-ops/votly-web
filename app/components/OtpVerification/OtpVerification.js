"use client";

import { useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "./OtpVerification.module.css";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { callApi } from "../../../helper";
import { useRouter } from "next/navigation";

const OtpVerification = ({ contactInfo, type }) => {
  const inputsRef = useRef([]);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { data: session, update: updateSession } = useSession();
  const userToken = session?.id;
  const router = useRouter();

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
    }

    toast.success("OTP has been sent successfully");
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      toast("Enter valid otp");
      return;
    }

    const response = await callApi({
      type: "post",
      url: type == "email" ? "emailVerify" : "mobileVerify",
      data: {
        code: enteredOtp,
      },
      userToken: userToken,
    });

    if (response.status == 200) {
      toast.success("OTP verified successfully!");
      await updateSession({ user: response.data });
      await reloadSession();

      router.push(type == "email" ? "/mobile-verification" : "/");
    } else {
      toast("Invalid OTP. Please try again.");
      setIsSuccess(false);
    }
  };

  return (
    <div className={styles.otpContainer}>
      <div className={styles.card}>
        <h2 className={styles.title}>
          Enter the 6-digit code sent to {contactInfo}
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
