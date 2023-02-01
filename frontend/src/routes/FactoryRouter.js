import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import FactoryLayout from '../layouts/factory';
import SimpleLayout from '../layouts/simple';

// ----------------------------------------------------------------------

import ProductPage from '../pages/factoryPage/ProductPage';
import LoginPage from '../pages/loginPage/LoginPage';
import Page404 from '../pages/Page404';
import ExportPage from '../pages/factoryPage/ExportPage';
import DashboardAppPage from '../pages/factoryPage/DashboardAppPage';
import TransportPage from '../pages/factoryPage/TransportPage';
import ProductErrorPage from '../pages/factoryPage/ProductErrorPage';

export default function FactoryRouter() {
  const routes = useRoutes([
    {
      path: '/factory',
      element: <FactoryLayout />,
      children: [
        { element: <Navigate to="/factory/dashboard" />, index: true },
        { path: 'dashboard', element: <DashboardAppPage /> },
        { path: 'user', element: <ProductPage /> },
        { path: 'export', element: <ExportPage /> },
        { path: 'transport', element: <TransportPage /> },
        { path: 'error', element: <ProductErrorPage /> }

      ],
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/factory/dashboard" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
