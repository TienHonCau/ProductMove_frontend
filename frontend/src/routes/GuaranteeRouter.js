import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import GuaranteeLayout from '../layouts/guarantee';
import SimpleLayout from '../layouts/simple';

// ----------------------------------------------------------------------



import DashboardAppPage from '../pages/guaranteePage/DashboardAppPage';
import InsurancePage from '../pages/guaranteePage/InsurancePage';
import ReceivePage from '../pages/guaranteePage/ReceivePage';

import Page404 from '../pages/Page404';

export default function GuaranteeRouter() {
  const routes = useRoutes([
    {
      path: '/guarantee',
      element: <GuaranteeLayout /> ,
      children: [
        { element: <Navigate to="/guarantee/dashboard" />, index: true },
        { path: 'dashboard', element: <DashboardAppPage /> },
        { path: 'receive', element: <ReceivePage /> },
        { path: 'insurancing', element: <InsurancePage /> },
        
      ],
      
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/guarantee/dashboard" />, index: true },
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
