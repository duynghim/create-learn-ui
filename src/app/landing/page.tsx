'use client';

import HeroSection from '@/app/components/landing/hero-section/HeroSection';
import FeatureCardSection from '@/app/components/landing/feature-card-section/FeatureCardSection';
import PopularClassSection from '@/app/components/landing/popular-class-section/PopularClassSection';

const LandingPage = () => {
  return (
    <>
      <HeroSection />
      <FeatureCardSection />
      <PopularClassSection />
    </>
  );
};

export default LandingPage;
