import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import LeaveApplication from './leave-application.tsx';
import EmployeePortal from './employee_portal_redesign.tsx';
import SignInForm from './SignInForm.jsx';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/portal" element={<EmployeePortal />} />
      <Route path="/signin" element={<SignInForm />} />
      <Route path="/leave-application" element={<LeaveApplication />} />
    </Routes>
  </BrowserRouter>
);

