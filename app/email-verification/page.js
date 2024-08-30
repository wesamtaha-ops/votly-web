import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import OtpVerification from '../components/OtpVerification/OtpVerification';

export default function EmailVerificationPage() {
  return (
    <>
      <Header />
      <OtpVerification contactInfo='user@example.com' />
      <Footer />
    </>
  );
}
