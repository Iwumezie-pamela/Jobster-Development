import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import DashboardFormPage from './pages/DashboardFormPage';
import ErrorPage from './pages/ErrorPage';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
// handle alert
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  AllJobs,
  AddJobs,
  SharedLayout,
  Profile,
  Stats,
} from './pages/DashboardFolder';
import ProtectedRoute from './pages/ProtectedRoute';

function App() {
  return (
    <div className='app'>
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <SharedLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Stats />} />
            <Route path='/all-jobs' element={<AllJobs />} />
            <Route path='/add-job' element={<AddJobs />} />
            <Route path='/profile' element={<Profile />} />
          </Route>
          <Route path='/landing' element={<LandingPage />} />
          <Route path='*' element={<ErrorPage />} />
          <Route path='/register' element={<RegisterPage />} />
          {/* <Route path='/' element={<DashboardFormPage />} /> */}
        </Routes>
        <ToastContainer position='top-center' />
      </BrowserRouter>
    </div>
  );
}

export default App;
