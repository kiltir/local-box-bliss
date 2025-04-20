import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingBag } from "lucide-react";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return <nav className="bg-white border-b border-gray-200 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-leaf-green mr-2" />
              <span className="text-xl font-bold text-gray-900">Kiltirbox</span>
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#concept" className="text-gray-600 hover:text-leaf-green transition-colors">
              Concept
            </a>
            <a href="#boxes" className="text-gray-600 hover:text-leaf-green transition-colors">
              Nos Box
            </a>
            <a href="#producers" className="text-gray-600 hover:text-leaf-green transition-colors">Nos Partenaires</a>
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
        {isOpen && <div className="md:hidden mt-4 py-2 space-y-4">
            <a href="#concept" className="block text-gray-600 hover:text-leaf-green py-2 transition-colors" onClick={() => setIsOpen(false)}>
              Concept
            </a>
            <a href="#boxes" className="block text-gray-600 hover:text-leaf-green py-2 transition-colors" onClick={() => setIsOpen(false)}>
              Nos Box
            </a>
            <a href="#producers" className="block text-gray-600 hover:text-leaf-green py-2 transition-colors" onClick={() => setIsOpen(false)}>
              Producteurs
            </a>
            <Button className="w-full bg-leaf-green hover:bg-dark-green text-white">
              Commander
            </Button>
          </div>}
      </div>
    </nav>;
};
export default Navbar;