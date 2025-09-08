import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { ToastContainer } from 'react-toastify';

const Login = lazy(() => import('@pages/Login'));
const SignUp = lazy(() => import('@pages/SignUp'));
const Channel = lazy(() => import('@pages/Channel'));
const DirectMessage = lazy(() => import('@pages/DirectMessage'));
const Workspace = lazy(() => import('@layouts/Workspace'));

const App = () => {
  return (
    <>
      <Suspense fallback={<div>loading...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/workspace/:workspace" element={<Workspace />}>
            <Route path="channel/:channel" element={<Channel />} />
            <Route path="dm/:id" element={<DirectMessage />} />
          </Route>
        </Routes>
      </Suspense>
      <ToastContainer />
    </>
  );
};

export default App;
