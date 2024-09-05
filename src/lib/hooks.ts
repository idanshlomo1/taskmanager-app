import { useContext } from 'react';
import { GlobalContext, GlobalContextUpdate } from './globalContext'; // Adjust the path accordingly

export const useGlobalState = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalContextProvider');
  }
  return context;
};

export const useGlobalUpdate = () => {
  const context = useContext(GlobalContextUpdate);
  if (context === undefined) {
    throw new Error('useGlobalUpdate must be used within a GlobalContextProvider');
  }
  return context;
};
