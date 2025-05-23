import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import OtpVerification from '../../components/OtpVerification/OtpVerification';
import { redirect } from 'next/navigation'; // For redirection in app dir
import { getServerSession } from 'next-auth/next'; // Import session handler
import { authOptions } from '../../api/auth/[...nextauth]/route'; // Import your auth config

export default async function MobileVerificationPage() {
  const session = await getServerSession(authOptions);

  if (!session?.id) {
    return redirect('/');
  }

  return (
    <>
      <div
        style={{
          marginTop: '50px',
          lineHeight: '40px',
        }}></div>
      <OtpVerification contactInfo={session?.user?.phone} type='mobile' />
    </>
  );
}
