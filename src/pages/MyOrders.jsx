import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoCircle from '../components/LogoCircle';
import { getMyOrders } from '../services/api';
import { subscribeSocket } from '../services/socket';

const normalizeId = (value) => {
  if (value == null || value === '') return '';
  if (typeof value === 'object' && typeof value.toString === 'function') return value.toString();
  return String(value);
};

const getOrderId = (order) => normalizeId(order?._id || order?.id);
const getTableNumber = (order) => {
  const value = order?.table ?? order?.tableNumber ?? order?.tableNo;
  if (value === undefined || value === null || String(value).trim() === '') return '—';
  return String(value);
};
const formatStatusLabel = (status) => {
  if (!status) return 'Pending';
  const s = String(status).toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
};
const formatTime = (value) => {
  if (!value) return 'Unknown';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('en-IN', {
    day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit'
  });
};
const formatItems = (items) => {
  if (!Array.isArray(items)) return '';
  return items.map((item) => {
    if (!item) return '';
    const name = item.productName || item.name || item.productId?.name || 'Item';
    const qty = item.quantity || item.qty || 1;
    return `${name} × ${qty}`;
  }).filter(Boolean).join(', ');
};

const statusColor = (status) => {
  const s = String(status || 'pending').toLowerCase();
  if (s === 'preparing') return { bg: '#FEF3C7', color: '#92400E' };
  if (s === 'ready') return { bg: '#DBEAFE', color: '#1D4ED8' };
  if (s === 'completed') return { bg: '#EEF5EF', color: '#3D7A40' };
  if (s === 'cancelled') return { bg: '#FEE2E2', color: '#B91C1C' };
  return { bg: '#FAF0D7', color: '#7A4F00' };
};

export default function MyOrders() {
  const nav = useNavigate();
  const { currentUser, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const list = await getMyOrders();
        setOrders(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('Fetch my orders error:', err);
        setError('Unable to load your orders.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  useEffect(() => {
    const cleanup = subscribeSocket('orderStatusUpdated', (update) => {
      if (!update) return;
      const id = getOrderId(update);
      if (!id) return;
      setOrders((prev) => prev.map((order) => (
        getOrderId(order) === id
          ? { ...order, status: update.status ?? order.status }
          : order
      )));
    });

    return cleanup;
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#2C1200', padding: '0 2rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LogoCircle size="sm" />
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: '#FAF6EC', fontWeight: 700 }}>
            The Daily Grind <span style={{ color: 'rgba(253,248,243,0.4)', fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 400 }}>My Orders</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => nav('/menu')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#E8E0D5', borderRadius: 8, padding: '8px 16px', fontSize: 14, cursor: 'pointer' }}>Menu</button>
          <button onClick={() => { logout(); nav('/'); }} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#E8E0D5', borderRadius: 8, padding: '8px 16px', fontSize: 14, cursor: 'pointer' }}>Sign Out</button>
        </div>
      </div>

      <div style={{ padding: '2rem', background: '#F2ECD8', minHeight: 'calc(100vh - 60px)' }}>
        <h1 style={{ fontSize: 28, color: '#2C1200', marginBottom: 8 }}>My Orders</h1>
        <p style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 24 }}>
          Track your order status in real time, {currentUser?.name?.split(' ')[0] || 'friend'}.
        </p>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8E0D5', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.7fr 2fr 1fr 1fr 1.2fr', gap: 0, padding: '12px 16px', background: '#F0EDE9', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#9CA3AF' }}>
            <span>Order #</span><span>Table</span><span>Items</span><span>Amount</span><span>Status</span><span>Placed</span>
          </div>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#9CA3AF' }}>Loading orders…</div>
          ) : error ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#EF4444' }}>{error}</div>
          ) : orders.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#9CA3AF' }}>
              No orders yet. <button onClick={() => nav('/menu')} style={{ background: 'none', border: 'none', color: '#8B3A00', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Browse the menu</button>
            </div>
          ) : orders.map((order) => {
            const badge = statusColor(order.status);
            return (
              <div key={getOrderId(order)} style={{ display: 'grid', gridTemplateColumns: '1fr 0.7fr 2fr 1fr 1fr 1.2fr', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #F5F2EE', fontSize: 14, gap: 8 }}>
                <span style={{ fontWeight: 700, color: '#2C1200' }}>{order.orderNumber || '—'}</span>
                <span style={{ fontWeight: 800, color: '#2C1200' }}>{getTableNumber(order)}</span>
                <span style={{ color: '#4B4B4B', fontSize: 13 }}>{formatItems(order.items)}</span>
                <span style={{ fontWeight: 700, color: '#6B3A1F' }}>₹{order.totalAmount ?? 0}</span>
                <span style={{ background: badge.bg, color: badge.color, padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, display: 'inline-block', width: 'fit-content' }}>
                  {formatStatusLabel(order.status)}
                </span>
                <span style={{ color: '#9CA3AF', fontSize: 13 }}>{formatTime(order.createdAt || order.orderDate)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
