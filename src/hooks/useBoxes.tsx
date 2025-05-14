
import { useState } from 'react';
import { boxes } from '@/data/boxes';
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

  const getSelectedBoxDetails = (boxId?: number) => {
    const id = boxId !== undefined ? boxId : selectedBox;
    if (id === null) return null;
    const box = boxes.find(box => box.id === id);
    if (!box) return null;
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
