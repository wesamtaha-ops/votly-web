"use client";
import react, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./LoginForm.module.css";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Button from "../Shared/Button";

const Login = () => {
  const [requestError, setRequestError] = useState("");
  const searchParams = useSearchParams();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async (payload) => {
    try {
      const { error, status } = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
      });

      if (error) {
        // login failed
        setError("submit", {
          message: "Login failed, please check your email or password",
        });
      } else {
        const callbackUrl = searchParams.get("callbackUrl");
        window.location.href = callbackUrl ? callbackUrl : "/";
      }
    } catch (error) {
      setRequestError("Login failed, please check your email or password");
    }
  };

  const validateEmailOrPhone = (value) => {
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    const phonePattern = /^\+?\d{10,15}$/;
    if (emailPattern.test(value) || phonePattern.test(value)) {
      return true;
    }
    return "Please enter a valid email or phone number";
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Log in</h2>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          {requestError && (
            <p role="alert" className={styles.error}>
              {requestError}
            </p>
          )}

          <input
            type="text"
            placeholder="Phone number or email"
            className={`${styles.input} ${
              errors.email ? styles.errorBorder : ""
            }`}
            {...register("email", {
              required: "Email Address is required",
              validate: validateEmailOrPhone,
            })}
          />
          {errors.email && (
            <p role="alert" className={styles.error}>
              {errors.email.message}
            </p>
          )}

          <input
            type="password"
            placeholder="Password"
            className={`${styles.input} ${
              errors.password ? styles.errorBorder : ""
            }`}
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p role="alert" className={styles.error}>
              {errors.password.message}
            </p>
          )}

          <Button
            title="Log in"
            onClick={handleSubmit(onSubmit)}
            style={{ marginTop: 20 }}
          />
        </form>
        <br />
        <Link href="/forgot-password" className={styles.forgotPasswordLink}>
          Forgot your password?
        </Link>

        <br />
        <br />
        <Link href="/register" className={styles.forgotPasswordLink}>
          Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
