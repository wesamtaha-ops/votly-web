import About from '../../components/About/About';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

export default function AboutPage() {
  return (
    <>
      <main className='main-content'>
        <About />
      </main>
    </>
  );
}

// Generate metadata for the page
export const metadata = {
  title: 'About Us | Votly',
  description:
    'Learn about Votly - Empowering Voices, Rewarding Insights. Join our community of survey takers and earn rewards while sharing your valuable opinions.',
  keywords: 'Votly, surveys, rewards, community, insights, opinions',
};
