import { HeroSection } from '@/app/components/hero-section';
import Image from 'next/image';
import React from 'react';

const LandingPage = () => {
  return (
    <main>
      <nav className="flex items-center justify-start py-4 px-12">
        <Image alt="Hero Image" src="/images/logo.png" width={329} height={152} className="w-32" />
      </nav>
      <HeroSection />
    </main>
  );
};

export default LandingPage;
