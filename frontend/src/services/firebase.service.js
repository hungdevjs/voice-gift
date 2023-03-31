import { httpsCallable } from 'firebase/functions';
import { ref, uploadBytes } from 'firebase/storage';
import { functions, storage } from '../configs/firebase.config';

export const uploadFile = async (file) => {
  const storageRef = `temp/${Math.random()}`;
  const fileRef = ref(storage, storageRef);
  await uploadBytes(fileRef, file, { contentType: file.type });
  return storageRef;
};

export const create = httpsCallable(functions, 'create');
export const get = httpsCallable(functions, 'get');
