import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoCircle from '../components/LogoCircle';
import { connectSocket, subscribeSocket } from '../services/socket';
import { getTodayOrders, updateOrderStatus, getOrderStats } from '../services/api';
import { playNotificationSound } from '../services/sound';
import { toast } from 'react-toastify';

const ORDER_STATUSES = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];

const formatStatusLabel = (status) => {
  if (!status) return 'Pending';
  const s = String(status).toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const normalizeId = (value) => {
  if (value == null || value === '') return '';
  if (typeof value === 'object' && typeof value.toString === 'function') return value.toString();
  return String(value);
};

const getOrderId = (order) => normalizeId(order?._id || order?.id || order?.orderId);
const getOrderNumber = (order) => order?.orderNumber || order?.orderId || order?._id || '—';
const getTableNumber = (order) => {
  const value = order?.table ?? order?.tableNumber ?? order?.tableNo;
  if (value === undefined || value === null || String(value).trim() === '') return '—';
  return String(value);
};
const getCustomerName = (order) => {
  if (order?.customerName) return order.customerName;
  if (order?.customer?.name) return order.customer.name;
  if (order?.userId && typeof order.userId === 'object') return order.userId.name || 'Guest';
  return 'Guest';
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
    if (typeof item === 'string') return item;
    const name = item.name || item.title || item.productName || item.productId?.name || 'Item';
    const qty = item.qty || item.quantity || item.count || 1;
    return `${name} × ${qty}`;
  }).filter(Boolean).join(', ');
};

const mergeOrderUpdate = (existing, update) => {
  if (!update || typeof update !== 'object') return existing;
  return { ...existing, ...update, status: update.status ?? existing.status };
};

