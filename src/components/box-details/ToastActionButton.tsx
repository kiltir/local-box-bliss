
import React from 'react';
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";

interface ToastActionButtonProps {
  onClick: () => void;
}

const ToastActionButton = ({ onClick }: ToastActionButtonProps) => {
  return (
    <ToastAction altText="Changer" onClick={onClick}>
      Changer
    </ToastAction>
  );
};

export default ToastActionButton;
