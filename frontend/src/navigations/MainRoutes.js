import { Routes, Route } from 'react-router-dom';

import HomeRoute from './HomeRoute';

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/*" element={<HomeRoute />} />
    </Routes>
  );
};

export default MainRoutes;
