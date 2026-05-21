import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/Login';
import DashboardOverview from './pages/DashboardOverview';
import ActiveTrips from './pages/ActiveTrips';
import PaymentManagement from './pages/PaymentManagement';
import BookingAnalytics from './pages/BookingAnalytics';
import UserManagement from './pages/UserManagement';
import SearchAnalytics from './pages/SearchAnalytics';
import CancellationReports from './pages/CancellationReports';
import Settings from './pages/Settings';
import './index.css';

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red', background: '#fff', height: '100vh' }}>
          <h1>Something went wrong in the Admin Panel</h1>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Router basename="/admin-dashboard/">
        <Routes>
          {/* Public route — no auth needed */}
          <Route path="/login" element={<AdminLogin />} />

          {/* Protected routes — AdminLayout checks auth */}
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="trips/active" element={<ActiveTrips />} />
            <Route path="payments" element={<PaymentManagement />} />
            <Route path="analytics/bookings" element={<BookingAnalytics />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="searches" element={<SearchAnalytics />} />
            <Route path="cancellations" element={<CancellationReports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<div className="p-8 text-center text-slate-500">Page Not Found</div>} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
