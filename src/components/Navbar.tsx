
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (section: string) => {
    if (window.location.pathname !== '/') {
      // Si on n'est pas sur la page d'accueil, naviguer vers la page d'accueil puis vers la section
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(section.replace('#', ''));
        if (element) {
          // Scroll avec un offset pour s'assurer que le titre est bien visible
          const headerHeight = 80; // Hauteur approximative du header sticky
          const elementTop = element.offsetTop - headerHeight;
          window.scrollTo({ 
            top: elementTop, 
            behavior: 'smooth' 
          });
        }
      }, 100);
    } else {
      // Si on est déjà sur la page d'accueil, juste scroller vers la section
      const element = document.getElementById(section.replace('#', ''));
      if (element) {
        // Scroll avec un offset pour s'assurer que le titre est bien visible
        const headerHeight = 80; // Hauteur approximative du header sticky
        const elementTop = element.offsetTop - headerHeight;
        window.scrollTo({ 
          top: elementTop, 
          behavior: 'smooth' 
        });
      }
    }
    setIsOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <img 
                src="/lovable-uploads/3f05a8b0-01b9-4e90-a92c-901b9d59163a.png" 
                alt="KiltirBox Logo" 
                className="h-12 w-auto"
              />
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNavigation('concept')} 
              className="text-gray-600 hover:text-leaf-green transition-colors cursor-pointer"
            >
              Mode d'emploi
            </button>
            <button 
              onClick={() => handleNavigation('boxes')} 
              className="text-gray-600 hover:text-leaf-green transition-colors cursor-pointer"
            >
              Nos Box
            </button>
            <button 
              onClick={() => handleNavigation('producers')} 
              className="text-gray-600 hover:text-leaf-green transition-colors cursor-pointer"
            >
              Nos Partenaires
            </button>
            <a href="/notre-histoire" className="text-gray-600 hover:text-leaf-green transition-colors">Notre Histoire</a>
            <Button className="bg-leaf-green hover:bg-dark-green text-white">
              Commander
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 py-2 space-y-4">
            <button 
              onClick={() => handleNavigation('concept')} 
              className="block text-gray-600 hover:text-leaf-green py-2 transition-colors text-left w-full"
            >
              Mode d'emploi
            </button>
            <button 
              onClick={() => handleNavigation('boxes')} 
              className="block text-gray-600 hover:text-leaf-green py-2 transition-colors text-left w-full"
            >
              Nos Box
            </button>
            <button 
              onClick={() => handleNavigation('producers')} 
              className="block text-gray-600 hover:text-leaf-green py-2 transition-colors text-left w-full"
            >
              Nos Partenaires
            </button>
            <a href="/notre-histoire" className="block text-gray-600 hover:text-leaf-green py-2 transition-colors" onClick={() => setIsOpen(false)}>
              Notre Histoire
            </a>
            <Button className="w-full bg-leaf-green hover:bg-dark-green text-white">
              Commander
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