export default function AdminOrders() {
  const nav = useNavigate();
  const { logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalRevenue, setTotalRevenue] = useState(0);


  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await getOrderStats();

        const revenue = stats.reduce(
          (sum, item) => sum + Number(item.totalAmount || 0),
          0
        );

        setTotalRevenue(revenue);
      } catch (err) {
        console.error(err);
      }
    };

    loadStats();
  }, []);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const payload = await getTodayOrders();
        const list = Array.isArray(payload) ? payload : payload?.orders || payload?.data || [];
        setOrders(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('Fetch today orders error:', err);
        setError(err?.message || 'Unable to load orders.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  useEffect(() => {
    const cleanupNew = subscribeSocket('newOrder', (order) => {
      if (!order) return;
      setOrders((prev) => {
        const id = getOrderId(order);
        if (id && prev.some((o) => getOrderId(o) === id)) return prev;
        return [order, ...prev];
      });
      playNotificationSound();
      toast.info(`New Order Received\nOrder #${getOrderNumber(order)}`);
    });

    const cleanupStatus = subscribeSocket('orderStatusUpdated', (update) => {
      if (!update) return;
      const id = getOrderId(update);
      if (!id) return;
      setOrders((prev) => prev.map((order) => (
        getOrderId(order) === id ? mergeOrderUpdate(order, update) : order
      )));
    });

    return () => {
      cleanupNew();
      cleanupStatus();
    };
  }, []);

  const handleStatusChange = async (order, nextStatus) => {
    const orderId = getOrderId(order);
    if (!orderId) return;

    const previousStatus = order.status;
    setOrders((prev) => prev.map((o) => (
      getOrderId(o) === orderId ? { ...o, status: nextStatus } : o
    )));

    try {
      const updated = await updateOrderStatus(orderId, nextStatus);
      if (updated) {
        setOrders((prev) => prev.map((o) => (
          getOrderId(o) === orderId ? mergeOrderUpdate(o, updated) : o
        )));
      }
      toast.success(`Order #${getOrderNumber(order)} marked ${nextStatus}`);
      // console.log("Before toast");
      // toast("Status Updated");
      // console.log("After toast");
    } catch (err) {
      console.error('Update order status failed:', err);
      toast.error('Failed to update order status');
      setOrders((prev) => prev.map((o) => (
        getOrderId(o) === orderId ? { ...o, status: previousStatus } : o
      )));
    }
  };
  const todayRevenue = orders.reduce(
    (sum, order) =>
      sum + Number(order.totalAmount || order.total || order.amount || 0),
    0
  );

  const completedRevenue = orders
    .filter(
      (order) => String(order.status || '').toLowerCase() === 'completed'
    )
    .reduce(
      (sum, order) =>
        sum + Number(order.totalAmount || order.total || order.amount || 0),
      0
    );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ background: '#2C1200', padding: '0 2rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LogoCircle size="sm" />
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: '#FAF6EC', fontWeight: 700 }}>
            The Daily Grind <span style={{ color: 'rgba(253,248,243,0.4)', fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 400 }}>Live Orders</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => nav('/admin')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#E8E0D5', borderRadius: 8, padding: '8px 16px', fontSize: 14, cursor: 'pointer' }}>Dashboard</button>
          <button onClick={() => { logout(); nav('/'); }} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#E8E0D5', borderRadius: 8, padding: '8px 16px', fontSize: 14, cursor: 'pointer' }}>Sign Out</button>
        </div>
      </div>

      <div style={{ padding: '2rem', background: '#F2ECD8', minHeight: 'calc(100vh - 60px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 28, color: '#2C1200', marginBottom: 8 }}>Live Orders</h1>
            <p style={{ color: '#9CA3AF', fontSize: 14 }}>Receive incoming orders in real time and update status instantly.</p>
          </div>
          <button onClick={() => connectSocket()} style={{ padding: '12px 20px', background: '#C8A800', border: 'none', borderRadius: 10, color: '#2C1200', fontWeight: 700, cursor: 'pointer' }}>Reconnect Socket</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 24 }}>
          <div style={{ background: '#fff', border: '1px solid #E8E0D5', borderRadius: 12, padding: '1.2rem' }}>
            <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 8 }}>Orders Today</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: '#2C1200', fontWeight: 700 }}>{orders.length}</div>
          </div>

          {/* Today's Revenue */}
          <div style={{ background: '#fff', border: '1px solid #E8E0D5', borderRadius: 12, padding: '1.2rem' }}>
            <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 8 }}>Today's Revenue</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: '#2C1200', fontWeight: 700 }}>₹{todayRevenue}
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #E8E0D5', borderRadius: 12, padding: '1.2rem' }}>
            <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 8 }}>Total Revenue</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: '#2C1200', fontWeight: 700 }}>₹{totalRevenue}
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #E8E0D5', borderRadius: 12, padding: '1.2rem' }}>
            <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 8 }}>Latest Order</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: '#2C1200', fontWeight: 700 }}>{orders[0] ? `#${getOrderNumber(orders[0])}` : '—'}</div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #E8E0D5', borderRadius: 12, padding: '1.2rem' }}>
            <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 8 }}>Pending</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: '#2C1200', fontWeight: 700 }}>{orders.filter(o => String(o?.status || '').toLowerCase() === 'pending').length}</div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #E8E0D5', borderRadius: 12, padding: '1.2rem' }}>
            <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 8 }}>Preparing</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: '#2C1200', fontWeight: 700 }}>{orders.filter(o => String(o?.status || '').toLowerCase() === 'preparing').length}</div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #E8E0D5', borderRadius: 12, padding: '1.2rem' }}>
            <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 8 }}>Ready</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: '#2C1200', fontWeight: 700 }}>{orders.filter(o => String(o?.status || '').toLowerCase() === 'ready').length}</div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #E8E0D5', borderRadius: 12, padding: '1.2rem' }}>
            <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 8 }}>Completed</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: '#2C1200', fontWeight: 700 }}>{orders.filter(o => String(o?.status || '').toLowerCase() === 'completed').length}</div>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8E0D5', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1.2fr 3fr 1fr 1fr 1.2fr', gap: 0, padding: '12px 16px', background: '#F0EDE9', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#9CA3AF' }}>
            <span>Order #</span><span>Table</span><span>Customer</span><span>Items</span><span>Amount</span><span>Status</span><span>Created</span>
          </div>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#9CA3AF' }}>Loading orders…</div>
          ) : error ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#EF4444' }}>{error}</div>
          ) : orders.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#9CA3AF' }}>No orders received today.</div>
          ) : orders.map((order) => (
            <div key={getOrderId(order) || getOrderNumber(order)} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1.2fr 3fr 1fr 1fr 1.2fr', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #F5F2EE', fontSize: 14, gap: 8 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontWeight: 700, color: '#2C1200' }}>#{getOrderNumber(order)}</span>
                <span style={{ fontSize: 12, color: '#9CA3AF' }}>{formatStatusLabel(order.status)}</span>
              </div>
              <div style={{ fontWeight: 800, color: '#2C1200' }}>{getTableNumber(order)}</div>
              <div>{getCustomerName(order)}</div>
              <div style={{ color: '#4B4B4B', fontSize: 13 }}>{formatItems(order.items)}</div>
              <div style={{ fontWeight: 700, color: '#6B3A1F' }}>₹{order.totalAmount ?? order.total ?? order.amount ?? 0}</div>
              <div>
                <select value={String(order.status || 'pending').toLowerCase()} onChange={(e) => handleStatusChange(order, e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #E8E0D5', background: '#fff', fontSize: 13, color: '#2C1200' }}>
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>{formatStatusLabel(status)}</option>
                  ))}
                </select>
              </div>
              <div style={{ color: '#9CA3AF', fontSize: 13 }}>{formatTime(order.createdAt || order.createdTime || order.created)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
