import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMenu } from '../context/MenuContext';
import { useCart } from '../context/CartContext';
import LogoCircle from '../components/LogoCircle';
import { toast } from 'react-toastify';
import { API, createOrder, getSettings } from '../services/api';

const getImageUrl = (image) => {
  if (!image) return '';
  if (typeof image === 'object') {
    return image.url ? getImageUrl(image.url) : '';
  }
  if (/^https?:\/\//i.test(image)) return image;
  // ensure leading slash for paths that start with uploads
  const path = image.startsWith('/') ? image : `/${image}`;
  return `${API}${path}`;
};

const getItemCategoryField = (category) => {
  if (!category) return '';
  return typeof category === 'object' ? category.name || category._id || category.id || '' : category;
};

function ItemModal({ item, onClose, onAdd }) {
  const [qty, setQty] = useState(1);
  if (!item) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(26,15,10,0.55)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', position: 'relative', animation: 'slideUp 0.3s ease' }}>
        <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: '50%', background: '#F0EDE9', border: 'none', cursor: 'pointer', fontSize: 16, color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>✕</button>
        <div
          style={{
            height: 180,
            background: '#FAF6EC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: '20px 20px 0 0'
          }}
        >
          {item.image ? (
            <img
              src={getImageUrl(item.image)}
              alt={item.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <span style={{ fontSize: 80 }}>{item.emoji}</span>
          )}
        </div>
        <div style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#C8A800', fontWeight: 700, marginBottom: 6 }}>{getItemCategoryField(item.category)}</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: '#2C1200', marginBottom: 10 }}>{item.name}</h2>
          <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.65, marginBottom: 14 }}>{item.description}</p>
          <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
            {(item.tags || []).map(t => <span key={t} style={{ background: '#FAF6EC', border: '1px solid #E8E0D5', padding: '4px 10px', borderRadius: 6, fontSize: 12, color: '#6B7280' }}>{t}</span>)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: '#2C1200' }}>₹{item.price}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 34, height: 34, borderRadius: '50%', border: '1.5px solid #E8E0D5', background: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2C1200' }}>−</button>
              <span style={{ fontWeight: 700, fontSize: 16, minWidth: 24, textAlign: 'center' }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} style={{ width: 34, height: 34, borderRadius: '50%', border: '1.5px solid #E8E0D5', background: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2C1200' }}>+</button>
            </div>
            <button onClick={() => onAdd(item, qty)} style={{ flex: 1, padding: '12px 0', background: 'linear-gradient(135deg,#8B3A00,#2C1200)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              Add to Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartModal({ onClose }) {
  const { currentUser } = useAuth();
  const { cart, removeFromCart, clearCart, totalPrice } = useCart();
  const [ordered, setOrdered] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [placing, setPlacing] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [maxTables, setMaxTables] = useState(10);

  useEffect(() => {
    let mounted = true;
    getSettings()
      .then((s) => {
        const next = parseInt(s?.maxTables, 10);
        if (mounted && !Number.isNaN(next) && next > 0) setMaxTables(next);
      })
      .catch(() => {
        // keep default
      });
    return () => { mounted = false; };
  }, []);

  const handlePlaceOrder = async () => {
    if (!cart.length) {
      setSubmitError('Your order is empty.');
      return;
    }

    const tableNum = parseInt(String(tableNumber).trim(), 10);
    if (!tableNumber || Number.isNaN(tableNum) || tableNum < 1 || tableNum > maxTables) {
      setSubmitError('Enter the valid table number');
      return;
    }

    setSubmitError('');
    setPlacing(true);

    try {
      const payload = {
        items: cart.map((item) => ({
          productId: item.id || item._id || item.productId || item.itemId,
          productName: item.name,
          price: item.price,
          quantity: item.qty,
        })),
        totalAmount: totalPrice,
        table: String(tableNum),
      };

      const result = await createOrder(payload);
      setOrderResult(result);
      setOrdered(true);
      clearCart();
    } catch (err) {
      setSubmitError(err?.message || 'Failed to place order.');
      console.error('Order placement failed:', err);
    } finally {
      setPlacing(false);
    }
  };

  if (ordered) return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(26,15,10,0.55)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#FEFCE8', borderRadius: 20, padding: 40, maxWidth: 420, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: '#2C1200', marginBottom: 8 }}>Order Placed Successfully</h2>
        <p style={{ color: '#6B7280', marginBottom: 20 }}>Thank you for ordering. Your order is now in the kitchen queue.</p>
        <div style={{ textAlign: 'left', marginBottom: 20, color: '#2C1200' }}>
          <div style={{ marginBottom: 8 }}><strong>Order Number:</strong> {orderResult?.orderNumber || orderResult?.id || orderResult?._id || 'N/A'}</div>
          <div style={{ marginBottom: 8 }}><strong>Table Number:</strong> {orderResult?.table || '—'}</div>
          <div style={{ marginBottom: 8 }}><strong>Total Amount:</strong> ₹{orderResult?.totalAmount ?? orderResult?.total ?? totalPrice}</div>
          <div><strong>Status:</strong> {orderResult?.status ? String(orderResult.status).charAt(0).toUpperCase() + String(orderResult.status).slice(1) : 'Pending'}</div>
        </div>
        <button onClick={onClose} style={{ padding: '12px 32px', background: 'linear-gradient(135deg,#8B3A00,#2C1200)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Back to Menu</button>
      </div>
    </div>
  );
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(26,15,10,0.55)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 480, maxHeight: '85vh', overflowY: 'auto', padding: '1.5rem', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: '50%', background: '#F0EDE9', border: 'none', cursor: 'pointer', fontSize: 16, color: '#6B7280' }}>✕</button>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: '#2C1200', marginBottom: 20 }}>Your Order</h2>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: '#6B7280', marginBottom: 6 }}>
            Table Number (1–{maxTables})
          </label>
          <input
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            type="number"
            min={1}
            max={maxTables}
            placeholder="Enter your table number"
            style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E8E0D5', borderRadius: 10, fontSize: 14, background: '#FAF6EC', color: '#2C1200', outline: 'none' }}
          />
        </div>
        {cart.length === 0 ? <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '2rem 0' }}>Your order is empty.</p> :
          cart.map(item => (
            <div key={item._id || item.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid #F0EDE9' }}>
              {item.image ? (
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  style={{
                    width: 40,
                    height: 40,
                    objectFit: 'cover',
                    borderRadius: 8
                  }}
                />
              ) : (
                <span style={{ fontSize: 28 }}>{item.emoji}</span>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#2C1200' }}>{item.name} × {item.qty}</div>
                <div style={{ fontSize: 13, color: '#9CA3AF' }}>₹{item.price * item.qty}</div>
              </div>
              <button onClick={() => removeFromCart(item.id)} style={{ color: '#EF4444', background: 'none', border: 'none', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>Remove</button>
            </div>
          ))
        }
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, fontFamily: "'Playfair Display',serif", fontSize: 20 }}>
          <span>Total</span><span>₹{totalPrice}</span>
        </div>
        {submitError && (
          <div style={{ marginTop: 10, color: '#EF4444', fontSize: 13, fontWeight: 600 }}>
            {submitError}
          </div>
        )}
        <button onClick={handlePlaceOrder} disabled={placing} style={{ width: '100%', marginTop: 16, padding: 16, background: 'linear-gradient(135deg,#8B3A00,#2C1200)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer', opacity: placing ? 0.7 : 1 }}>
          {placing ? 'Placing order…' : 'Place Order ✦'}
        </button>
      </div>
    </div>
  );
}

