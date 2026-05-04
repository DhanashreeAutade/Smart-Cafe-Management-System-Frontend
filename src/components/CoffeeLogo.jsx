import styles from './CoffeeLogo.module.css';

export default function CoffeeLogo({ size = 'lg' }) {
  const dim = size === 'lg' ? 120 : 72;
  const iconSize = size === 'lg' ? 60 : 34;

  return (
    <div className={`${styles.circle} ${size === 'lg' ? styles.large : styles.small}`}>
      <svg width={iconSize} height={iconSize} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <rect x="14" y="28" width="36" height="26" rx="4" fill="#F5EDD0"/>
        <path d="M50 36h6a6 6 0 010 12h-6" fill="none" stroke="#F5EDD0" strokeWidth="2.5" strokeLinecap="round"/>
        <rect x="20" y="22" width="4" height="8" rx="2" fill="#F5EDD0"/>
        <rect x="30" y="18" width="4" height="12" rx="2" fill="#F5EDD0"/>
        <rect x="40" y="22" width="4" height="8" rx="2" fill="#F5EDD0"/>
      </svg>
    </div>
  );
}
