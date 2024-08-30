import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import OtpVerification from '../components/OtpVerification/OtpVerification';

export default function MobileVerificationPage() {
  return (
    <>
      <Header />
      <OtpVerification contactInfo='+971555076146' />
      <Footer />
    </>
  );
}
