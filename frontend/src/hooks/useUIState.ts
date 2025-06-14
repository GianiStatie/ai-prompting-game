import { useState } from 'react';

export const useUIState = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const toggleRules = () => {
    setIsRulesOpen(!isRulesOpen);
  };

  return {
    isDrawerOpen,
    isRulesOpen,
    toggleDrawer,
    toggleRules
  };
}; 