import * as service from '../services/voiceGift.service.js';

export const create = async (req, res) => {
  try {
    const { avatar, record } = req.files;
    const data = {
      avatar: avatar?.[0],
      record: record?.[0],
      ...req.body,
    };
    const id = await service.create(data);
    return res.status(201).send(id);
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

export const get = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await service.get(id);
    return res.status(200).send(result);
  } catch (err) {
    return res.status(400).send(err.message);
  }
};
