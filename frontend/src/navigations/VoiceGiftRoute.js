import { Routes, Route, Navigate } from 'react-router-dom';

import VoiceGiftDetail from '../pages/VoiceGift/VoiceGiftDetail';

const VoiceGiftRoute = () => {
  return (
    <Routes>
      <Route path="/create" element={<VoiceGiftDetail />} />
      <Route path="/:id" element={<VoiceGiftDetail />} />
      <Route path="/*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default VoiceGiftRoute;
