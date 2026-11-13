import type { NFPA } from "../data/hazmat";

const COLORS = {
  health: "#2b5cd6", // آبی — سلامت
  flammability: "#e23b2e", // قرمز — قابل اشتعال
  instability: "#f5c518", // زرد — ناپایداری
  special: "#ffffff", // سفید — خطر ویژه
};

// لوزی NFPA 704 — نمایش صحیح با چرخش ۴۵ درجه
export function NFPADiamond({
  nfpa,
  size = 160,
  showLabels = true,
}: {
  nfpa: NFPA;
  size?: number;
  showLabels?: boolean;
}) {
  const special = nfpa.special ?? "";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="select-none">
      <g transform="rotate(45 50 50)">
        {/* نقشه پس از چرخش ۴۵°: بالا-چپ→بالا، بالا-راست→راست، پایین-چپ→چپ، پایین-راست→پایین */}
        {/* بالا-چپ → بالا (قابل اشتعال - قرمز) */}
        <rect x="3" y="3" width="47" height="47" fill={COLORS.flammability} stroke="#0f172a" strokeWidth="1.5" />
        {/* بالا-راست → راست (ناپایداری - زرد) */}
        <rect x="50" y="3" width="47" height="47" fill={COLORS.instability} stroke="#0f172a" strokeWidth="1.5" />
        {/* پایین-چپ → چپ (سلامت - آبی) */}
        <rect x="3" y="50" width="47" height="47" fill={COLORS.health} stroke="#0f172a" strokeWidth="1.5" />
        {/* پایین-راست → پایین (خطر ویژه - سفید) */}
        <rect x="50" y="50" width="47" height="47" fill={COLORS.special} stroke="#0f172a" strokeWidth="1.5" />

        {/* برچسب‌های کوچک */}
        {showLabels && (
          <>
            <g transform="rotate(-45 26.5 26.5)">
              <text x="26.5" y="17" textAnchor="middle" fontSize="5" fontWeight="700" fill="#fff">FIRE</text>
            </g>
            <g transform="rotate(-45 73.5 26.5)">
              <text x="73.5" y="17" textAnchor="middle" fontSize="5" fontWeight="700" fill="#0f172a">REACT</text>
            </g>
            <g transform="rotate(-45 26.5 73.5)">
              <text x="26.5" y="64" textAnchor="middle" fontSize="5" fontWeight="700" fill="#fff">HEALTH</text>
            </g>
            <g transform="rotate(-45 73.5 73.5)">
              <text x="73.5" y="64" textAnchor="middle" fontSize="5" fontWeight="700" fill="#0f172a">SPEC</text>
            </g>
          </>
        )}

        {/* اعداد (چرخش معکوس برای خوانایی) */}
        <g transform="rotate(-45 26.5 26.5)">
          <text x="26.5" y="37" textAnchor="middle" fontSize="22" fontWeight="900" fill="#fff">{nfpa.flammability}</text>
        </g>
        <g transform="rotate(-45 73.5 26.5)">
          <text x="73.5" y="37" textAnchor="middle" fontSize="22" fontWeight="900" fill="#0f172a">{nfpa.instability}</text>
        </g>
        <g transform="rotate(-45 26.5 73.5)">
          <text x="26.5" y="83" textAnchor="middle" fontSize="22" fontWeight="900" fill="#fff">{nfpa.health}</text>
        </g>
        <g transform="rotate(-45 73.5 73.5)">
          <text x="73.5" y="83" textAnchor="middle" fontSize="13" fontWeight="900" fill="#0f172a">{special || "—"}</text>
        </g>
      </g>
    </svg>
  );
}

// سلول تک‌رنگ با توضیح (برای بخش آموزشی)
export function NFPALegend({
  color,
  label,
  desc,
  scale,
}: {
  color: string;
  label: string;
  desc: string;
  scale: string[];
}) {
  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-4">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-md text-sm font-black text-white shadow-inner" style={{ background: color }}>
          ۰-۴
        </span>
        <div>
          <p className="font-bold text-slate-100">{label}</p>
          <p className="text-xs text-slate-400">{desc}</p>
        </div>
      </div>
      <ol className="mt-3 space-y-1 text-xs text-slate-300">
        {scale.map((s, i) => (
          <li key={i} className="flex gap-2">
            <span className="font-mono font-bold" style={{ color }}>{i}</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export const NFPA_COLORS = COLORS;
