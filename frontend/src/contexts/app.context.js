import { createContext } from 'react';

import useAccount from '../hooks/useAccount';
import useFreeBackground from '../hooks/useFreeBackground';
import useFreeMusic from '../hooks/useFreeMusic';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const accountState = useAccount();
  const freeBackgroundState = useFreeBackground();
  const freeMusicState = useFreeMusic();

  return (
    <AppContext.Provider
      value={{
        accountState,
        freeBackgroundState,
        freeMusicState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
