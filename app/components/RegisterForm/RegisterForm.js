"use client"; // Ensure this component is treated as a client-side component
import react, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import styles from "./RegisterForm.module.css";
import { callApi } from "../../../helper";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

const RegisterForm = () => {
  const [redirection, setRedirection] = useState(false);
  const [requestError, setRequestError] = useState("");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async (payload) => {
    try {
      const res = await callApi({
        type: "post",
        url: "register",
        data: payload,
      });

      if (res.status == 1) {
        const { error, status } = await signIn("credentials", {
          email: payload.phone,
          password: payload.password,
          redirect: false,
        });

        if (error) {
          setRequestError("An error happened! please try again later");

          console.log("error", error);
        } else {
          setRedirection(true);
        }
      } else {
        setRequestError("An error happened! please try again later");
      }
    } catch (error) {
      setRequestError("Email / Phone number is already exist");
    }
  };

  useEffect(() => {
    if (redirection) {
      redirect("/");
    }

    return () => {
      setRedirection(false);
    };
  }, [redirection]);

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Sign up for Votly</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {requestError && (
          <p role="alert" className={styles.error}>
            {requestError}
          </p>
        )}

        <input
          className={`${styles.input} ${
            errors.email ? styles.errorBorder : ""
          }`}
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
          })}
          placeholder="Email"
        />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}

        <input
          className={`${styles.input} ${
            errors.password ? styles.errorBorder : ""
          }`}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          type="password"
          placeholder="Password"
        />
        {errors.password && (
          <p className={styles.error}>{errors.password.message}</p>
        )}

        <div className={styles.nameContainer}>
          <input
            className={`${styles.inputHalf} ${
              errors.firstname ? styles.errorBorder : ""
            }`}
            {...register("firstname", { required: "First name is required" })}
            placeholder="First name"
          />
          <input
            className={`${styles.inputHalf} ${
              errors.lastname ? styles.errorBorder : ""
            }`}
            {...register("lastname", { required: "Last name is required" })}
            placeholder="Last name"
          />
        </div>
        {errors.firstname && (
          <p className={styles.error}>{errors.firstname.message}</p>
        )}
        {errors.lastname && (
          <p className={styles.error}>{errors.lastname.message}</p>
        )}

        <input
          className={`${styles.input} ${
            errors.phone ? styles.errorBorder : ""
          }`}
          {...register("phone", { required: "Phone is required" })}
          placeholder="Phone"
        />

        {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}

        <div className={styles.genderContainer}>
          <label className={styles.label}>Are you…?</label>
          <div>
            <input
              type="radio"
              value="Female"
              {...register("gender", { required: "Gender is required" })}
              className={styles.radioInput}
            />
            Female
          </div>
          <div>
            <input
              type="radio"
              value="Male"
              {...register("gender", { required: "Gender is required" })}
              className={styles.radioInput}
            />
            Male
          </div>
        </div>
        {errors.gender && (
          <p className={styles.error}>{errors.gender.message}</p>
        )}

        <div className={styles.dateOfBirthContainer}>
          <select
            className={`${styles.inputHalf} ${
              errors.month ? styles.errorBorder : ""
            }`}
            {...register("month")}
          >
            <option value="">Month</option>
            <option value="January">January</option>
            <option value="February">February</option>
            {/* Add other months */}
          </select>
          <select
            className={`${styles.inputHalf} ${
              errors.year ? styles.errorBorder : ""
            }`}
            {...register("year")}
          >
            <option value="">Year</option>
            <option value="2000">2000</option>
            <option value="1999">1999</option>
            {/* Add other years */}
          </select>
        </div>

        <select
          className={`${styles.input} ${
            errors.country_id ? styles.errorBorder : ""
          }`}
          {...register("country_id", { required: "Country is required" })}
        >
          <option value="">What's your citizenship?</option>
          <option value="1">United States</option>
          <option value="2">United Kingdom</option>
          {/* Add other countries */}
        </select>

        <div className={styles.termsContainer}>
          <label>
            <input
              type="checkbox"
              {...register("terms", { required: "You must accept the terms" })}
              className={styles.checkbox}
            />
            I have read and accept the{" "}
            <Link href="/terms" className={styles.link}>
              Terms and Conditions
            </Link>
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              {...register("privacy", {
                required: "You must acknowledge the privacy policy",
              })}
              className={styles.checkbox}
            />
            I have read and acknowledge the{" "}
            <Link href="/privacy" className={styles.link}>
              Privacy Policy
            </Link>
          </label>
        </div>
        {errors.terms && <p className={styles.error}>{errors.terms.message}</p>}
        {errors.privacy && (
          <p className={styles.error}>{errors.privacy.message}</p>
        )}

        <button className={styles.button} type="submit">
          Sign up
        </button>
      </form>
      <p className={styles.loginLink}>
        Already have an account?{" "}
        <Link href="/login" className={styles.link}>
          Log in
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
