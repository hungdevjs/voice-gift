import AuthRoutes from './AuthRoutes';
import MainRoutes from './MainRoutes';

import useAppContext from '../hooks/useAppContext';

const Navigations = () => {
  const {
    accountState: { isInitialized, user },
  } = useAppContext();

  if (!isInitialized) return null;

  if (!user) return <AuthRoutes />;

  return <MainRoutes />;
};

export default Navigations;
