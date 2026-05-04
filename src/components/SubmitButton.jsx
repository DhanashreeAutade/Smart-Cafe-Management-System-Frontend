export default function SubmitButton({ children, onClick, style = {} }) {
  return (
    <button
      onClick={onClick}
      style={{
        width:'100%', padding:'16px',
        background:'linear-gradient(135deg, #8B3A00 0%, #2C1200 100%)',
        color:'#FFFFFF', border:'none', borderRadius:10,
        fontSize:16, fontWeight:700, letterSpacing:'0.3px',
        transition:'all 0.2s', marginTop:4,
        ...style,
      }}
      onMouseEnter={e => { e.target.style.opacity='0.9'; e.target.style.transform='translateY(-1px)'; e.target.style.boxShadow='0 6px 20px rgba(44,18,0,0.3)'; }}
      onMouseLeave={e => { e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; e.target.style.boxShadow='none'; }}
    >
      {children}
    </button>
  );
}
