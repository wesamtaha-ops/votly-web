'use client';

import Features from '../components/Home/Features';
import HowItWorks from '../components/Home/HowItWorks';
import Header from './../components/Header/Header';
import HeroBanner from './../components/HeroBanner/HeroBanner';
import InfoSection from './../components/InfoSection/InfoSection';
import FeaturesList from './../components/FeaturesList/FeaturesList';
import Footer from './../components/Footer/Footer';
import FAQ from './../components/FAQ/FAQ';

export default function Home() {
  return (
    <main>
      <Header />
      <HeroBanner />
      <Features />
      <HowItWorks />
      <InfoSection />
      <FAQ />
      <Footer />
    </main>
  );
}
