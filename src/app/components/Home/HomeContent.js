'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Features from './Features';
import HowItWorks from './HowItWorks';
import HeroBanner from '../HeroBanner/HeroBanner';
import InfoSection from '../InfoSection/InfoSection';
import FAQ from '../FAQ/FAQ';

export default function HomeContent() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Check for inviter parameter in URL
    const inviterHash = searchParams.get('inviter');
    
    if (inviterHash) {
      // Store inviter hash in localStorage
      localStorage.setItem('inviterHash', inviterHash);
      
      // Optionally, you can remove the parameter from the URL
      const url = new URL(window.location.href);
      url.searchParams.delete('inviter');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

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

