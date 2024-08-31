"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./EditProfile.module.css";
import Link from "next/link";
import { callApi } from "../../../helper";
import toast from "react-hot-toast";
import Button from "../Shared/Button";
import axios from "axios";

const EditProfile = ({ user, userToken, updateSession }) => {
  if (!user?.firstname) return;

  const [selectedImage, setSelectedImage] = useState(
    user.image ||
      "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"
  );
  const [imageFile, setImageFile] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
      phone: user.phone,
      birthday: user.birthday,
      gender: user.gender,
      bio: user.bio,
    },
  });

  const {
    register: passwordRegister,
    handleSubmit: passwordHandleSubmit,
    formState: { errors: passwordErros },
    watch: passwordWatch,
  } = useForm();

  const {
    register: profileImageRegister,
    handleSubmit: profileImageHandleSubmit,
    formState: { errors: profileImageErros },
    watch: profileImageWatch,
  } = useForm();

  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };

  const onSubmitMainInfo = async (data) => {
    const res = await callApi({
      type: "post",
      url: "profileUpdate",
      data: data,
      userToken: userToken,
    });

    if (res.status == "1") {
      await updateSession({ user: res.user });
      reloadSession();
      toast("Profile has changed successfully");
    } else {
      toast("something went wrong! please try again later");
    }
  };

  const onSubmitPassword = async (data) => {
    const res = await callApi({
      type: "post",
      url: "passwordUpdate",
      data: data,
      userToken: userToken,
    });

    if (res.status == "1") {
      toast("Password has changed successfully");
    } else {
      toast("something went wrong! please try again later");
    }
  };

  const onSubmitProfileImage = async (data) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_API}user`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (response.data.status == "1") {
        await updateSession({ user: response.data.user });
        reloadSession();
        toast("Profile Image has changed successfully");
      }
    } catch (error) {
      // Handle the error (e.g., display an error message)
      console.error("Error uploading image:", error);
      toast("something went wrong! please try again later");
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setImageFile(event.target.files[0]);
    }
  };

  return (
    <div className={styles.editProfileContainer}>
      <h2 className={styles.title}>Edit Profile</h2>

      <div className={styles.cardsGrid}>
        {/* Main Information Card */}
        <div className={`${styles.card} ${styles.mainInfoCard}`}>
          <h3 className={styles.cardTitle}>Main Information</h3>
          <form
            onSubmit={handleSubmit(onSubmitMainInfo)}
            className={styles.form}
          >
            <div className={styles.formGroup}>
              <label>First Name</label>
              <input
                className={`${styles.input} ${
                  errors.firstname ? styles.errorBorder : ""
                }`}
                {...register("firstname", {
                  required: "First name is required",
                })}
              />
              {errors.firstname && (
                <p className={styles.error}>{errors.firstname.message}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Last Name</label>
              <input
                className={`${styles.input} ${
                  errors.lastname ? styles.errorBorder : ""
                }`}
                {...register("lastname", { required: "Last name is required" })}
              />
              {errors.lastname && (
                <p className={styles.error}>{errors.lastname.message}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Username</label>
              <input
                className={`${styles.input} ${
                  errors.username ? styles.errorBorder : ""
                }`}
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && (
                <p className={styles.error}>{errors.username.message}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                className={`${styles.input} ${
                  errors.email ? styles.errorBorder : ""
                }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className={styles.error}>{errors.email.message}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Phone</label>
              <input
                className={`${styles.input} ${
                  errors.phone ? styles.errorBorder : ""
                }`}
                {...register("phone", { required: "Phone number is required" })}
              />
              {errors.phone && (
                <p className={styles.error}>{errors.phone.message}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Birthday</label>
              <input
                type="date"
                className={`${styles.input} ${
                  errors.birthday ? styles.errorBorder : ""
                }`}
                {...register("birthday")}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Gender</label>
              <select className={styles.input} {...register("gender")}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Bio</label>
              <textarea
                className={`${styles.input} ${
                  errors.bio ? styles.errorBorder : ""
                }`}
                {...register("bio")}
              />
            </div>

            <Button
              title="Save Changes"
              onClick={handleSubmit(onSubmitMainInfo)}
            />
          </form>
        </div>

        {/* Profile Completion Card */}
        <div className={`${styles.card} ${styles.profileCompletionCard}`}>
          <h3 className={styles.cardTitle}>Profile Completion</h3>
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBar} style={{ width: "70%" }}>
              70% Complete
            </div>
          </div>
          <Link href="/complete-profile">
            <button className={styles.button}>Complete Profile</button>
          </Link>{" "}
        </div>

        {/* Change Profile Image Card */}
        <div className={`${styles.card} ${styles.changeProfileImageCard}`}>
          <h3 className={styles.cardTitle}>Change Profile Image</h3>
          <form
            onSubmit={profileImageHandleSubmit(onSubmitProfileImage)}
            className={styles.profileImageContainer}
          >
            <img
              src={selectedImage}
              alt="Profile"
              className={styles.profileImage}
            />
            <label className={styles.editImageButton}>
              <input
                type="file"
                className={styles.fileInput}
                {...profileImageRegister("profileImage")}
                onChange={handleImageChange}
              />
              <span className={styles.editIcon}>✎</span>
            </label>

            <Button
              title="Update Image"
              onClick={profileImageHandleSubmit(onSubmitProfileImage)}
            />
          </form>
        </div>

        {/* Change Password Card */}
        <div className={`${styles.card} ${styles.changePasswordCard}`}>
          <h3 className={styles.cardTitle}>Change Password</h3>
          <form
            onSubmit={passwordHandleSubmit(onSubmitPassword)}
            className={styles.form}
          >
            <div className={styles.formGroup}>
              <label>New Password</label>
              <input
                className={`${styles.input} ${
                  passwordErros.password ? styles.errorBorder : ""
                }`}
                type="password"
                {...passwordRegister("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {passwordErros.password && (
                <p className={styles.error}>{passwordErros.password.message}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Confirm Password</label>
              <input
                className={`${styles.input} ${
                  passwordErros.confirmPassword ? styles.errorBorder : ""
                }`}
                type="password"
                {...passwordRegister("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === passwordWatch("password") ||
                    "Passwords do not match",
                })}
              />
              {passwordErros.confirmPassword && (
                <p className={styles.error}>
                  {passwordErros.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              title="Change Password"
              onClick={passwordHandleSubmit(onSubmitPassword)}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
