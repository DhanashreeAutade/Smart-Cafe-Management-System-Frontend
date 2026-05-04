import { useNavigate } from 'react-router-dom';
import LogoCircle from '../components/LogoCircle';

function ChoiceCard({ icon, title, desc, btnLabel, btnStyle, onClick }) {
  return (
    <div onClick={onClick} style={{
      background:'#FEFCE8', border:'1.5px solid #EDD97A', borderRadius:20,
      padding:'32px 28px', cursor:'pointer', transition:'all 0.22s',
      boxShadow:'0 2px 12px rgba(180,140,60,0.08)',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(180,140,60,0.18)'; e.currentTarget.style.borderColor='#C8A800'; }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 12px rgba(180,140,60,0.08)'; e.currentTarget.style.borderColor='#EDD97A'; }}
    >
      <div style={{ width:56, height:56, background:'#E8E0D0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
        {icon}
      </div>
      <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:'#2C1200', marginBottom:10 }}>{title}</h3>
      <p style={{ fontSize:14, color:'#6B7280', lineHeight:1.65, marginBottom:24 }}>{desc}</p>
      <button style={{
        width:'100%', padding:14, borderRadius:10, fontSize:15, fontWeight:700,
        transition:'all 0.2s', ...btnStyle,
      }}
        onMouseEnter={e => { e.target.style.opacity='0.88'; e.target.style.transform='translateY(-1px)'; }}
        onMouseLeave={e => { e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; }}
      >
        {btnLabel}
      </button>
    </div>
  );
}

export default function Landing() {
  const nav = useNavigate();
  return (
    <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'40px 20px', minHeight:'100vh', justifyContent:'center' }}>
      {/* Admin button */}
      <button onClick={() => nav('/admin-login')} style={{
        position:'fixed', top:20, right:24, zIndex:100,
        background:'#1C1008', color:'#F5EDD0', border:'none',
        borderRadius:10, padding:'12px 22px', fontSize:15, fontWeight:700,
        display:'flex', alignItems:'center', gap:8,
        boxShadow:'0 4px 14px rgba(0,0,0,0.25)', transition:'all 0.2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.background='#0f0804'; e.currentTarget.style.transform='translateY(-1px)'; }}
        onMouseLeave={e => { e.currentTarget.style.background='#1C1008'; e.currentTarget.style.transform='translateY(0)'; }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="#C8A800">
          <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z"/>
        </svg>
        Admin Login
      </button>

      <LogoCircle size="lg" />
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:38, fontWeight:700, color:'#2C1200', margin:'28px 0 14px', lineHeight:1.2 }}>
        Welcome to The Daily Grind
      </h1>
      <p style={{ fontSize:16, color:'#6B7280', lineHeight:1.7, maxWidth:580, marginBottom:48 }}>
        Your favorite cafe is now just a click away. Order premium coffee, fresh pastries, and delicious food from the comfort of your home.
      </p>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, width:'100%', maxWidth:820 }}>
        <ChoiceCard
          onClick={() => nav('/register')}
          icon={<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#6B3A1F" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round"/><path d="M19 8v6M16 11h6" strokeLinecap="round"/></svg>}
          title="New Customer?"
          desc="Create an account to start ordering and enjoy exclusive member benefits."
          btnLabel="Create Account"
          btnStyle={{ background:'linear-gradient(135deg,#8B3A00,#2C1200)', color:'#fff', border:'none' }}
        />
        <ChoiceCard
          onClick={() => nav('/login')}
          icon={<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#6B3A1F" strokeWidth="1.8"><rect x="3" y="11" width="18" height="13" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round"/></svg>}
          title="Already a Member?"
          desc="Sign in to access your account and continue where you left off."
          btnLabel="Sign In"
          btnStyle={{ background:'transparent', color:'#6B3A1F', border:'2px solid #6B3A1F' }}
        />
      </div>

      {/* help button */}
      <div style={{ position:'fixed', bottom:24, right:24, width:42, height:42, background:'#fff', border:'1.5px solid #EDD97A', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:700, color:'#6B3A1F', cursor:'pointer', boxShadow:'0 2px 10px rgba(0,0,0,0.1)' }}>?</div>
    </div>
  );
}
