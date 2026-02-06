
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HeroDescription from '@/components/HeroDescription';
import FeaturesSection from '@/components/FeaturesSection';
import BoxesSection from '@/components/BoxesSection';
import ProducerSection from '@/components/ProducerSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Gérer la navigation avec hash
    if (location.hash) {
      const sectionId = location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="KiltirBox - Box de produits réunionnais authentiques | Découvrez La Réunion"
        description="Découvrez les saveurs authentiques de La Réunion avec KiltirBox. Box mensuelles de produits locaux réunionnais : épices, confitures, rhums arrangés et spécialités artisanales. Livraison en France métropolitaine."
        keywords="box réunionnaise, produits réunionnais, épices réunion, rhum arrangé, vanille bourbon, La Réunion, box cadeau, produits locaux"
        canonicalPath="/"
      />
      <Navbar />
      <main>
        <Hero />
        <HeroDescription />
        <FeaturesSection />
        <BoxesSection />
        <ProducerSection />
        <TestimonialsSection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
