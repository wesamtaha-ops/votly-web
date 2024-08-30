import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Login from "../components/LoginForm/LoginForm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    return redirect("/");
  }

  return (
    <>
      <Header />
      <Login />
      <Footer />
    </>
  );
}
