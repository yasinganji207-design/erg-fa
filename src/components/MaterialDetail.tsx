import { useEffect } from "react";
import type { Material, ErgGuide } from "../data/hazmat";
import { ASSALOUYEH_MATERIAL_IDS, PPE_LABEL, ergGuides, placardForClass } from "../data/hazmat";
import { NFPADiamond } from "./NFPADiamond";
import { GHSIcon, DOTPlacard, UIIcon } from "./icons";

const ppeColorMap: Record<string, string> = {
  red: "bg-red-500/15 text-red-300 border-red-500/40",
  amber: "bg-amber-500/15 text-amber-300 border-amber-500/40",
  yellow: "bg-yellow-500/15 text-yellow-300 border-yellow-500/40",
  green: "bg-green-500/15 text-green-300 border-green-500/40",
};

function Section({ icon, title, children, tone = "default" }: { icon: string; title: string; children: React.ReactNode; tone?: "default" | "danger" | "warn" | "info" }) {
  const tones: Record<string, string> = {
    default: "border-slate-700/60 bg-slate-900/40",
    danger: "border-red-500/30 bg-red-950/20",
    warn: "border-amber-500/30 bg-amber-950/20",
    info: "border-sky-500/30 bg-sky-950/20",
  };
  return (
    <div className={`rounded-xl border p-4 ${tones[tone]}`}>
      <div className="mb-2 flex items-center gap-2">
        <UIIcon name={icon} className="h-5 w-5 text-slate-300" />
        <h4 className="font-bold text-slate-100">{title}</h4>
      </div>
      <div className="space-y-1.5 text-sm leading-7 text-slate-300">{children}</div>
    </div>
  );
}

function Prop({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 py-2">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="font-mono-num text-sm font-semibold text-slate-200">{value}</p>
    </div>
  );
}

