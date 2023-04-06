import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '../configs/firebase.config';

const useAccount = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsInitialized(true);
    });
  }, []);

  return { isInitialized, user };
};

export default useAccount;
