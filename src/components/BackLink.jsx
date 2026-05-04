export default function BackLink({ onClick }) {
  return (
    <button onClick={onClick} style={{
      display:'inline-flex', alignItems:'center', gap:6,
      color:'#6B3A1F', fontSize:14, fontWeight:600,
      background:'none', border:'none', cursor:'pointer',
      marginBottom:20, transition:'color 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.color='#2C1200'}
      onMouseLeave={e => e.currentTarget.style.color='#6B3A1F'}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 5l-7 7 7 7"/>
      </svg>
      Back
    </button>
  );
}
