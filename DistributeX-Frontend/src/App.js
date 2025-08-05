import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from './SignIn';
import Home from './Home';
import { auth } from './Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Logs from './Logs';

// In your router setup, add this route:



function App() {
  const [user] = useAuthState(auth);

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root ("/") to "/signin" */}
        <Route path="/" element={<Navigate to="/signin" />} />

        <Route path="/signin" element={<SignIn />} />

        {/* Protected Route */}
        <Route path="/home" element={user ? <Home /> : <Navigate to="/signin" />} />

        <Route path="/logs" element={<Logs />} />

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/signin" />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
