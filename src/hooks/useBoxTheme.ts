
import { useState } from 'react';
import { BoxTheme } from '@/types/box';

export const useBoxTheme = () => {
  const [selectedTheme, setSelectedTheme] = useState<BoxTheme>('Découverte');

  const handleThemeChange = (theme: BoxTheme) => {
    setSelectedTheme(theme);
  };

  return {
    selectedTheme,
    handleThemeChange,
  };
};
