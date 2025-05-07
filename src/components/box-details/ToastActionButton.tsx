
import React from 'react';
import { Button } from "@/components/ui/button";

interface ToastActionButtonProps {
  onClick: () => void;
}

const ToastActionButton = ({ onClick }: ToastActionButtonProps) => {
  return (
    <Button variant="outline" onClick={onClick}>
      Changer
    </Button>
  );
};

export default ToastActionButton;
