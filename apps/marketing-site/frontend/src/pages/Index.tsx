
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import UrgencyBanner from '@/components/UrgencyBanner';
import ProblemsSolved from '@/components/ProblemsSolved';
import Features from '@/components/Features';
import BeforeAfter from '@/components/BeforeAfter';
import Benefits from '@/components/Benefits';
import Integrations from '@/components/Integrations';
import CommerceTechVisual from '@/components/CommerceTechVisual';
import EndToEndFlow from '@/components/EndToEndFlow';
import About from '@/components/About';
import FAQ from '@/components/FAQ';
import CTA from '@/components/cta';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header setIsSidebarOpen={() => {}} />
      <main className="flex-1">
        <Hero />
        <UrgencyBanner />
        <ProblemsSolved />
        <Features />
        <BeforeAfter />
        <Benefits />
        <Integrations />
        <CommerceTechVisual />
        <EndToEndFlow />
        <About />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
