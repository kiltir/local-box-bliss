
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Compass, Wine, BookOpen, Leaf } from "lucide-react";

type BoxTheme = 'Découverte' | 'Bourbon' | 'Racine' | 'Saison';

interface BoxThemeSelectorProps {
  selectedTheme: BoxTheme;
  onThemeChange: (theme: BoxTheme) => void;
}

const BoxThemeSelector: React.FC<BoxThemeSelectorProps> = ({ selectedTheme, onThemeChange }) => {
  const themes: { value: BoxTheme; label: string; icon: React.ReactNode; description: string }[] = [
    { 
      value: 'Découverte', 
      label: 'Découverte', 
      icon: <Compass className="h-4 w-4 mr-2" />,
      description: 'De nouvelles saveurs à découvrir'
    },
    { 
      value: 'Bourbon', 
      label: 'Bourbon', 
      icon: <Wine className="h-4 w-4 mr-2" />,
      description: 'Des produits avec un caractère et une identité'
    },
    { 
      value: 'Racine', 
      label: 'Racine', 
      icon: <BookOpen className="h-4 w-4 mr-2" />,
      description: 'Des produits authentiques et traditionnels'
    },
    { 
      value: 'Saison', 
      label: 'Saison', 
      icon: <Leaf className="h-4 w-4 mr-2" />,
      description: 'Produits frais selon la saison'
    }
  ];

  return (
    <div className="w-full max-w-3xl">
      <Tabs value={selectedTheme} onValueChange={(value) => onThemeChange(value as BoxTheme)} className="w-full">
        <TabsList className="grid grid-cols-4 w-full h-14 bg-white/80 border border-border shadow-md rounded-xl p-1">
          {themes.map((theme) => (
            <TabsTrigger 
              key={theme.value} 
              value={theme.value} 
              className="flex items-center justify-center h-12 font-semibold text-sm transition-all duration-300 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:scale-105 hover:bg-accent/50 hover:text-accent-foreground border-2 border-transparent data-[state=active]:border-primary/20"
            >
              {theme.icon}
              <span className="hidden sm:inline">{theme.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      <div className="mt-4 text-center text-gray-600">
        <p className="font-medium">{themes.find(t => t.value === selectedTheme)?.description}</p>
      </div>
    </div>
  );
};

export default BoxThemeSelector;
