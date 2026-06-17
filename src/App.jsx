import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MenuProvider } from './context/MenuContext';
import { CartProvider } from './context/CartContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import Menu from './pages/Menu';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import MyOrders from './pages/MyOrders';
import AdminForgotPassword from './pages/AdminForgotPassword';
import AdminResetPassword from './pages/AdminResetPassword';
import ResetPassword from './pages/ResetPassword';

function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F2ECD8', color: '#9CA3AF' }}>
      Loading…
    </div>
  );
}

function ProtectedMenu() {
  const { currentUser, isAdmin, authLoading } = useAuth();
  if (authLoading) return <LoadingScreen />;
  if (!currentUser || isAdmin) return <Navigate to="/" replace />;
  return <Menu />;
}

function ProtectedCustomer({ children }) {
  const { currentUser, isAdmin, authLoading } = useAuth();
  if (authLoading) return <LoadingScreen />;
  if (!currentUser || isAdmin) return <Navigate to="/" replace />;
  return children;
}

function ProtectedAdmin({ children }) {
  const { isAdmin, authLoading } = useAuth();
  if (authLoading) return <LoadingScreen />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/menu" element={<ProtectedMenu />} />
      <Route path="/my-orders" element={<ProtectedCustomer><MyOrders /></ProtectedCustomer>} />
      <Route path="/admin" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
      <Route path="/admin/orders" element={<ProtectedAdmin><AdminOrders /></ProtectedAdmin>} />
      <Route path="/admin-forgot-password" element={<AdminForgotPassword />} />
      <Route path="/admin-reset-password" element={<AdminResetPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MenuProvider>
          <CartProvider>
            <AppRoutes />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnHover
              draggable
              theme="dark"
            />
          </CartProvider>
        </MenuProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
