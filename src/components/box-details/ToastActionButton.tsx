
import React from 'react';
import { ToastAction } from "@/components/ui/toast";

interface ToastActionButtonProps {
  onClick: () => void;
}

// This component is a wrapper around ToastAction to ensure compatibility
const ToastActionButton = React.forwardRef<HTMLButtonElement, ToastActionButtonProps>(
  ({ onClick }, ref) => {
    return (
      <ToastAction altText="Changer" onClick={onClick} ref={ref}>
        Changer
      </ToastAction>
    );
  }
);

ToastActionButton.displayName = 'ToastActionButton';

export default ToastActionButton;
