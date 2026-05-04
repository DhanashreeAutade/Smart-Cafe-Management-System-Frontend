import { useEffect, useState } from 'react';
export default function Toast({ message, onDone }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 300); }, 2800);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      position:'fixed', top:80, right:24, zIndex:999,
      background:'#2C1200', color:'#F5EDD0',
      padding:'12px 20px', borderRadius:10, fontSize:14, fontWeight:600,
      boxShadow:'0 4px 20px rgba(44,18,0,0.3)',
      opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(120%)',
      transition:'all 0.3s ease',
    }}>
      <span style={{ color:'#D4A800', marginRight:8 }}>✦</span>{message}
    </div>
  );
}
