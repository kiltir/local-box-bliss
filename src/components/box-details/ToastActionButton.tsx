
import React from 'react';
import { ToastAction } from "@/components/ui/toast";

interface ToastActionButtonProps {
  onClick: () => void;
}

// This component needs to be compatible with ToastActionElement
const ToastActionButton = ({ onClick }: ToastActionButtonProps) => {
  return (
    <ToastAction altText="Changer" onClick={onClick}>
      Changer
    </ToastAction>
  );
};

export default ToastActionButton;
