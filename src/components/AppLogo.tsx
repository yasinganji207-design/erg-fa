// نشان عمومی اپ — لوزی خطر NFPA با شعله، روی زمینه گرادیانی قرمز/نارنجی
function AppMark({ size, gradId }: { size: number; gradId: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="shrink-0" role="img" aria-label="نشان مرجع مواد خطرناک">
      <defs>
        <linearGradient id={`${gradId}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#dc2626" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="14" fill={`url(#${gradId}-bg)`} />
      <g transform="translate(16 16)">
        <svg width="32" height="32" viewBox="0 0 32 32">
          <polygon points="16,3 29,16 16,29 3,16" fill="none" stroke="#fff" strokeWidth="2.2" />
          <path d="M16 9c1.4 2.8-1.4 3.8-1.4 5.6 0 0 1.9-1 1.9-2.8 1.6 1.6 2.6 3.4 2.6 5.4a4.4 4.4 0 1 1-8.8 0c0-2 1.4-3.4 2.4-4.6.5 1.5 2 1.5 2 .4 0-1.8 1.2-2.8 1.3-4z" fill="#fff" />
        </svg>
      </g>
    </svg>
  );
}

export function AppLogo({ size = 40, showText = true, light = false }: { size?: number; showText?: boolean; light?: boolean }) {
  const sub = light ? "text-slate-300" : "text-slate-400";
  const title = light ? "text-white" : "text-slate-100";
  return (
    <div className="flex items-center gap-2.5">
      <AppMark size={size} gradId="appGrad" />
      {showText && (
        <div className="leading-tight">
          <p className={`text-[13px] font-black ${title}`}>مرجع مواد خطرناک</p>
          <p className="font-mono-num text-[10px] font-bold tracking-wide text-amber-400">HAZMAT · ERG Reference</p>
          <p className={`hidden text-[9px] sm:block ${sub}`}>راهنمای واکنش اضطراری</p>
        </div>
      )}
    </div>
  );
}

// نشان عمومی کوچک برای گوشه‌ها
export function AppBadge({ size = 22 }: { size?: number }) {
  return <AppMark size={size} gradId="appGradB" />;
}
