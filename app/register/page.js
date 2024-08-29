import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import RegisterForm from '../components/RegisterForm/RegisterForm';

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main className='main-content'>
        <RegisterForm />
      </main>
      <Footer />
    </>
  );
}
