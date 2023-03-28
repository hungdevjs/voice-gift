import { useState, useEffect } from 'react';
import { query, collection, onSnapshot } from 'firebase/firestore';

import { firestore } from '../configs/firebase.config';

const useFreeBackground = () => {
  const [backgrounds, setBackgrounds] = useState([]);

  useEffect(() => {
    const q = query(collection(firestore, 'free-backgrounds'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBackgrounds(docs);
    });

    return unsubscribe;
  }, []);

  return {
    backgrounds,
  };
};

export default useFreeBackground;
