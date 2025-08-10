import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../../component/LoadingSpinner'
// import LoadingSpinner from '../../components/loading/loadingSpinner';


const PrivateRoute = ({ element, allowedRoles = [] }) => {
    const { isAuthenticated, userInfo, loading } = useSelector((state) => state.auth);

    if (loading?.userInfo) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && userInfo?.role) {
        const userRole = userInfo.role.toLowerCase();
        const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());

        if (!normalizedAllowedRoles.includes(userRole)) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return element;
};

export default PrivateRoute;