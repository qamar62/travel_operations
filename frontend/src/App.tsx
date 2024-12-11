import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import VoucherList from './components/Voucher/VoucherList';
import VoucherDetail from './components/Voucher/VoucherDetail';
import VoucherEdit from './components/Voucher/VoucherEdit';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vouchers" element={<VoucherList />} />
            <Route path="/vouchers/:id" element={<VoucherDetail />} />
            <Route path="/vouchers/:id/edit" element={<VoucherEdit />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
