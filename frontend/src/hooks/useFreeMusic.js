import { useState, useEffect } from 'react';
import { query, collection, onSnapshot } from 'firebase/firestore';

import { firestore } from '../configs/firebase.config';

const useFreeMusic = () => {
  const [musics, setBackgrounds] = useState([]);

  useEffect(() => {
    const q = query(collection(firestore, 'free-musics'));

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
    musics,
  };
};

export default useFreeMusic;
