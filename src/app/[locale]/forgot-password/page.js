import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ForgotPassword from "../../components/ForgotPassword/ForgotPassword";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function ForgotPasswordPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    return redirect("/");
  }

  return (
    <>
      <Header />
      <main className="main-content">
        <ForgotPassword />
      </main>
      <Footer />
    </>
  );
}
