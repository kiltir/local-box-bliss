
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu, X, User, LogOut, Settings, Package, ShoppingCart } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Link, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleCartClick = () => {
    navigate('/mes-commandes');
  };

  const menuItems = [
    { href: '/notre-histoire', label: 'Notre Histoire' },
    { href: '/nos-engagements', label: 'Nos Engagements' },
    { href: '/nous-contacter', label: 'Nous Contacter' },
    { href: '/faq', label: 'FAQ' },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <ShoppingBag className="h-8 w-8 text-leaf-green" />
            <span className="font-bold text-xl text-yellow-400">KiltirBox</span>
          </Link>

          {/* Menu desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-gray-700 hover:text-leaf-green transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
            
            <div className="flex items-center space-x-4">
              {/* Panier */}
              <Button variant="ghost" className="relative" onClick={handleCartClick}>
                <ShoppingCart className="h-5 w-5 text-gray-700" />
                {/* Badge pour le nombre d'articles */}
                <span className="absolute -top-1 -right-1 bg-leaf-green text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Mon compte</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to="/mes-informations" className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Mes informations
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/mes-commandes" className="flex items-center">
                        <Package className="h-4 w-4 mr-2" />
                        Mes commandes
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Se déconnecter
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button className="bg-leaf-green hover:bg-dark-green text-white">
                    Se connecter
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Menu mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-leaf-green"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Menu mobile ouvert */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-leaf-green transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Panier mobile */}
              <div className="px-3 py-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start relative"
                  onClick={() => {
                    handleCartClick();
                    setIsOpen(false);
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Mon panier
                  <span className="absolute right-3 bg-leaf-green text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                </Button>
              </div>
              
              {user ? (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-sm font-medium text-gray-500">Mon compte</div>
                  <Link
                    to="/mes-informations"
                    className="block px-6 py-2 text-gray-700 hover:text-leaf-green transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="h-4 w-4 inline mr-2" />
                    Mes informations
                  </Link>
                  <Link
                    to="/mes-commandes"
                    className="block px-6 py-2 text-gray-700 hover:text-leaf-green transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <Package className="h-4 w-4 inline mr-2" />
                    Mes commandes
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-6 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4 inline mr-2" />
                    Se déconnecter
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="block px-3 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Button className="w-full bg-leaf-green hover:bg-dark-green text-white">
                    Se connecter
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
