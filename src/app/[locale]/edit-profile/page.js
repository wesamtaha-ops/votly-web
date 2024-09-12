"use client";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import EditProfile from "../../components/EditProfile/EditProfile";
import { useSession } from "next-auth/react";

export default function EditProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const userToken = session?.id;

  return (
    <>
      <Header />
      <main className="main-content">
        <EditProfile
          user={session?.user ?? {}}
          userToken={userToken}
          updateSession={updateSession}
        />
      </main>
      <Footer />
    </>
  );
}
