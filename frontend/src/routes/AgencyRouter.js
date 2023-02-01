import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import AgencyLayout from '../layouts/agency';
import SimpleLayout from '../layouts/simple';

// ----------------------------------------------------------------------

import ProductPage from '../pages/agencyPage/ProductPage';
import LoginPage from '../pages/loginPage/LoginPage';
import Page404 from '../pages/Page404';
import SellPage from '../pages/agencyPage/SellPage';
import DashboardAppPage from '../pages/agencyPage/DashboardAppPage';
import ImportPage from '../pages/agencyPage/ImportPage';
import BillPage from '../pages/agencyPage/BillPage';
import ProductCustomerPage from '../pages/agencyPage/ProductCustomerPage';
import ProductInsurancePage from '../pages/agencyPage/ProductInsurancePage';

export default function AgencyRouter() {
  const routes = useRoutes([
    {
      path: '/agency',
      element: <AgencyLayout />,
      children: [
        { element: <Navigate to="/agency/dashboard" />, index: true },
        { path: 'dashboard', element: <DashboardAppPage /> },
        { path: 'product', element: <ProductPage /> },
        { path: 'sell', element: <SellPage /> },
        {path: 'import', element: <ImportPage/>},
        {path: 'bill', element: <BillPage/>},
        {path: 'product-customers', element: <ProductCustomerPage/> },
        {path: 'product-insurance', element: <ProductInsurancePage/>}

      ],
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/agency/dashboard" />, index: true },
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
