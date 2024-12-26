import React, { createContext, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const navigation = useNavigation();

  return (
    <NavigationContext.Provider value={navigation}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationContext = () => {
  return useContext(NavigationContext);
};