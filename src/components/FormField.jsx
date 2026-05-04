const icons = {
  email: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#9CA3AF" strokeWidth="1.8">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7" strokeLinecap="round"/>
    </svg>
  ),
  password: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#9CA3AF" strokeWidth="1.8">
      <rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4" strokeLinecap="round"/>
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#9CA3AF" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round"/>
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#9CA3AF" strokeWidth="1.8">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" strokeLinecap="round"/>
    </svg>
  ),
};

export default function FormField({ label, type = 'text', icon, placeholder, value, onChange, autoComplete }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display:'block', fontSize:14, fontWeight:700, color:'#2C1800', marginBottom:8 }}>{label}</label>
      <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
        {icon && (
          <span style={{ position:'absolute', left:14, display:'flex', alignItems:'center', pointerEvents:'none' }}>
            {icons[icon]}
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          autoComplete={autoComplete}
          style={{
            width:'100%', padding:'14px 14px 14px 46px',
            background:'#FFFFFF', border:'1.5px solid #E2D08A', borderRadius:10,
            fontSize:15, color:'#2C1200', outline:'none', transition:'border-color 0.2s, box-shadow 0.2s',
          }}
          onFocus={e => { e.target.style.borderColor='#C8A800'; e.target.style.boxShadow='0 0 0 3px rgba(200,168,0,0.15)'; }}
          onBlur={e  => { e.target.style.borderColor='#E2D08A'; e.target.style.boxShadow='none'; }}
        />
      </div>
    </div>
  );
}
