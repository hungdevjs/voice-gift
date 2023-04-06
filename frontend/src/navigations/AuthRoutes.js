import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/Authentication/Login';
import CreateAccount from '../pages/Authentication/CreateAccount';
import ForgotPassword from '../pages/Authentication/ForgotPassword';
import Home from '../pages/Home';
import VoiceGiftRoute from './VoiceGiftRoute';

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/voice-gifts/*" element={<VoiceGiftRoute />} />
      <Route path="/" element={<Home />} />
      <Route path="/*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default MainRoutes;
