import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import SurveysList from '../components/SurveysList/SurveysList';

export default function SurveysPage() {
  return (
    <>
      <Header />
      <main className='main-content'>
        <SurveysList />
      </main>
      <Footer />
    </>
  );
}
