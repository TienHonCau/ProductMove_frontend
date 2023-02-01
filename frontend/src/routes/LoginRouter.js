import { Navigate, useRoutes } from 'react-router-dom';
// layouts

import LoginPage from '../pages/loginPage/LoginPage';



export default function LoginRouter() {
  const routes = useRoutes([
    {
      path: '/',
      element: <LoginPage />, index: true,
    }]);

  return routes;
}
