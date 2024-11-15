import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import AOS from 'aos';
import 'aos/dist/aos.css';

import Preloader from './Components/Preloader';
import ProtectedRoute from './Components/ProtectedRoute';
import Login from './Components/Login/Login';
import Admin from './Components/Admin/Admin';
import TableEmployee from './Components/Admin/TableEmployee';
import TableAppointment from './Components/Admin/TableAppointment';
import TableUser from './Components/Admin/TableUser';
import User from './Components/User/User';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hidePreloader, setHidePreloader] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHidePreloader(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 500); // Wait for the animation time before removing the preloader completely
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <div className="App">
      {isLoading ? (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-cWhite transition-all duration-500 ${hidePreloader ? '-translate-y-full opacity-0' : ''
            }`}
        >
          <Preloader />
        </div>
      ) : (
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/user" element={<User />} />

            <Route
              path="/admin/employees"
              element={
                <ProtectedRoute>
                  <TableEmployee />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/appointments"
              element={
                <ProtectedRoute>
                  <TableAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <TableUser />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      )}
    </div>
  );
}

export default App;
