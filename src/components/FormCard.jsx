import LogoCircle from './LogoCircle';

export default function FormCard({ title, subtitle, children }) {
  return (
    <div style={{
      background:'#FEFCE8', border:'1.5px solid #EDD97A', borderRadius:20,
      padding:'40px 40px 36px', width:'100%', maxWidth:560,
      boxShadow:'0 4px 24px rgba(180,140,60,0.1)',
      animation:'slideUp 0.35s ease both',
    }}>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ display:'flex', justifyContent:'center', marginBottom:20 }}>
        <LogoCircle size="md" />
      </div>
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, color:'#2C1200', textAlign:'center', marginBottom:6 }}>
        {title}
      </h2>
      <p style={{ fontSize:14, color:'#6B7280', textAlign:'center', marginBottom:28 }}>{subtitle}</p>
      {children}
    </div>
  );
}
