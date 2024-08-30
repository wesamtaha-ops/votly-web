"use client";

import Link from "next/link";
import styles from "./LoginForm.module.css";
import { useForm } from "react-hook-form";
import { callApi } from "../../../helper";

const Login = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm();
  const onSubmit = async (payload) => {
    const res = await callApi({
      type: "post",
      url: "login",
      data: payload,
    });

    if (res.status === "0") {
      // login failed
      setError("submit", {
        message: "Login failed, please check your email or password",
      });
    } else {
      alert("success");
    }
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
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: "Invalid email address",
              },
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
