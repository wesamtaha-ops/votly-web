import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import OtpVerification from '../components/OtpVerification/OtpVerification';
import { redirect } from 'next/navigation'; // For redirection in app dir
import { getServerSession } from 'next-auth/next'; // Import session handler
import { authOptions } from '../api/auth/[...nextauth]/route'; // Import your auth config

export default async function EmailVerificationPage() {
  const session = await getServerSession(authOptions);

  if (!session?.id) {
    return redirect('/');
  }

  return (
    <>
      <Header />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px',
          backgroundColor: '#f9f9f9',
          borderRadius: '10px',
          marginTop: '100px',
          lineHeight: '40px',
          marginBottom: 0,
        }}>
        <h1>Email Verification</h1>
        <p>
          Please enter the OTP sent to your email address to verify your
          account.
        </p>
      </div>
      <OtpVerification contactInfo={session?.user?.email} type='email' />
      <Footer />
    </>
  );
}
