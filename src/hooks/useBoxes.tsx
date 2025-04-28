
import { useState } from 'react';
import { boxes } from '@/data/boxesData';
import { useBoxTheme } from './useBoxTheme';
import { getBoxTitle, getBoxDetails } from '@/utils/boxUtils';
import { BoxData } from '@/types/boxes';

export const useBoxes = () => {
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const { selectedTheme, handleThemeChange } = useBoxTheme();

  const handleBoxClick = (id: number) => {
    setSelectedBox(id);
  };

  const handleCloseDetails = () => {
    setSelectedBox(null);
  };

  const handleBoxChange = (boxId: number) => {
    setSelectedBox(boxId);
  };

  const getSelectedBoxDetails = () => {
    if (selectedBox === null) return null;
    const box = boxes.find(box => box.id === selectedBox);
    return getBoxDetails(box, selectedTheme);
  };

  return {
    boxes,
    selectedBox,
    selectedTheme,
    handleBoxClick,
    handleCloseDetails,
    handleThemeChange,
    handleBoxChange,
    getSelectedBoxDetails,
    getBoxTitle: (box: BoxData) => getBoxTitle(box, selectedTheme),
  };
};
