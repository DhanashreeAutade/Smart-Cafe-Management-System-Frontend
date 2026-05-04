export default function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <div style={{
      background:'#FEF2F2', border:'1px solid #FCA5A5', color:'#B91C1C',
      borderRadius:8, padding:'10px 14px', fontSize:13, marginBottom:16,
      animation:'slideUp 0.2s ease',
    }}>
      {message}
    </div>
  );
}