export default function Menu() {
  const nav = useNavigate();
  const { currentUser, logout } = useAuth();
  const { items, categories } = useMenu();
  const { addToCart, totalItems, totalPrice } = useCart();
  const [activeCat, setActiveCat] = useState({ id: 'All', name: 'All' });
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [toast, setToast] = useState('');

  const getCategoryLabel = (cat) => typeof cat === 'string' ? cat : cat?.name || cat?.category || cat?._id || '';
  const getCategoryId = (cat) => typeof cat === 'string' ? cat : cat?._id || cat?.id || cat?.name || cat?.category || '';
  const getItemCategory = (item) => {
    if (!item) return '';
    if (item.category) {
      return typeof item.category === 'object' ? item.category.name || item.category._id || item.category : item.category;
    }
    return item.categoryName || item.categoryId || '';
  };
  const getItemCategoryId = (item) => {
    if (!item) return '';
    if (item.category) {
      return typeof item.category === 'object' ? item.category._id || item.category.id || item.category.name || item.category : item.category;
    }
    return item.categoryId || item.categoryName || '';
  };
  

  const selectCategory = (cat) => {
    setActiveCat({ id: getCategoryId(cat), name: getCategoryLabel(cat) });
  };

  const isCategoryMatch = (item) => {
    if (activeCat.id === 'All') return true;
    const itemCategory = getItemCategory(item);
    const itemCategoryId = getItemCategoryId(item);
    return [itemCategory, itemCategoryId].some(value => value === activeCat.id || value === activeCat.name);
  };

  const normalizedSearch = (value) => value?.toString().toLowerCase() || '';

  const filtered = items.filter(i => {
    return isCategoryMatch(i) &&
      (!search ||
        normalizedSearch(i.name).includes(normalizedSearch(search)) ||
        normalizedSearch(getItemCategory(i)).includes(normalizedSearch(search))
      );
  });
  const featured = activeCat.id === 'All' ? items.find(i => i.featured) : null;

  const handleAdd = (item, qty) => {
    addToCart(item, qty);
    setSelectedItem(null);
    setToast(`${item.name} added to order`);
  };

  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
      {toast && <Toast message={toast} onDone={() => setToast('')} />}

      {/* Topbar */}
      <div style={{ background: '#2C1200', padding: '0 2rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LogoCircle size="sm" />
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: '#FAF6EC', fontWeight: 700 }}>The Daily Grind</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'rgba(253,248,243,0.6)', fontSize: 14 }}>{currentUser?.name}</span>
          <button onClick={() => nav('/my-orders')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#E8E0D5', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>My Orders</button>
          <button onClick={() => { logout(); nav('/'); }} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#E8E0D5', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Sign Out</button>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: '#2C1200', padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "radial-gradient(circle, rgba(198,139,61,0.07) 1px, transparent 1px)", backgroundSize: '40px 40px' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ color: 'rgba(253,248,243,0.6)', fontSize: 14, marginBottom: 4 }}>Good day,</div>
          <div style={{ color: '#FAF6EC', fontSize: 26, fontFamily: "'Playfair Display',serif", fontWeight: 700, marginBottom: 4 }}>{currentUser?.name?.split(' ')[0] || 'Guest'}</div>
          <div style={{ color: '#C8A800', fontSize: 14, marginBottom: 16 }}>What are you having today?</div>
          <div style={{ position: 'relative', maxWidth: 400, margin: '0 auto' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(253,248,243,0.5)', fontSize: 16 }}>⌕</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search drinks, food…" style={{ width: '100%', padding: '10px 14px 10px 40px', borderRadius: 30, border: 'none', background: 'rgba(255,255,255,0.12)', color: '#FAF6EC', fontSize: 14, outline: 'none' }} />
          </div>
        </div>
      </div>

      <div style={{ padding: '1.5rem 2rem', maxWidth: 960, margin: '0 auto' }}>
        {/* Categories */}
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#9CA3AF', marginBottom: 12 }}>Browse by Category</div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 24, scrollbarWidth: 'none' }}>
          {categories.map(cat => {
            const catName = getCategoryLabel(cat);
            const catId = getCategoryId(cat);
            return (
              <button key={catId} onClick={() => selectCategory(cat)} style={{
                flexShrink: 0, padding: '8px 18px', borderRadius: 20, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.18s', whiteSpace: 'nowrap',
                background: activeCat.id === catId ? '#2C1200' : '#fff',
                color: activeCat.id === catId ? '#FAF6EC' : '#6B7280',
                border: activeCat.id === catId ? '1.5px solid #2C1200' : '1.5px solid #E8E0D5',
              }}>{catName}</button>
            );
          })}
        </div>

        {/* Featured */}
        {featured && (
          <div onClick={() => setSelectedItem(featured)} style={{ background: 'linear-gradient(135deg,#2C1200 0%,#4A2000 100%)', borderRadius: 16, padding: '1.5rem', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', right: 120, top: 10, fontSize: 48, color: 'rgba(198,139,61,0.15)' }}>✦</div>
            <div>
              <div style={{ background: '#C8A800', color: '#fff', fontSize: 11, padding: '3px 8px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase', display: 'inline-block', marginBottom: 8 }}>✦ Today's Favourite</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: '#FAF6EC', marginBottom: 6 }}>{featured.name}</h3>
              <p style={{ color: 'rgba(253,248,243,0.65)', fontSize: 13, marginBottom: 8 }}>{featured.description.substring(0, 70)}…</p>
              <span style={{ color: '#C8A800', fontSize: 18, fontWeight: 700 }}>₹{featured.price}</span>
            </div>
            <div style={{ fontSize: 56, flexShrink: 0 }}>{featured.emoji}</div>
          </div>
        )}

        {/* Items grid */}
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#9CA3AF', marginBottom: 14 }}>
          {activeCat.id === 'All' ? 'All Items' : `${activeCat.name} (${filtered.length})`}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, paddingBottom: 100 }}>
          {filtered.length ? filtered.map(item => (
            <div key={item.id} onClick={() => setSelectedItem(item)} style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', border: '1px solid #E8E0D5', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', height: '100%' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(44,18,0,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div
                style={{
                  height: 140,
                  background: '#FAF6EC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                {item.image ? (
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                ) : (
                  <span style={{ fontSize: 44 }}>{item.emoji}</span>
                )}
              </div>
              <div style={{ padding: '0.8rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                <div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700, color: '#2C1200', marginBottom: 4 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 8, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: '#6B3A1F', fontSize: 15 }}>₹{item.price}</span>
                  {item.tags?.[0] && <span style={{ fontSize: 11, background: '#EEF5EF', color: '#3D7A40', padding: '3px 7px', borderRadius: 4, fontWeight: 600 }}>{item.tags[0]}</span>}
                </div>
              </div>
            </div>
          )) : <div style={{ gridColumn: '1/-1', padding: '2rem', textAlign: 'center', color: '#9CA3AF' }}>No items found.</div>}
        </div>
      </div>

      {/* Cart bar */}
      {totalItems > 0 && (
        <div onClick={() => setShowCart(true)} style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#2C1200', color: '#FAF6EC', padding: '12px 28px', borderRadius: 40, display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 8px 28px rgba(44,18,0,0.25)', cursor: 'pointer', zIndex: 200 }}
          onMouseEnter={e => e.currentTarget.style.background = '#4A2000'}
          onMouseLeave={e => e.currentTarget.style.background = '#2C1200'}
        >
          <span>🛒</span>
          <span style={{ fontWeight: 600 }}>View Order</span>
          <div style={{ background: '#C8A800', color: '#fff', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{totalItems}</div>
          <span style={{ fontWeight: 700 }}>₹{totalPrice}</span>
        </div>
      )}

      {selectedItem && <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} onAdd={handleAdd} />}
      {showCart && <CartModal onClose={() => setShowCart(false)} />}
    </div>
  );
}
