import React, { Suspense, useEffect } from 'react';
import './App.css';
import { useRoutes } from "react-router-dom";

import { useDispatch } from 'react-redux';
import routes from './RoutesConfig/routesConfig/RoutesDetails.jsx';
import { restoreSession } from './features/authSlice';
import LoadingSpinner from './component/LoadingSpinner';
import { ToastContainer } from 'react-toastify';
function App() {
  const dispatch = useDispatch();
  const routing = useRoutes(routes); // Convert route config to element

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {routing}
      <ToastContainer />
    </Suspense>
  );
}

export default App;
