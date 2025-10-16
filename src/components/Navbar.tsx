import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import CartIcon from './CartIcon';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { siteConfig } from "@/config/site";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    signOut,
    loading
  } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
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

    // Priority: profile.username > profile.full_name > user.email
    return profile?.username || profile?.full_name || user.email || '';
  };
  return <nav className="bg-background/80 backdrop-blur-md border-b border-border/50 py-3 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="flex items-center transition-transform hover:scale-105 duration-300">
              <img src="/lovable-uploads/cdff195d-0b44-4736-b58c-90f79b339022.png" alt={siteConfig.brandName} className="h-12 mr-2" />
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => handleNavigation('concept')} className="text-foreground/70 hover:text-primary transition-all duration-300 cursor-pointer font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
              Mode d'emploi
            </button>
            <button onClick={() => handleNavigation('boxes')} className="text-foreground/70 hover:text-primary transition-all duration-300 cursor-pointer font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
              Nos Box
            </button>
            <button onClick={() => handleNavigation('producers')} className="text-foreground/70 hover:text-primary transition-all duration-300 cursor-pointer font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
              Nos Partenaires
            </button>
            <a href="/notre-histoire" className="text-foreground/70 hover:text-primary transition-all duration-300 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Notre Histoire</a>
            
            {/* Cart Icon */}
            <CartIcon />
            
            {/* Auth Section */}
            {loading || profileLoading ? <div className="w-24 h-10 bg-muted animate-pulse rounded-lg"></div> : user ? <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2 border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{getUserDisplayName()}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="font-medium">
                    {getUserDisplayName()}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/mes-informations')}>
                    Mes informations
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/mes-commandes')}>
                    Mes commandes
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive hover:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> : <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105" onClick={() => navigate('/auth')}>
                Se connecter
              </Button>}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <CartIcon />
            <button onClick={() => setIsOpen(!isOpen)} className="text-foreground/70 hover:text-primary focus:outline-none transition-colors duration-300">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isOpen && <div className="md:hidden mt-4 py-4 space-y-2 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
            <button onClick={() => handleNavigation('concept')} className="block text-foreground/70 hover:text-primary hover:bg-primary/5 py-3 px-4 transition-all duration-300 text-left w-full rounded-md font-medium">
              Mode d'emploi
            </button>
            <button onClick={() => handleNavigation('boxes')} className="block text-foreground/70 hover:text-primary hover:bg-primary/5 py-3 px-4 transition-all duration-300 text-left w-full rounded-md font-medium">
              Nos Box
            </button>
            <button onClick={() => handleNavigation('producers')} className="block text-foreground/70 hover:text-primary hover:bg-primary/5 py-3 px-4 transition-all duration-300 text-left w-full rounded-md font-medium">
              Nos Partenaires
            </button>
            <a href="/notre-histoire" className="block text-foreground/70 hover:text-primary hover:bg-primary/5 py-3 px-4 transition-all duration-300 rounded-md font-medium" onClick={() => setIsOpen(false)}>
              Notre Histoire
            </a>
            
            {/* Mobile Auth Section */}
            {!loading && !profileLoading && (user ? <div className="space-y-2 pt-4 mt-2 border-t border-border/50">
                  <div className="text-sm text-muted-foreground py-2 px-4 font-medium">
                    {getUserDisplayName()}
                  </div>
                  <Button variant="outline" className="w-full justify-start hover:bg-primary/5 hover:border-primary/50 transition-all duration-300" onClick={() => {
            navigate('/mes-informations');
            setIsOpen(false);
          }}>
                    Mes informations
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-primary/5 hover:border-primary/50 transition-all duration-300" onClick={() => {
            navigate('/mes-commandes');
            setIsOpen(false);
          }}>
                    Mes commandes
                  </Button>
                  <Button variant="outline" className="w-full text-destructive border-destructive/20 hover:bg-destructive/5 hover:border-destructive/50 justify-start transition-all duration-300" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </Button>
                </div> : <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300" onClick={() => {
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