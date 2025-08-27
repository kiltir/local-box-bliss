import React from 'react';
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - 80; // Offset for sticky navbar
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navigateToPage = (path: string) => {
    navigate(path);
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const navigateToNotreHistoire = () => {
    navigate('/notre-histoire');
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const navigateToHomeAndScrollToFeatures = () => {
    // If we're already on the home page, just scroll to features
    if (window.location.pathname === '/') {
      scrollToSection('features-title');
    } else {
      // Navigate to home page first, then scroll to features
      navigate('/');
      setTimeout(() => {
        scrollToSection('features-title');
      }, 100);
    }
  };

  const navigateToHomeAndScrollToProducers = () => {
    // If we're already on the home page, just scroll to producers
    if (window.location.pathname === '/') {
      scrollToSection('producers-title');
    } else {
      // Navigate to home page first, then scroll to producers
      navigate('/');
      setTimeout(() => {
        scrollToSection('producers-title');
      }, 100);
    }
  };

  return <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <img 
                src="/lovable-uploads/7c19f3c6-7125-4ece-9178-6303bd05efb7.png" 
                alt="KiltirBox" 
                className="h-8 w-8 mr-2" 
              />
              <span className="text-xl font-bold text-yellow-400">KiltirBox</span>
            </div>
            <p className="text-gray-400 mb-4">Des box réunissant un savoir-faire, des traditions et la culture réunionnaise.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Informations</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={navigateToNotreHistoire}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Notre Histoire
                </button>
              </li>
              <li>
                <button 
                  onClick={navigateToHomeAndScrollToFeatures}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Comment ça marche
                </button>
              </li>
              <li>
                <button 
                  onClick={navigateToHomeAndScrollToProducers}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Nos Partenaires
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateToPage('/nos-engagements')}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Nos engagements
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Service Client</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => navigateToPage('/nous-contacter')}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Nous contacter
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateToPage('/faq')}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateToPage('/conditions-generales')}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Conditions générales
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateToPage('/politique-confidentialite')}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Politique de confidentialité
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Inscrivez-vous pour recevoir nos offres et actualités.
            </p>
            <form>
              <div className="flex mb-2">
                <input type="email" placeholder="Votre email" className="bg-gray-800 text-white px-4 py-2 rounded-l-lg w-full focus:outline-none" />
                <button type="submit" className="bg-leaf-green hover:bg-dark-green text-white px-4 rounded-r-lg">
                  OK
                </button>
              </div>
              <div className="text-xs text-gray-500">
                En vous inscrivant, vous acceptez notre politique de confidentialité.
              </div>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} LocalBox - Tous droits réservés
          </p>
        </div>
      </div>
    </footer>;
};

export default Footer;
