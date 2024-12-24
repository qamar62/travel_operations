import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import {
  Layout,
  Dashboard,
  VoucherList,
  VoucherDetail,
  VoucherEdit,
  HotelVoucherList,
  HotelVoucherDetail,
  HotelVoucherCreate,
  HotelVoucherEdit,
  Login,
  ProtectedRoute
} from '@/components';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vouchers"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <VoucherList />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vouchers/:id"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <VoucherDetail />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vouchers/:id/edit"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <VoucherEdit />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hotel-vouchers"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <HotelVoucherList />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hotel-vouchers/create"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <HotelVoucherCreate />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hotel-vouchers/:id"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <HotelVoucherDetail />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hotel-vouchers/:id/edit"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <HotelVoucherEdit />
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </ThemeProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
