import type { GHSPictogram } from "../data/hazmat";

// =============================================================================
// نمادهای GHS (پیکتوگرام‌های خطر)
// هرکدام لوزی قرمز با نماد سیاه/سفید
// =============================================================================

const ghsPaths: Record<GHSPictogram, React.ReactNode> = {
  flame: (
    <>
      <path
        d="M16 5c1 3-1 4-1 6 0 0 2-1 2-4 2 2 3 4.5 3 7a8 8 0 1 1-16 0c0-3 2-5 3-6 .5 2 2 2 2 .5 0-2 2-3 4-5 .5 1.5 2 2 3 1.5z"
        fill="#111827"
      />
    </>
  ),
  oxidizer: (
    <>
      <circle cx="16" cy="17" r="9" fill="none" stroke="#111827" strokeWidth="2.2" />
      <path
        d="M16 10c1.2 2.5-1 3.2-1 4.8 0 0 1.6-.8 1.6-3 1.6 1.6 2.4 3.4 2.4 5.2a5 5 0 1 1-10 0c0-2 1.4-3.4 2.2-4.2.4 1.4 1.6 1.4 1.6.4 0-1.6 1.6-2.4 3.2-3.2z"
        fill="#111827"
      />
    </>
  ),
  bomb: (
    <>
      <circle cx="15" cy="19" r="8.5" fill="none" stroke="#111827" strokeWidth="2.2" />
      <path d="M21 11l2.5-2.5" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M19 8l2.5-2.5M22 13l3-1" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="24" cy="6" r="1.6" fill="#111827" />
      <path d="M23 11l-2-2" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
  corrosion: (
    <>
      <path
        d="M9 8c2 3-1 4-1 7a4 4 0 0 0 8 0c0-2-1-3-1-5"
        fill="none"
        stroke="#111827"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 6l1.6 2.4M14 6l-1.6 2.4M14 6V3" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" />
      <path
        d="M21 9c2 2 .5 3 .5 5"
        fill="none"
        stroke="#111827"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M20.5 7l1.2 1.8M20.5 7l-1.2 1.8" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 22h20" stroke="#111827" strokeWidth="0" />
    </>
  ),
  gas: (
    <>
      <rect x="10" y="6" width="12" height="20" rx="6" fill="none" stroke="#111827" strokeWidth="2.2" />
      <rect x="13.5" y="3" width="5" height="3.4" rx="1" fill="#111827" />
      <path d="M14.5 9.5h3" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  healthHazard: (
    <>
      <path
        d="M16 7v0M16 7c0 0-3 4-3 7a3 3 0 0 0 6 0c0-3-3-7-3-7z"
        fill="none"
        stroke="#111827"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M16 7l-1.4-2.2M16 7l1.4-2.2" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
      <path d="M9.5 20a6.5 6.5 0 0 1 13 0" fill="none" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
  skull: (
    <>
      <path
        d="M8 16a8 8 0 1 1 16 0c0 2.5-1 4-2.5 5v3.5h-11V21c-1.5-1-2.5-2.5-2.5-5z"
        fill="#111827"
      />
      <circle cx="12.5" cy="15.5" r="2.1" fill="#fff" />
      <circle cx="19.5" cy="15.5" r="2.1" fill="#fff" />
      <path d="M14.5 20.5h3M14 23.5v1.5M16 23.5v1.5M18 23.5v1.5" stroke="#111827" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  exclamation: (
    <>
      <path d="M16 6.5v10" stroke="#111827" strokeWidth="2.8" strokeLinecap="round" />
      <circle cx="16" cy="21.5" r="1.6" fill="#111827" />
    </>
  ),
  environment: (
    <>
      <path
        d="M16 7c-4 4-6 6.5-6 10a6 6 0 0 0 12 0c0-3.5-2-6-6-10z"
        fill="none"
        stroke="#111827"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M16 24V12" stroke="#111827" strokeWidth="1.8" />
      <path d="M16 16c-1.5 0-2.5-1-2.5-2.2M16 16c1.5 0 2.5-1 2.5-2.2M16 20c-2 0-3.5-1.2-3.5-3M16 20c2 0 3.5-1.2 3.5-3" stroke="#111827" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </>
  ),
};

export function GHSIcon({ id, className = "" }: { id: GHSPictogram; className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} role="img" aria-label={id}>
      <rect x="1.5" y="1.5" width="29" height="29" rx="2" transform="rotate(45 16 16)" fill="#fff" stroke="#dc2626" strokeWidth="3" />
      {ghsPaths[id]}
    </svg>
  );
}

// =============================================================================
// نمادهای پلاکارد DOT (شکل لوزی با نماد)
// =============================================================================

export function PlacardSymbol({ symbol, className = "" }: { symbol: string; className?: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (symbol) {
    case "bomb":
      return (
        <svg viewBox="0 0 48 48" className={className}>
          <circle cx="20" cy="30" r="13" {...common} />
          <path d="M30 18l6-6M26 14l7-7M33 23l8-3" {...common} />
          <circle cx="42" cy="11" r="2.4" fill="currentColor" />
          <path d="M32 22l-3-4" {...common} />
        </svg>
      );
    case "flame":
      return (
        <svg viewBox="0 0 48 48" className={className}>
          <path
            d="M24 8c2 5-3 7-3 11 0 0 3-2 3-6 3 3 5 7 5 11a8 8 0 1 1-16 0c0-5 4-8 6-10 1 3 3 3 3 1 0-3 2-5 2-7z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );
    case "oxidizer":
      return (
        <svg viewBox="0 0 48 48" className={className}>
          <circle cx="24" cy="27" r="13" {...common} />
          <path d="M24 16c2 4-2 5-2 8 0 0 2.5-1.2 2.5-4 2.5 2.5 4 5 4 8a8 8 0 1 1-13 0c0-3 2-5 3-7 .6 2 2.5 2 2.5.6 0-2.5 2.5-4 3-5.6z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "gas":
      return (
        <svg viewBox="0 0 48 48" className={className}>
          <rect x="15" y="20" width="18" height="22" rx="9" {...common} />
          <rect x="20" y="14" width="8" height="6" rx="1.5" fill="currentColor" stroke="none" />
          <path d="M21 26h6" {...common} />
        </svg>
      );
    case "skull":
      return (
        <svg viewBox="0 0 48 48" className={className}>
          <path d="M11 26a13 13 0 1 1 26 0c0 4-2 7-4 8.5v6h-18v-6c-2-1.5-4-4.5-4-8.5z" fill="currentColor" stroke="none" />
          <circle cx="18" cy="25" r="3.2" fill="#fff" />
          <circle cx="30" cy="25" r="3.2" fill="#fff" />
          <path d="M22 34h4" stroke="#fff" strokeWidth="1.6" />
        </svg>
      );
    case "radiation":
      return (
        <svg viewBox="0 0 48 48" className={className}>
          <circle cx="24" cy="24" r="3.5" fill="currentColor" />
          <path d="M24 24l-9-7A13 13 0 0 1 37 24h-11z M24 24l9-7A13 13 0 0 1 24 37V26z M24 24l-9-7A13 13 0 0 0 11 24h13z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "corrosion":
      return (
        <svg viewBox="0 0 48 48" className={className}>
          <path d="M14 13c3 5-1.5 6.5-1.5 11a6 6 0 0 0 12 0c0-3.5-1.5-5-1.5-8" {...common} />
          <path d="M20 9l2.5 4M20 9l-2.5 4M20 9V4" {...common} />
          <path d="M30 14c2.5 3 1 4.5 1 7" {...common} />
          <path d="M31 10l1.8 3M31 10l-1.8 3" {...common} />
        </svg>
      );
    case "misc":
      return (
        <svg viewBox="0 0 48 48" className={className}>
          <path d="M16 14h10l8 8v12h-18z" {...common} />
          <path d="M26 14v8h8" {...common} />
          <path d="M21 30h6M21 34h6" {...common} />
        </svg>
      );
    default:
      return null;
  }
}

// پلاکارد لوزی کامل DOT
export function DOTPlacard({
  number,
  symbol,
  bg,
  fg = "#000",
  className = "",
  size = 96,
}: {
  number: string;
  symbol: string;
  bg: string;
  fg?: string;
  className?: string;
  size?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      <polygon points="50,4 96,50 50,96 4,50" fill={bg} stroke={fg} strokeWidth="3" />
      <svg x="26" y="13" width="48" height="48" viewBox="0 0 48 48" style={{ color: fg }}>
        <PlacardSymbol symbol={symbol} />
      </svg>
      <text x="50" y="86" textAnchor="middle" fontSize="20" fontWeight="800" fill={fg} fontFamily="system-ui">
        {number}
      </text>
    </svg>
  );
}

// =============================================================================
// آیکون‌های رابط کاربری
// =============================================================================

export function UIIcon({ name, className = "" }: { name: string; className?: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "search":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>);
    case "shield":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" /><path d="m9 12 2 2 4-4" /></svg>);
    case "wind":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="M3 8h11a3 3 0 1 0-3-3" /><path d="M3 12h15a3 3 0 1 1-3 3" /><path d="M3 16h9a3 3 0 1 1-3 3" /></svg>);
    case "assessment":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="M4 20V10M10 20V4M16 20v-6M22 20H2" /></svg>);
    case "helmet":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="M3 16a9 9 0 0 1 18 0" /><path d="M3 16h18v2H3z" /><path d="M12 4v3" /><path d="M12 7c2 0 3 1 3 2H9c0-1 1-2 3-2z" /></svg>);
    case "recycle":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="M7 19h10l-2 2M7 19l-2-2M17 5l3 5h-4l2-2" /><path d="m20 10-3 5M4 10l3-5 3 5M4 10l3 5" /></svg>);
    case "gavel":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="m14 4 6 6M11 7l6 6M9 9 15 3M8 12l4 4M4 16l6 6M3 21h10" /></svg>);
    case "fire":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="M12 2c1 4-3 5-3 8 0 0 3-2 3-4 2 2 4 4 4 7a6 6 0 1 1-12 0c0-4 3-6 5-8 .6 2 3 2 3 0 0-2 1-3 0-3z" /></svg>);
    case "alert":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="M12 3 2 20h20L12 3z" /><path d="M12 10v4M12 17v.5" /></svg>);
    case "phone":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 12l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" /></svg>);
    case "close":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>);
    case "menu":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>);
    case "book":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z" /><path d="M4 19a2 2 0 0 1 2-2h12" /></svg>);
    case "grid":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>);
    case "diamond":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="M12 2 22 12 12 22 2 12 12 2z" /><path d="M12 7v10M7 12h10" /></svg>);
    case "flask":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="M9 3h6M10 3v6L5 18a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" /><path d="M7.5 14h9" /></svg>);
    case "list":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>);
    case "arrow":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
    case "drop":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" /></svg>);
    case "bolt":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" /></svg>);
    case "print":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="7" rx="1" /></svg>);
    case "star":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="M12 3.5l2.7 5.5 6 .9-4.3 4.2 1 6L12 17.7 6.6 20.6l1-6L3.3 9.9l6-.9z" /></svg>);
    case "ai":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z" /><path d="M18.5 14.5l.9 2 2 .9-2 .9-.9 2-.9-2-2-.9 2-.9z" /><circle cx="6.5" cy="16.5" r="1.4" /></svg>);
    case "send":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="M4 12l16-8-6 16-3-6z" /><path d="M11 14l4-4" /></svg>);
    case "doc":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="M6 2h8l6 6v14H6z" /><path d="M14 2v6h6" /><path d="M9 13h6M9 17h6M9 9h2" /></svg>);
    case "sun":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" /></svg>);
    case "moon":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" /></svg>);
    case "gear":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>);
    case "wifiOff":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="M2 2l20 20M8.5 16.5a5 5 0 0 1 7 0M5 12.5a10 10 0 0 1 3.5-2.3M19 12.5a10 10 0 0 0-3.3-2.2M12 20h.01M9 8.5A14 14 0 0 1 12 8c1 0 2 .1 3 .3" /></svg>);
    case "cloud":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="M7 18a4.5 4.5 0 0 1-.5-8.97A5.5 5.5 0 0 1 17 8.5a4 4 0 0 1-1 7.5H7z" /></svg>);
    case "key":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><circle cx="8" cy="15" r="4" /><path d="M10.5 12.5 20 3M17 6l2 2M13.5 9.5l2 2" /></svg>);
    case "trash":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14" /></svg>);
    case "eye":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z" /><circle cx="12" cy="12" r="3" /></svg>);
    case "eyeOff":
      return (<svg viewBox="0 0 24 24" className={className} {...p}><path d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.2 4.2M9.9 5.1A10.9 10.9 0 0 1 12 5c7 0 10.5 7 10.5 7a13.4 13.4 0 0 1-3.1 4M6.1 6.6C3.2 8.3 1.5 12 1.5 12s3.5 7 10.5 7c1.4 0 2.6-.3 3.7-.7" /></svg>);
    default:
      return null;
  }
}
