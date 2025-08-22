import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';

const Login = lazy(() => import('@pages/Login'));
const SingUp = lazy(() => import('@pages/SingUp'));

const App = () => {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SingUp />} />
      </Routes>
    </Suspense>
  );
};

export default App;
