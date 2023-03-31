import {
  create as createVoiceGift,
  get as getVoiceGift,
} from './firebase.service';

export const create = (data) => createVoiceGift(data);

export const get = (id) => getVoiceGift({ id });
