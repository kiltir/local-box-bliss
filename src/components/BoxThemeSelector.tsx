import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Compass, Wine, BookOpen, Leaf } from "lucide-react";

type BoxTheme = 'Découverte' | 'Bourbon' | 'Tradition' | 'Saison';

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
      value: 'Tradition', 
      label: 'Tradition', 
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
        <TabsList className="grid grid-cols-4 w-full">
          {themes.map((theme) => (
            <TabsTrigger key={theme.value} value={theme.value} className="flex items-center">
              {theme.icon}
              {theme.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      <div className="mt-4 text-center text-gray-600">
        <p>{themes.find(t => t.value === selectedTheme)?.description}</p>
      </div>
    </div>
  );
};

export default BoxThemeSelector;
