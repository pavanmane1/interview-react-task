
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import PrivateRoute from '../PrivateRoutes/privateRoute';
import PublicRoute from '../publicRoutes/PublicRoutes';
const Layout = lazy(() => import('../../component/Layout'));
const Dashboard = lazy(() => import('../../pages/Dashboard'));
const Stepperform = lazy(() => import('../../pages/Stepperform'));
const List = lazy(() => import('../../pages/List'));
const Addproduct = lazy(() => import('../../pages/sales/Addproduct'));
const ListProduct = lazy(() => import('../../pages/sales/Listproduct'));
const Login = lazy(() => import('../../pages/Login'));
const routes = [
    {
        path: '/',
        element: <Layout />,
        children: [
            { path: '/', element: <PublicRoute element={<Login />} /> },
            { path: '/dashboard', element: <PrivateRoute element={<Dashboard />} /> },
            { path: '/Stepperform', element: <PrivateRoute element={<Stepperform />} /> },
            { path: '/List', element: <PrivateRoute element={<List />} allowedRoles={['Admin']} /> },
            { path: '/Product', element: <PrivateRoute element={<ListProduct />} allowedRoles={['seller']} /> },
            { path: '/Add-product', element: <PrivateRoute element={<Addproduct />} /> }

        ]
    },
    { path: '*', element: <Navigate to="/" replace /> }
];

export default routes;