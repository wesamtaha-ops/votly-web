import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ForgotPassword from '../components/ForgotPassword/ForgotPassword';

export default function ForgotPasswordPage() {
  return (
    <>
      <Header />
      <main className='main-content'>
        <ForgotPassword />
      </main>
      <Footer />
    </>
  );
}