function GuideBlock({ icon, title, items, tone = "default" }: { icon: string; title: string; items: string[]; tone?: "default" | "danger" | "warn" | "info" }) {
  const tones: Record<string, string> = {
    default: "border-slate-700/60 bg-slate-900/40",
    danger: "border-red-500/30 bg-red-950/20",
    warn: "border-amber-500/30 bg-amber-950/20",
    info: "border-sky-500/30 bg-sky-950/20",
  };
  return (
    <div className={`rounded-xl border p-4 ${tones[tone]}`}>
      <div className="mb-2 flex items-center gap-2">
        <UIIcon name={icon} className="h-5 w-5 text-slate-300" />
        <h4 className="font-bold text-slate-100">{title}</h4>
      </div>
      <ul className="space-y-1.5 text-sm leading-7 text-slate-300">
        {items.map((t, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MaterialDetail({ material, onClose, onOpenGuide }: { material: Material; onClose: () => void; onOpenGuide: (n: number) => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const ppe = material.ppe ? PPE_LABEL[material.ppe] : null;
  const guide: ErgGuide | undefined = ergGuides[material.guide];
  const pc = placardForClass(material.hazardClass);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-2 backdrop-blur-sm sm:p-6" onClick={onClose}>
      <div className="print-area fade-up relative my-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-700 bg-[#0a1020] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* نوار بالایی */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-700/60 bg-gradient-to-l from-slate-900 to-slate-800/50 p-5">
          <div className="flex gap-4">
            {material.nfpa ? (
              <NFPADiamond nfpa={material.nfpa} size={92} />
            ) : (
              <div className="grid place-items-center p-1">
                <DOTPlacard number={pc.number} symbol={pc.symbol} bg={pc.bg} fg={pc.fg} size={92} />
              </div>
            )}
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-mono-num text-xs font-bold text-amber-300">UN {material.un}</span>
                <span className="rounded-md border border-slate-600 bg-slate-800 px-2 py-0.5 text-xs text-slate-300">رده {material.hazardClass}</span>
                <span className="rounded-md border border-slate-600 bg-slate-800 px-2 py-0.5 text-xs text-slate-300">{material.state}</span>
              </div>
              <h2 className="text-xl font-black text-white">{material.nameFa}</h2>
              <p className="text-sm text-slate-400" dir="ltr">{material.nameEn}</p>
              <p className="mt-1 text-xs text-slate-500">{material.hazardClassName}</p>
              {ASSALOUYEH_MATERIAL_IDS.has(material.id) && <span className="mt-2 inline-flex rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[11px] font-bold text-cyan-300">مرتبط با مواد/جریان‌های منطقه عسلویه</span>}
            </div>
          </div>
          <div className="no-print flex shrink-0 items-center gap-2">
            <button onClick={() => window.print()} className="flex items-center gap-1.5 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-slate-700 hover:text-white">
              <UIIcon name="print" className="h-4 w-4" />
              <span className="hidden sm:inline">چاپ برگه</span>
            </button>
            <button onClick={onClose} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-slate-600 bg-slate-800 text-slate-300 transition hover:bg-slate-700 hover:text-white" aria-label="بستن">
              <UIIcon name="close" className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(100vh-220px)] space-y-4 overflow-y-auto p-5">
          {/* GHS + PPE */}
          <div className="grid gap-4 md:grid-cols-2">
              {material.ghs?.length ? (
                <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
                  <p className="mb-2 text-xs font-bold text-slate-400">نمادهای خطر GHS</p>
                  <div className="flex flex-wrap gap-2">
                    {material.ghs.map((g) => (
                      <GHSIcon key={g} id={g} className="h-12 w-12" />
                    ))}
                  </div>
                </div>
              ) : null}
              {ppe ? (
                <div className={`rounded-xl border p-4 ${!material.ghs?.length ? "md:col-span-2" : ""} ${ppeColorMap[ppe.color]}`}>
                  <div className="flex items-center gap-2">
                    <UIIcon name="helmet" className="h-5 w-5" />
                    <p className="font-bold">تجهیزات حفاظتی توصیه‌شده</p>
                  </div>
                  <p className="mt-1 text-sm font-bold">سطح {material.ppe}</p>
                  <p className="mt-1 text-xs leading-6 opacity-90">{ppe.desc}</p>
                </div>
              ) : (
                <div className={`rounded-xl border border-slate-700/60 bg-slate-900/40 p-4 ${!material.ghs?.length ? "md:col-span-2" : ""}`}>
                  <div className="flex items-center gap-2">
                    <UIIcon name="helmet" className="h-5 w-5 text-slate-400" />
                    <p className="font-bold text-slate-200">تجهیزات حفاظتی</p>
                  </div>
                  <p className="mt-1 text-xs leading-6 text-slate-400">سطح دقیق PPE را از راهنمای ERG، SDS و دستورالعمل سازمان آتش‌نشانی خود تعیین کنید.</p>
                </div>
              )}
          </div>

          {/* ویژگی‌های فیزیکی */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Prop label="حالت" value={material.state} />
            <Prop label="رفتار بخار" value={material.vapor} />
            <Prop label="نقطه اشتعال" value={material.flashPoint} />
            <Prop label="نقطه جوش" value={material.boilingPoint} />
          </div>

          {/* فاصله‌گذاری TIH */}
          {material.isolation && (
            <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4">
              <div className="mb-3 flex items-center gap-2">
                <UIIcon name="wind" className="h-5 w-5 text-red-300" />
                <h4 className="font-bold text-red-200">فاصله‌گذاری اضطراری (گاز سمی تنفسی)</h4>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-black/30 p-3">
                  <p className="text-xs text-slate-400">ایزوله‌سازی اولیه</p>
                  <p className="text-sm text-slate-300">نشتی کوچک: <span className="font-mono-num font-bold text-red-200">{material.isolation.small}</span></p>
                  <p className="text-sm text-slate-300">نشتی بزرگ: <span className="font-mono-num font-bold text-red-200">{material.isolation.large}</span></p>
                </div>
                {material.protectiveAction && (
                  <div className="rounded-lg bg-black/30 p-3">
                    <p className="mb-1 text-xs text-slate-400">فاصله محافظتی (روز/شب)</p>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                      <p className="text-sm text-slate-300">روز، کوچک: <span className="font-mono-num font-bold text-red-200">{material.protectiveAction.day}</span></p>
                      <p className="text-sm text-slate-300">شب، کوچک: <span className="font-mono-num font-bold text-red-200">{material.protectiveAction.night}</span></p>
                      <p className="text-sm text-slate-300">روز، بزرگ: <span className="font-mono-num font-bold text-red-200">{material.protectiveAction.largeDay}</span></p>
                      <p className="text-sm text-slate-300">شب، بزرگ: <span className="font-mono-num font-bold text-red-200">{material.protectiveAction.largeNight}</span></p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {material.description && <Section icon="flask" title="توصیف" tone="info"><p>{material.description}</p></Section>}

          {/* اطلاعات اختصاصی ماده (در صورت موجود بودن) */}
          {material.health && <Section icon="drop" title="خطر سلامتی" tone="danger"><p>{material.health}</p></Section>}
          {material.fire && <Section icon="fire" title="خطر آتش‌سوزی و انفجار" tone="warn"><p>{material.fire}</p></Section>}
          {material.reactivity && (
            <Section icon="bolt" title="واکنش‌پذیری و ناپایداری">
              <p>{material.reactivity}</p>
              {material.incompatibilities?.length ? (
                <>
                  <p className="pt-1 text-xs text-slate-500">عدم سازگاری:</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {material.incompatibilities.map((c) => (
                      <span key={c} className="rounded border border-slate-600 bg-slate-800 px-2 py-0.5 text-xs text-slate-300">{c}</span>
                    ))}
                  </div>
                </>
              ) : null}
            </Section>
          )}
          {material.spill && <Section icon="shield" title="واکنش به نشتی / ریخت‌وپاش" tone="info"><p>{material.spill}</p></Section>}
          {material.fireResponse && <Section icon="fire" title="واکنش به آتش‌سوزی" tone="warn"><p>{material.fireResponse}</p></Section>}
          {material.firstAid?.length ? (
            <Section icon="assessment" title="کمک‌های اولیه" tone="danger">
              <ul className="space-y-1.5">
                {material.firstAid.map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-red-500/30 text-[10px] font-bold text-red-200">{i + 1}</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          {/* راهنمای واکنش استاندارد ERG — برای همه مواد */}
          {guide && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-amber-600 font-mono-num text-sm font-black text-white">{guide.number}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-amber-300">راهنمای واکنش اضطراری استاندارد (ERG)</p>
                  <p className="truncate text-sm font-bold text-amber-100">{guide.title}</p>
                </div>
              </div>
              <GuideBlock icon="alert" title="خطرات بالقوه" items={guide.potentialHazards} tone="danger" />
              <GuideBlock icon="shield" title="ایمنی عمومی" items={guide.publicSafety} tone="info" />
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <UIIcon name="helmet" className="h-5 w-5 text-amber-300" />
                  <h4 className="font-bold text-amber-200">لباس حفاظتی</h4>
                </div>
                <p className="text-sm leading-7 text-amber-100/90">{guide.protectiveClothing}</p>
              </div>
              <GuideBlock icon="wind" title="تخلیه و فاصله‌گذاری" items={guide.evacuation} tone="warn" />
              <GuideBlock icon="fire" title="واکنش به آتش" items={guide.fire} />
              <GuideBlock icon="drop" title="واکنش به نشتی" items={guide.spill} tone="info" />
              <GuideBlock icon="assessment" title="کمک‌های اولیه" items={guide.firstAid} tone="danger" />
              <button onClick={() => onOpenGuide(material.guide)} className="flex w-full items-center justify-between rounded-xl border border-slate-700 bg-slate-900/60 p-4 text-right transition hover:border-slate-600 hover:bg-slate-900">
                <span className="flex items-center gap-2 text-sm text-slate-300">
                  <UIIcon name="book" className="h-5 w-5 text-amber-300" />
                  باز کردن راهنمای {guide.number} در تب ERG
                </span>
                <UIIcon name="arrow" className="h-5 w-5 text-slate-400" />
              </button>
            </div>
          )}

          {!guide && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-sm leading-7 text-amber-200/90">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <UIIcon name="alert" className="h-5 w-5" />
                راهنمای اختصاصی این ماده در این مرجع موجود نیست.
              </div>
              در حادثه واقعی، شماره راهنمای روی پلاکارد را در راهنمای رسمی ERG بررسی کنید و نظر فرمانده حادثه را ملاک قرار دهید.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
