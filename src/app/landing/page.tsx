'use client';

import FindBestClassSection from '@/components/landing/find-best-class-section/FindBestClassSection';
import CustomerReviewSection from '@/components/landing/customer-review-section/CustomerReviewSection';
import HeroSection from '@/components/landing/hero-section/HeroSection';
import FeatureCardSection from '@/components/landing/feature-card-section/FeatureCardSection';
import PopularClassSection from '@/components/landing/popular-class-section/PopularClassSection';
import FreeClassesSection from '@/components/landing/free-classes-section/FreeClassesSection';
import PopularSubjectSection from '@/components/landing/popular-subject-section/PopularSubjectSection';
import { NewsSection } from '@/components';

const LandingPage = () => {
  return (
    <>
      <HeroSection />
      <FeatureCardSection />
      <PopularClassSection />
      <FreeClassesSection />
      <PopularSubjectSection />
      <FindBestClassSection />
      <CustomerReviewSection />
      <NewsSection />
    </>
  );
};

export default LandingPage;
