import { Routes, Route, Navigate } from 'react-router-dom';

import VoiceGiftDetail from '../pages/VoiceGift/VoiceGiftDetail';
import QRCode from '../pages/VoiceGift/QRCode';
import VoiceGiftPlayer from '../pages/VoiceGift/VoiceGiftPlayer';

const VoiceGiftRoute = () => {
  return (
    <Routes>
      <Route path="/create" element={<VoiceGiftDetail />} />
      <Route path="/:id/qr" element={<QRCode />} />
      <Route path="/:id" element={<VoiceGiftPlayer />} />
      <Route path="/*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default VoiceGiftRoute;
