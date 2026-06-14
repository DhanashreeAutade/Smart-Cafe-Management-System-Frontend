import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MenuProvider } from './context/MenuContext';
import { CartProvider } from './context/CartContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import Menu from './pages/Menu';
import AdminDashboard from './pages/AdminDashboard';
import AdminForgotPassword from './pages/AdminForgotPassword';
import AdminResetPassword from './pages/AdminResetPassword';
import ResetPassword from './pages/ResetPassword';

function ProtectedMenu() {
  const { currentUser, isAdmin, authLoading } = useAuth();
  if (authLoading) return null;
  if (!currentUser || isAdmin) return <Navigate to="/" replace />;
  return <Menu />;
}

function ProtectedAdmin() {
  const { isAdmin, authLoading } = useAuth();
  if (authLoading) return null;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <AdminDashboard />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/menu" element={<ProtectedMenu />} />
      <Route path="/admin" element={<ProtectedAdmin />} />
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
          </CartProvider>
        </MenuProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
