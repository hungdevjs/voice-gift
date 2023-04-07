const admin = require('firebase-admin');

const getAllFreeAssets = async () => {
  const backgroundSnapshot = await admin
    .firestore()
    .collection('free-backgrounds')
    .get();
  const musicSnapshot = await admin.firestore().collection('free-musics').get();

  const backgrounds = backgroundSnapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));

  const musics = musicSnapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));

  return { backgrounds, musics };
};

module.exports = { getAllFreeAssets };
