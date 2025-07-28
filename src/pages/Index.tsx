
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturesSection from '@/components/FeaturesSection';
import BoxesSection from '@/components/BoxesSection';
import ProducerSection from '@/components/ProducerSection';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <Hero />
        <FeaturesSection />
        <BoxesSection />
        <ProducerSection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
