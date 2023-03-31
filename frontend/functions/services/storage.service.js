const admin = require('firebase-admin');
const getRawBody = require('raw-body');

const { uploadFile } = require('./telegram.service');

const getBufferFirebaseStorageFile = async (path) => {
  const bucket = admin.storage().bucket();
  const file = await bucket.file(path);
  const buffer = await getRawBody(file.createReadStream());
  return buffer;
};

const removeFile = async (path) => {
  const bucket = admin.storage().bucket();
  const file = await bucket.file(path);
  const exist = await file.exists();
  if (exist) {
    await file.delete();
  }
};

const filePathToTelegramFileId = async (path, type = '') => {
  const buffer = await getBufferFirebaseStorageFile(path);
  const fileId = await uploadFile({ buffer, fileName: `firebase-file${type}` });
  removeFile(path);
  return fileId;
};

module.exports = {
  getBufferFirebaseStorageFile,
  filePathToTelegramFileId,
};
