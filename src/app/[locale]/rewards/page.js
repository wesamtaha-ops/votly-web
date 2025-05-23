import { redirect } from "next/navigation"; // For redirection in app dir
import { getServerSession } from "next-auth/next"; // Import session handler
import { authOptions } from "../../api/auth/[...nextauth]/route"; // Import your auth config
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Rewards from "../../components/Rewards/Rewards";
import { redirectIfEmailPhoneNotVerified } from "../../helper";

export default async function RewardsPage() {
  const session = await getServerSession(authOptions);

  // Check redirections
  const redirectResult = await redirectIfEmailPhoneNotVerified(session);

  if (redirectResult?.redirect) {
    return redirect(redirectResult.redirect);
  }

  return (
    <>
      <main className="main-content">
        <Rewards />
      </main>
    </>
  );
}
