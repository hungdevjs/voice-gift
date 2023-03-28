import { Routes, Route } from 'react-router-dom';

import HomeRoute from './HomeRoute';
import VoiceGiftRoute from './VoiceGiftRoute';

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/voice-gifts/*" element={<VoiceGiftRoute />} />
      <Route path="/*" element={<HomeRoute />} />
    </Routes>
  );
};

export default MainRoutes;
