'use client';

import Features from '../components/Home/Features';
import HowItWorks from '../components/Home/HowItWorks';
import HeroBanner from './../components/HeroBanner/HeroBanner';
import InfoSection from './../components/InfoSection/InfoSection';
import FeaturesList from './../components/FeaturesList/FeaturesList';
import FAQ from './../components/FAQ/FAQ';

export default function Home() {
  return (
    <main>
      <HeroBanner />
      <Features />
      <HowItWorks />
      <InfoSection />
      <FAQ />
    </main>
  );
}
