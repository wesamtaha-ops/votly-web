"use client";
import react, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./LoginForm.module.css";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

const Login = () => {
  const [redirection, setRedirection] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm();

  const onSubmit = async (payload) => {
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
      setRedirection(true);
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
          {errors.submit && (
            <p role="alert" className="error">
              {errors.submit.message}
            </p>
          )}

          <input
            type="text"
            placeholder="Phone number or email"
            className={styles.input}
            {...register("email", {
              required: "Email Address is required",
              validate: validateEmailOrPhone,
            })}
          />
          {errors.email && (
            <p role="alert" className="error">
              {errors.email.message}
            </p>
          )}

          <input
            type="password"
            placeholder="Password"
            className={styles.input}
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p role="alert" className="error">
              {errors.password.message}
            </p>
          )}

          <button type="submit" className={styles.loginButton}>
            Log in
          </button>
        </form>
        <br />
        <Link href="/forgot-password" className={styles.forgotPasswordLink}>
          Forgot your password?
        </Link>
      </div>
    </div>
  );
};

export default Login;
