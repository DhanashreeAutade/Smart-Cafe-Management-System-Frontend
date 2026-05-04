import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMenu } from '../context/MenuContext';
import { useCart } from '../context/CartContext';
import LogoCircle from '../components/LogoCircle';
import Toast from '../components/Toast';

function ItemModal({ item, onClose, onAdd }) {
  const [qty, setQty] = useState(1);
  if (!item) return null;
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(26,15,10,0.55)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:'#fff', borderRadius:20, width:'100%', maxWidth:480, maxHeight:'90vh', overflowY:'auto', position:'relative', animation:'slideUp 0.3s ease' }}>
        <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <button onClick={onClose} style={{ position:'absolute', top:14, right:14, width:32, height:32, borderRadius:'50%', background:'#F0EDE9', border:'none', cursor:'pointer', fontSize:16, color:'#6B7280', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1 }}>✕</button>
        <div style={{ height:180, background:'#FAF6EC', display:'flex', alignItems:'center', justifyContent:'center', fontSize:80, borderRadius:'20px 20px 0 0' }}>{item.emoji}</div>
        <div style={{ padding:'1.5rem' }}>
          <div style={{ fontSize:12, textTransform:'uppercase', letterSpacing:'0.8px', color:'#C8A800', fontWeight:700, marginBottom:6 }}>{item.category}</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:'#2C1200', marginBottom:10 }}>{item.name}</h2>
          <p style={{ color:'#6B7280', fontSize:14, lineHeight:1.65, marginBottom:14 }}>{item.description}</p>
          <div style={{ display:'flex', gap:6, marginBottom:20, flexWrap:'wrap' }}>
            {(item.tags||[]).map(t => <span key={t} style={{ background:'#FAF6EC', border:'1px solid #E8E0D5', padding:'4px 10px', borderRadius:6, fontSize:12, color:'#6B7280' }}>{t}</span>)}
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:28, color:'#2C1200' }}>₹{item.price}</span>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <button onClick={() => setQty(q => Math.max(1,q-1))} style={{ width:34, height:34, borderRadius:'50%', border:'1.5px solid #E8E0D5', background:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#2C1200' }}>−</button>
              <span style={{ fontWeight:700, fontSize:16, minWidth:24, textAlign:'center' }}>{qty}</span>
              <button onClick={() => setQty(q => q+1)} style={{ width:34, height:34, borderRadius:'50%', border:'1.5px solid #E8E0D5', background:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#2C1200' }}>+</button>
            </div>
            <button onClick={() => onAdd(item, qty)} style={{ flex:1, padding:'12px 0', background:'linear-gradient(135deg,#8B3A00,#2C1200)', color:'#fff', border:'none', borderRadius:10, fontSize:15, fontWeight:700, cursor:'pointer' }}>
              Add to Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartModal({ onClose }) {
  const { cart, removeFromCart, clearCart, totalPrice } = useCart();
  const [ordered, setOrdered] = useState(false);
  if (ordered) return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(26,15,10,0.55)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:'#FEFCE8', borderRadius:20, padding:40, maxWidth:400, width:'100%', textAlign:'center' }}>
        <div style={{ fontSize:56, marginBottom:16 }}>✅</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:'#2C1200', marginBottom:8 }}>Order Placed!</h2>
        <p style={{ color:'#6B7280', marginBottom:24 }}>Your order is being prepared. Ready in 8–12 mins.</p>
        <button onClick={onClose} style={{ padding:'12px 32px', background:'linear-gradient(135deg,#8B3A00,#2C1200)', color:'#fff', border:'none', borderRadius:10, fontSize:15, fontWeight:700, cursor:'pointer' }}>Back to Menu</button>
      </div>
    </div>
  );
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(26,15,10,0.55)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:'#fff', borderRadius:20, width:'100%', maxWidth:480, maxHeight:'85vh', overflowY:'auto', padding:'1.5rem', position:'relative' }}>
        <button onClick={onClose} style={{ position:'absolute', top:14, right:14, width:32, height:32, borderRadius:'50%', background:'#F0EDE9', border:'none', cursor:'pointer', fontSize:16, color:'#6B7280' }}>✕</button>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:'#2C1200', marginBottom:20 }}>Your Order</h2>
        {cart.length === 0 ? <p style={{ color:'#9CA3AF', textAlign:'center', padding:'2rem 0' }}>Your order is empty.</p> :
          cart.map(item => (
            <div key={item.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 0', borderBottom:'1px solid #F0EDE9' }}>
              <span style={{ fontSize:28 }}>{item.emoji}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, color:'#2C1200' }}>{item.name} × {item.qty}</div>
                <div style={{ fontSize:13, color:'#9CA3AF' }}>₹{item.price * item.qty}</div>
              </div>
              <button onClick={() => removeFromCart(item.id)} style={{ color:'#EF4444', background:'none', border:'none', fontSize:13, cursor:'pointer', fontWeight:600 }}>Remove</button>
            </div>
          ))
        }
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:16, fontFamily:"'Playfair Display',serif", fontSize:20 }}>
          <span>Total</span><span>₹{totalPrice}</span>
        </div>
        <button onClick={() => { clearCart(); setOrdered(true); }} style={{ width:'100%', marginTop:16, padding:16, background:'linear-gradient(135deg,#8B3A00,#2C1200)', color:'#fff', border:'none', borderRadius:10, fontSize:16, fontWeight:700, cursor:'pointer' }}>
          Place Order ✦
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
  const [activeCat, setActiveCat] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [toast, setToast] = useState('');

  const filtered = items.filter(i =>
    (activeCat === 'All' || i.category === activeCat) &&
    (!search || i.name.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase()))
  );
  const featured = activeCat === 'All' ? items.find(i => i.featured) : null;

  const handleAdd = (item, qty) => {
    addToCart(item, qty);
    setSelectedItem(null);
    setToast(`${item.name} added to order`);
  };

  return (
    <div style={{ position:'relative', zIndex:1, minHeight:'100vh' }}>
      {toast && <Toast message={toast} onDone={() => setToast('')} />}

      {/* Topbar */}
      <div style={{ background:'#2C1200', padding:'0 2rem', height:60, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <LogoCircle size="sm" />
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:'#FAF6EC', fontWeight:700 }}>The Daily Grind</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ color:'rgba(253,248,243,0.6)', fontSize:14 }}>{currentUser?.name}</span>
          <button onClick={() => { logout(); nav('/'); }} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.2)', color:'#E8E0D5', borderRadius:8, padding:'8px 16px', fontSize:14, fontWeight:500, cursor:'pointer' }}>Sign Out</button>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background:'#2C1200', padding:'2rem', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:"radial-gradient(circle, rgba(198,139,61,0.07) 1px, transparent 1px)", backgroundSize:'40px 40px' }}/>
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ color:'rgba(253,248,243,0.6)', fontSize:14, marginBottom:4 }}>Good day,</div>
          <div style={{ color:'#FAF6EC', fontSize:26, fontFamily:"'Playfair Display',serif", fontWeight:700, marginBottom:4 }}>{currentUser?.name?.split(' ')[0] || 'Guest'}</div>
          <div style={{ color:'#C8A800', fontSize:14, marginBottom:16 }}>What are you having today?</div>
          <div style={{ position:'relative', maxWidth:400, margin:'0 auto' }}>
            <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'rgba(253,248,243,0.5)', fontSize:16 }}>⌕</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search drinks, food…" style={{ width:'100%', padding:'10px 14px 10px 40px', borderRadius:30, border:'none', background:'rgba(255,255,255,0.12)', color:'#FAF6EC', fontSize:14, outline:'none' }} />
          </div>
        </div>
      </div>

      <div style={{ padding:'1.5rem 2rem', maxWidth:960, margin:'0 auto' }}>
        {/* Categories */}
        <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'#9CA3AF', marginBottom:12 }}>Browse by Category</div>
        <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:8, marginBottom:24, scrollbarWidth:'none' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)} style={{
              flexShrink:0, padding:'8px 18px', borderRadius:20, fontSize:14, fontWeight:600, cursor:'pointer', transition:'all 0.18s', whiteSpace:'nowrap',
              background: activeCat === cat ? '#2C1200' : '#fff',
              color: activeCat === cat ? '#FAF6EC' : '#6B7280',
              border: activeCat === cat ? '1.5px solid #2C1200' : '1.5px solid #E8E0D5',
            }}>{cat}</button>
          ))}
        </div>

        {/* Featured */}
        {featured && (
          <div onClick={() => setSelectedItem(featured)} style={{ background:'linear-gradient(135deg,#2C1200 0%,#4A2000 100%)', borderRadius:16, padding:'1.5rem', marginBottom:24, display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', overflow:'hidden', position:'relative' }}>
            <div style={{ position:'absolute', right:120, top:10, fontSize:48, color:'rgba(198,139,61,0.15)' }}>✦</div>
            <div>
              <div style={{ background:'#C8A800', color:'#fff', fontSize:11, padding:'3px 8px', borderRadius:4, fontWeight:700, textTransform:'uppercase', display:'inline-block', marginBottom:8 }}>✦ Today's Favourite</div>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:'#FAF6EC', marginBottom:6 }}>{featured.name}</h3>
              <p style={{ color:'rgba(253,248,243,0.65)', fontSize:13, marginBottom:8 }}>{featured.description.substring(0,70)}…</p>
              <span style={{ color:'#C8A800', fontSize:18, fontWeight:700 }}>₹{featured.price}</span>
            </div>
            <div style={{ fontSize:56, flexShrink:0 }}>{featured.emoji}</div>
          </div>
        )}

        {/* Items grid */}
        <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'#9CA3AF', marginBottom:14 }}>
          {activeCat === 'All' ? 'All Items' : `${activeCat} (${filtered.length})`}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:16, paddingBottom:100 }}>
          {filtered.length ? filtered.map(item => (
            <div key={item.id} onClick={() => setSelectedItem(item)} style={{ background:'#fff', borderRadius:12, overflow:'hidden', cursor:'pointer', border:'1px solid #E8E0D5', transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(44,18,0,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
            >
              <div style={{ height:110, background:'#FAF6EC', display:'flex', alignItems:'center', justifyContent:'center', fontSize:44 }}>{item.emoji}</div>
              <div style={{ padding:'0.8rem' }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700, color:'#2C1200', marginBottom:4 }}>{item.name}</div>
                <div style={{ fontSize:12, color:'#9CA3AF', marginBottom:8, lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{item.description}</div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontWeight:700, color:'#6B3A1F', fontSize:15 }}>₹{item.price}</span>
                  {item.tags?.[0] && <span style={{ fontSize:11, background:'#EEF5EF', color:'#3D7A40', padding:'3px 7px', borderRadius:4, fontWeight:600 }}>{item.tags[0]}</span>}
                </div>
              </div>
            </div>
          )) : <div style={{ gridColumn:'1/-1', padding:'2rem', textAlign:'center', color:'#9CA3AF' }}>No items found.</div>}
        </div>
      </div>

      {/* Cart bar */}
      {totalItems > 0 && (
        <div onClick={() => setShowCart(true)} style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', background:'#2C1200', color:'#FAF6EC', padding:'12px 28px', borderRadius:40, display:'flex', alignItems:'center', gap:14, boxShadow:'0 8px 28px rgba(44,18,0,0.25)', cursor:'pointer', zIndex:200 }}
          onMouseEnter={e => e.currentTarget.style.background='#4A2000'}
          onMouseLeave={e => e.currentTarget.style.background='#2C1200'}
        >
          <span>🛒</span>
          <span style={{ fontWeight:600 }}>View Order</span>
          <div style={{ background:'#C8A800', color:'#fff', width:24, height:24, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700 }}>{totalItems}</div>
          <span style={{ fontWeight:700 }}>₹{totalPrice}</span>
        </div>
      )}

      {selectedItem && <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} onAdd={handleAdd} />}
      {showCart && <CartModal onClose={() => setShowCart(false)} />}
    </div>
  );
}
