import { redirect } from "next/navigation"; // For redirection in app dir
import { getServerSession } from "next-auth/next"; // Import session handler
import { authOptions } from "../api/auth/[...nextauth]/route"; // Import your auth config
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import SurveysList from "../components/SurveysList/SurveysList";

export default async function SurveysPage() {
  const session = await getServerSession(authOptions);

  // Check if session exists and if the email is verified
  if (!session || session.user.is_email_verified !== 1) {
    redirect("/email-verification"); // Redirect to /email if email is not verified
  }

  if (!session || session.user.is_phone_verified !== 1) {
    redirect("/mobile-verification"); // Redirect to /phone if phone is not verified
  }

  return (
    <>
      <Header />
      <main className="main-content">
        <SurveysList />
      </main>
      <Footer />
    </>
  );
}
