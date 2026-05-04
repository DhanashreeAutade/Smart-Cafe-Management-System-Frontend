import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMenu } from '../context/MenuContext';
import LogoCircle from '../components/LogoCircle';
import Toast from '../components/Toast';
import { getUsers, deleteUserApi } from '../services/api';

const CATS = ['Hot Coffee', 'Cold Coffee', 'Tea & Infusions', 'Bakery', 'Snacks', 'Smoothies', 'Specials'];

function StatCard({ icon, value, label }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E8E0D5', borderRadius: 12, padding: '1.2rem', display: 'flex', alignItems: 'center', gap: 14 }}>
      <span style={{ fontSize: 26 }}>{icon}</span>
      <div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: '#2C1200' }}>{value}</div>
        <div style={{ fontSize: 12, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const nav = useNavigate();
  const { logout } = useAuth();
  const { items = [], addItem, deleteItem, categories } = useMenu();
  const [tab, setTab] = useState('overview');
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ name: '', category: 'Hot Coffee', price: '', emoji: '☕', description: '', tags: '' });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data.users || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleAddProduct = () => {
    if (!form.name || !form.price) { setToast('Please enter a name and price.'); return; }
    addItem({ ...form, price: parseFloat(form.price), tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) });
    setForm({ name: '', category: 'Hot Coffee', price: '', emoji: '☕', description: '', tags: '' });
    setToast(`${form.name} added to menu ✦`);
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Remove ${name}?`)) return;
    try {
      await deleteUserApi(id);

      // remove user from UI instantly
      setUsers(prev => prev.filter(u => u._id !== id));

      setToast('Customer removed.');
    } catch (err) {
      console.error(err);
      setToast('Failed to delete user');
    }
  };


const handleDeleteItem = (id, name) => {
  if (!window.confirm(`Remove "${name}" from menu?`)) return;
  deleteItem(id); setToast('Item removed from menu.');
};

const navItems = [
  { id: 'overview', label: 'Overview', icon: '◈' },
  { id: 'customers', label: 'Customers', icon: '◉' },
  { id: 'products', label: 'Products', icon: '◈' },
];

const inputStyle = { width: '100%', padding: '9px 12px', border: '1.5px solid #E2D08A', borderRadius: 8, fontSize: 14, background: '#FAF6EC', color: '#2C1200', outline: 'none', fontFamily: "'Nunito',sans-serif" };
const labelStyle = { display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: '#6B7280', marginBottom: 6 };

return (
  <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    {toast && <Toast message={toast} onDone={() => setToast('')} />}

    {/* Topbar */}
    <div style={{ background: '#2C1200', padding: '0 2rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <LogoCircle size="sm" />
        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: '#FAF6EC', fontWeight: 700 }}>
          The Daily Grind <span style={{ color: 'rgba(253,248,243,0.4)', fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 400 }}>Admin</span>
        </span>
      </div>
      <button onClick={() => { logout(); nav('/'); }} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#E8E0D5', borderRadius: 8, padding: '8px 16px', fontSize: 14, cursor: 'pointer' }}>Sign Out</button>
    </div>

    <div style={{ display: 'flex', flex: 1 }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: '#2C1200', padding: '1.5rem 1rem', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(253,248,243,0.3)', padding: '0 0.9rem 0.4rem', fontWeight: 700 }}>Dashboard</div>
        {navItems.map(n => (
          <button key={n.id} onClick={() => setTab(n.id)} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
            marginBottom: 4, fontSize: 14, fontWeight: 500, textAlign: 'left', transition: 'all 0.18s',
            background: tab === n.id ? 'rgba(198,139,61,0.25)' : 'transparent',
            color: tab === n.id ? '#C8A800' : 'rgba(253,248,243,0.65)',
          }}
            onMouseEnter={e => { if (tab !== n.id) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={e => { if (tab !== n.id) e.currentTarget.style.background = 'transparent'; }}
          >
            <span>{n.icon}</span>{n.label}
          </button>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '2rem', background: '#F2ECD8', overflowY: 'auto' }}>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: '#2C1200', marginBottom: 6 }}>Dashboard</h2>
            <p style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 24 }}>Here's what's happening at The Daily Grind today.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 28 }}>
              <StatCard icon="👥" value={users.length} label="Customers" />
              <StatCard icon="☕" value={items.length} label="Products" />
              <StatCard icon="📂" value={[...new Set(items.map(i => i.category))].length} label="Categories" />
            </div>
            <div style={{ background: '#fff', border: '1px solid #E8E0D5', borderRadius: 12, padding: '1.5rem' }}>
              <h3 style={{ fontSize: 16, color: '#2C1200', marginBottom: 16 }}>Recent Customers</h3>
              {!users.length ? <p style={{ color: '#9CA3AF', fontSize: 14 }}>No customers yet.</p> :
                users.slice(-5).reverse().map(u => (
                  <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F0EDE9' }}>
                    <div><span style={{ fontWeight: 600, color: '#2C1200' }}>{u.name}</span> <span style={{ color: '#9CA3AF', fontSize: 13 }}>{u.email}</span></div>
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>{u.joined}</span>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {/* CUSTOMERS */}
        {tab === 'customers' && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: '#2C1200', marginBottom: 6 }}>Customers</h2>
            <p style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 20 }}>All registered accounts.</p>
            <div style={{ background: '#fff', border: '1px solid #E8E0D5', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1fr 0.8fr', padding: '10px 16px', background: '#F0EDE9', borderBottom: '1px solid #E8E0D5', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#9CA3AF' }}>
                <span>Name</span><span>Email</span><span>Phone</span><span>Joined</span><span>Action</span>
              </div>
              {!users.length ? <div style={{ padding: '1.5rem', color: '#9CA3AF', fontSize: 14 }}>No customers registered yet.</div> :
                users.map(u => (
                  <div key={u._id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1fr 0.8fr', padding: '12px 16px', borderBottom: '1px solid #F5F2EE', alignItems: 'center', fontSize: 14 }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FAF6EC'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontWeight: 600, color: '#2C1200' }}>{u.name}</span>
                    <span style={{ color: '#6B7280' }}>{u.email}</span>
                    <span style={{ color: '#9CA3AF' }}>{u.phone || '—'}</span>
                    <span style={{ background: '#EEF5EF', color: '#3D7A40', padding: '3px 8px', borderRadius: 5, fontSize: 12, fontWeight: 600, display: 'inline-block' }}>{u.joined}</span>
                    <button onClick={() => handleDeleteUser(u._id, u.name)} style={{ width: 32, height: 32, borderRadius: 7, border: '1px solid #E8E0D5', background: '#fff', cursor: 'pointer', fontSize: 14, transition: 'all 0.18s' }}
                      onMouseEnter={e => { e.target.style.borderColor = '#EF4444'; e.target.style.color = '#EF4444'; }}
                      onMouseLeave={e => { e.target.style.borderColor = '#E8E0D5'; e.target.style.color = 'inherit'; }}
                    >🗑</button>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {tab === 'products' && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: '#2C1200', marginBottom: 6 }}>Products</h2>
            <p style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 20 }}>Manage your café menu.</p>

            {/* Add form */}
            <div style={{ background: '#fff', border: '1px solid #E8E0D5', borderRadius: 12, padding: '1.5rem', marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, color: '#2C1200', marginBottom: 18 }}>✦ Add New Item</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div><label style={labelStyle}>Item Name</label><input style={inputStyle} placeholder="e.g. Oat Milk Latte" value={form.name} onChange={set('name')} /></div>
                <div><label style={labelStyle}>Category</label>
                  <select style={inputStyle} value={form.category} onChange={set('category')}>
                    {CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div><label style={labelStyle}>Price (₹)</label><input style={inputStyle} type="number" placeholder="220" value={form.price} onChange={set('price')} /></div>
                <div><label style={labelStyle}>Emoji</label><input style={inputStyle} placeholder="☕" value={form.emoji} onChange={set('emoji')} /></div>
              </div>
              <div style={{ marginBottom: 14 }}><label style={labelStyle}>Description</label><textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} placeholder="Brief description…" value={form.description} onChange={set('description')} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 14 }}>
                <div><label style={labelStyle}>Tags (comma-separated)</label><input style={inputStyle} placeholder="Hot, Vegan, Popular" value={form.tags} onChange={set('tags')} /></div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button onClick={handleAddProduct} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#8B3A00,#2C1200)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>Add to Menu</button>
                </div>
              </div>
            </div>

            {/* Products table */}
            <div style={{ background: '#fff', border: '1px solid #E8E0D5', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1.5fr 0.5fr', padding: '10px 16px', background: '#F0EDE9', borderBottom: '1px solid #E8E0D5', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#9CA3AF' }}>
                <span>Item</span><span>Category</span><span>Price</span><span>Tags</span><span></span>
              </div>
              {items.map(item => (
                <div key={item._id || item.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1.5fr 0.5fr', padding: '12px 16px', borderBottom: '1px solid #F5F2EE', alignItems: 'center', fontSize: 14 }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FAF6EC'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontWeight: 600, color: '#2C1200' }}>{item.emoji} {item.name}</span>
                  <span style={{ background: '#FAF0D7', color: '#7A4F00', padding: '3px 8px', borderRadius: 5, fontSize: 12, fontWeight: 600, display: 'inline-block' }}>{item.category}</span>
                  <span style={{ fontWeight: 700, color: '#6B3A1F' }}>₹{item.price}</span>
                  <span style={{ fontSize: 12, color: '#9CA3AF' }}>{(item.tags || []).join(', ')}</span>
                  <button onClick={() => handleDeleteItem(item._id || item.id, item.name)} style={{ width: 32, height: 32, borderRadius: 7, border: '1px solid #E8E0D5', background: '#fff', cursor: 'pointer', fontSize: 14 }}
                    onMouseEnter={e => { e.target.style.borderColor = '#EF4444'; e.target.style.color = '#EF4444'; }}
                    onMouseLeave={e => { e.target.style.borderColor = '#E8E0D5'; e.target.style.color = 'inherit'; }}
                  >🗑</button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  </div>
);
};

