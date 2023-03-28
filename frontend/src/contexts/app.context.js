import { createContext } from 'react';

import useFreeBackground from '../hooks/useFreeBackground';
import useFreeMusic from '../hooks/useFreeMusic';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const freeBackgroundState = useFreeBackground();
  const freeMusicState = useFreeMusic();

  return (
    <AppContext.Provider
      value={{
        freeBackgroundState,
        freeMusicState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
