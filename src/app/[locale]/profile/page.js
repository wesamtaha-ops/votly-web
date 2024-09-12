"use client";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Profile from "../../components/Profile/Profile";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <>
      <Header />
      <main className="main-content">
        <Profile user={session?.user ?? {}} />
      </main>
      <Footer />
    </>
  );
}
