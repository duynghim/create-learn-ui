'use client';

import HeroSection from '@/app/components/landing/hero-section/HeroSection';
import FeatureCardSection from '@/app/components/landing/feature-card-section/FeatureCardSection';
import PopularClassSection from '@/app/components/landing/popular-class-section/PopularClassSection';
import FreeClassesSection from '@/app/components/landing/free-classes-section/FreeClassesSection';

const LandingPage = () => {
  return (
    <>
      <HeroSection />
      <FeatureCardSection />
      <PopularClassSection />
      <FreeClassesSection />
    </>
  );
};

export default LandingPage;
