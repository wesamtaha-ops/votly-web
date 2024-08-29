import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Rewards from '../components/Rewards/Rewards';

export default function RewardsPage() {
  return (
    <>
      <Header />
      <main className='main-content'>
        <Rewards />
      </main>
      <Footer />
    </>
  );
}
