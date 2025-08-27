import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';

const Login = lazy(() => import('@pages/Login'));
const SignUp = lazy(() => import('@pages/SignUp'));
const Channel = lazy(() => import('@pages/Channel'));

const App = () => {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/workspace/channel" element={<Channel />} />
      </Routes>
    </Suspense>
  );
};

export default App;
