import { redirect } from "next/navigation"; // For redirection in app dir
import { getServerSession } from "next-auth/next"; // Import session handler
import { authOptions } from "../../api/auth/[...nextauth]/route"; // Import your auth config
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import SurveysList from "../../components/SurveysList/SurveysList";
import { redirectIfEmailPhoneNotVerified } from "../../helper";

export default async function SurveysPage() {
  const session = await getServerSession(authOptions);

  // Check if user is logged in
  if (!session?.id) {
    return redirect("/login");
  }

  // Check redirections for email/phone verification and profile completion
  const redirectResult = await redirectIfEmailPhoneNotVerified(session);

  if (redirectResult?.redirect) {
    return redirect(redirectResult.redirect);
  }

  return (
    <>
      <main className="main-content">
        <SurveysList />
      </main>
    </>
  );
}
