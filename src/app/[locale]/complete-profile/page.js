"use client";

import react, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProfileCompletionForm from "../../components/CompleteProfile/ProfileCompletionForm";
import { callApi } from "../../helper";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function CompleteProfile() {
  const [profile, setProfile] = useState({});
  const { data: session, update: updateSession } = useSession();
  const userToken = session?.id;

  async function fetchProfile(userToken) {
    const res = await callApi({
      type: "get",
      url: "getProfile",
      userToken: userToken,
    });

    setProfile(res.data);
  }

  useEffect(() => {
    if (userToken) {
      fetchProfile(userToken);
    }
  }, [userToken]);

  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };

  const handleProfileSubmit = async (data) => {
    try {
      const response = await callApi({
        type: "post",
        url: "getProfile",
        data: data,
        userToken: userToken,
      });

      if (response.status != 200) {
        throw new Error("Failed to submit profile");
      }

      await updateSession({ user: response.data });
      reloadSession();

      toast("Profile completed successfully!");
    } catch (error) {
      console.error("Error submitting profile:", error);
      toast("There was an error completing your profile.");
    }
  };

  return (
    <>
      <Header />
      <main className="main-content">
        <ProfileCompletionForm
          profile={profile}
          onSubmit={handleProfileSubmit}
        />
      </main>
      <Footer />
    </>
  );
}
