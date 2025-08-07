import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import LeaveApplication from './leave-application.tsx';
import EmployeePortal from './employee_portal_redesign.tsx';
import SignInForm from './SignInForm.jsx';
import ProfilePage from './profile-page.tsx';
import JobListings from './job-applications.tsx';
import FeedbackForm from './feedback-form.tsx';
import TimesheetForm  from './timesheet.tsx';
import EmployeeInductionModules from './induction-modules.tsx';
import AdminPortal from './admin-portal.tsx';
import AssetManagementTable from './admin-asset-management.tsx';
import reportWebVitals from './reportWebVitals';
import HRPortal from './hr-portal.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<SignInForm />} />
      <Route path="/portal" element={<EmployeePortal />} />
      <Route path="/signin" element={<SignInForm />} />
      <Route path="/leave-application" element={<LeaveApplication />} />
      <Route path="/profile-page" element={<ProfilePage />} />
      <Route path="/job-applications" element={<JobListings />} />
      <Route path="/feedback-form" element={<FeedbackForm />} />
      <Route path="/induction-modules" element={<EmployeeInductionModules />} />
      <Route path="/timesheet" element={<TimesheetForm />} />
      <Route path="/admin-portal" element={<AdminPortal />} />
      <Route path="/asset-management-table" element={<AssetManagementTable />} />
      <Route path="/hr-portal" element={<HRPortal />} />
      </Routes>
  </BrowserRouter>
);
