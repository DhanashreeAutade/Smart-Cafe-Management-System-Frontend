const CupSVG = ({ size = 60, fill = '#F5EDD0' }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <rect x="14" y="28" width="36" height="26" rx="4" fill={fill}/>
    <path d="M50 36h6a6 6 0 010 12h-6" fill="none" stroke={fill} strokeWidth="2.5" strokeLinecap="round"/>
    <rect x="20" y="22" width="4" height="8" rx="2" fill={fill}/>
    <rect x="30" y="18" width="4" height="12" rx="2" fill={fill}/>
    <rect x="40" y="22" width="4" height="8" rx="2" fill={fill}/>
  </svg>
);

export default function LogoCircle({ size = 'lg' }) {
  const dim  = size === 'lg' ? 120 : size === 'md' ? 72 : 52;
  const icon = size === 'lg' ? 60  : size === 'md' ? 34 : 26;
  const glow = size === 'lg'
    ? '0 0 0 6px rgba(212,168,0,0.25), 0 0 0 12px rgba(212,168,0,0.08), 0 8px 32px rgba(44,18,0,0.3)'
    : '0 0 0 4px rgba(212,168,0,0.22), 0 0 0 8px rgba(212,168,0,0.07), 0 4px 18px rgba(44,18,0,0.25)';

  return (
    <div style={{
      width: dim, height: dim,
      background: 'radial-gradient(circle at 35% 35%, #6B3015, #3D1A00)',
      borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: glow,
      animation: size === 'lg' ? 'float 3s ease-in-out infinite' : undefined,
      flexShrink: 0,
    }}>
      <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }`}</style>
      <CupSVG size={icon} />
    </div>
  );
}
