import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import CartIcon from './CartIcon';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    signOut,
    loading
  } = useAuth();
  const handleNavigation = (section: string) => {
    const sectionId = section.replace('#', '');

    // Fermer le menu mobile immédiatement
    setIsOpen(false);
    if (location.pathname !== '/') {
      // Si on n'est pas sur la page d'accueil, naviguer avec hash
      navigate(`/#${sectionId}`);
    } else {
      // Si on est déjà sur la page d'accueil, scroller directement après un délai
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 250);
    }
  };
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Helper function to get display name for the user
  const getUserDisplayName = () => {
    if (!user) return '';

    // Priority: username > full_name > email
    const username = user.user_metadata?.username;
    const fullName = user.user_metadata?.full_name;
    return username || fullName || user.email || '';
  };
  return <nav className="bg-white border-b border-gray-200 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <img src="/lovable-uploads/63cc4716-b9b9-4651-9eb6-6555818994a6.png" alt="KiltirBox" className="h-12 mr-2" />
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => handleNavigation('concept')} className="text-gray-600 hover:text-leaf-green transition-colors cursor-pointer">
              Mode d'emploi
            </button>
            <button onClick={() => handleNavigation('boxes')} className="text-gray-600 hover:text-leaf-green transition-colors cursor-pointer">
              Nos Box
            </button>
            <button onClick={() => handleNavigation('producers')} className="text-gray-600 hover:text-leaf-green transition-colors cursor-pointer">
              Nos Partenaires
            </button>
            <a href="/notre-histoire" className="text-gray-600 hover:text-leaf-green transition-colors">Notre Histoire</a>
            
            {/* Cart Icon */}
            <CartIcon />
            
            {/* Auth Section */}
            {loading ? <div className="w-24 h-10 bg-gray-200 animate-pulse rounded"></div> : user ? <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{getUserDisplayName()}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="font-medium">
                    {user.user_metadata?.full_name || user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/mes-informations')}>
                    Mes informations
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/mes-commandes')}>
                    Mes commandes
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> : <Button className="bg-leaf-green hover:bg-dark-green text-white" onClick={() => navigate('/auth')}>
                Se connecter
              </Button>}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <CartIcon />
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isOpen && <div className="md:hidden mt-4 py-2 space-y-4">
            <button onClick={() => handleNavigation('concept')} className="block text-gray-600 hover:text-leaf-green py-2 transition-colors text-left w-full">
              Mode d'emploi
            </button>
            <button onClick={() => handleNavigation('boxes')} className="block text-gray-600 hover:text-leaf-green py-2 transition-colors text-left w-full">
              Nos Box
            </button>
            <button onClick={() => handleNavigation('producers')} className="block text-gray-600 hover:text-leaf-green py-2 transition-colors text-left w-full">
              Nos Partenaires
            </button>
            <a href="/notre-histoire" className="block text-gray-600 hover:text-leaf-green py-2 transition-colors" onClick={() => setIsOpen(false)}>
              Notre Histoire
            </a>
            
            {/* Mobile Auth Section */}
            {!loading && (user ? <div className="space-y-2 pt-2 border-t border-gray-200">
                  <div className="text-sm text-gray-500 py-2">
                    {getUserDisplayName()}
                  </div>
                  <Button variant="outline" className="w-full justify-start" onClick={() => {
            navigate('/mes-informations');
            setIsOpen(false);
          }}>
                    Mes informations
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => {
            navigate('/mes-commandes');
            setIsOpen(false);
          }}>
                    Mes commandes
                  </Button>
                  <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 justify-start" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </Button>
                </div> : <Button className="w-full bg-leaf-green hover:bg-dark-green text-white" onClick={() => {
          navigate('/auth');
          setIsOpen(false);
        }}>
                  Se connecter
                </Button>)}
          </div>}
      </div>
    </nav>;
};
export default Navbar;