import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirectIfEmailPhoneNotVerified } from "../../helper";
import InviteFriends from "../../components/InviteFriends/InviteFriends";

export default async function InviteFriendsPage() {
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
        <InviteFriends />
      </main>
    </>
  );
} 