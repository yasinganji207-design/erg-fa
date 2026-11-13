import { useMemo, useState } from "react";
import { UIIcon } from "./icons";
import { PPE_LABEL } from "../data/hazmat";

const fmt = (n: number, d = 0) =>
  Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d }) : "—";

function Field({ label, unit, value, onChange, step = 1, min = 0 }: { label: string; unit?: string; value: number; onChange: (v: number) => void; step?: number; min?: number }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-slate-400">{label}</span>
      <div className="flex items-center rounded-lg border border-slate-700 bg-slate-900 focus-within:border-amber-500">
        <input
          type="number"
          value={Number.isFinite(value) ? value : ""}
          step={step}
          min={min}
          onChange={(e) => {
            const parsed = parseFloat(e.target.value);
            onChange(Number.isFinite(parsed) ? Math.max(min, parsed) : Number.NaN);
          }}
          className="w-full bg-transparent px-3 py-2 font-mono-num text-sm text-white outline-none"
        />
        {unit && <span className="px-2 text-xs text-slate-500">{unit}</span>}
      </div>
    </label>
  );
}

function Result({ label, value, unit, tone = "default" }: { label: string; value: string; unit?: string; tone?: "default" | "hi" }) {
  return (
    <div className={`rounded-lg border p-3 ${tone === "hi" ? "border-red-500/40 bg-red-950/30" : "border-slate-700/60 bg-slate-900/60"}`}>
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className={`font-mono-num text-lg font-black ${tone === "hi" ? "text-red-300" : "text-white"}`}>
        {value} {unit && <span className="text-xs font-medium text-slate-500">{unit}</span>}
      </p>
    </div>
  );
}

function Disclaimer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 rounded-lg border border-amber-500/30 bg-amber-950/20 p-3 text-[11px] leading-6 text-amber-200/80">
      <UIIcon name="alert" className="h-4 w-4 shrink-0 text-amber-400" />
      <span>{children}</span>
    </div>
  );
}

/* =================== ویزارد تعیین سطح PPE =================== */

type YesNo = "yes" | "no" | null;
type Level3 = "high" | "moderate" | "low" | null;

// identified: آیا هویت ماده مشخص است؟ ("yes" = شناسایی شده)
function ppeDecision(identified: YesNo, confined: YesNo, resp: Level3, skin: Level3): { level: "A" | "B" | "C" | "D" | null; reasons: string[] } {
  if (!identified || !confined || !resp || !skin) return { level: null, reasons: [] };
  const reasons: string[] = [];
  if (identified === "no") {
    reasons.push("ماده هنوز شناسایی نشده — طبق دستورالعمل HAZWOPER تا شناسایی کامل، بالاترین سطح حفاظت اعمال می‌شود.");
    return { level: "A", reasons };
  }
  if (confined === "yes") {
    reasons.push("ورود به فضای بسته یا اتمسفر نامشخص/کمبود اکسیژن نیازمند بالاترین سطح حفاظت است.");
    return { level: "A", reasons };
  }
  if (resp === "high" && skin === "high") {
    reasons.push("خطر تنفسی بالا (IDLH یا غلظت نامشخص) همراه با خطر جدی تماس پوستی/چشمی — نیاز به لباس کاملاً محصورشونده.");
    return { level: "A", reasons };
  }
  if (resp === "high") {
    reasons.push("خطر تنفسی بالا نیازمند SCBA است؛ خطر پوستی به‌تنهایی به سطح محصورشونده کامل نیاز ندارد.");
    return { level: "B", reasons };
  }
  if (skin === "high") {
    reasons.push("خطر جدی تماس پوستی/چشمی (خورنده یا جذب‌شونده) نیازمند لباس ضدپاشش کامل و SCBA است.");
    return { level: "B", reasons };
  }
  if (resp === "moderate") {
    reasons.push("آلاینده و غلظت آن شناخته‌شده و در محدوده قابل فیلتر — ماسک تصفیه‌کننده هوا (APR) کافی است.");
    return { level: "C", reasons };
  }
  reasons.push("خطر تنفسی و پوستی قابل‌توجهی شناسایی نشد — لباس کار معمولی کافی است.");
  return { level: "D", reasons };
}

function ChoiceGroup<T extends string>({ options, value, onChange }: { options: { v: T; label: string }[]; value: T | null; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-bold transition ${
            value === o.v ? "border-amber-500 bg-amber-500/15 text-amber-300" : "border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function PpeWizard() {
  const [identified, setIdentified] = useState<YesNo>(null);
  const [confined, setConfined] = useState<YesNo>(null);
  const [resp, setResp] = useState<Level3>(null);
  const [skin, setSkin] = useState<Level3>(null);

  const result = useMemo(() => ppeDecision(identified, confined, resp, skin), [identified, confined, resp, skin]);
  const label = result.level ? PPE_LABEL[result.level] : null;
  const toneClass: Record<string, string> = {
    red: "border-red-500/50 bg-red-500/10 text-red-300",
    amber: "border-amber-500/50 bg-amber-500/10 text-amber-300",
    yellow: "border-yellow-500/50 bg-yellow-500/10 text-yellow-300",
    green: "border-green-500/50 bg-green-500/10 text-green-300",
  };

  const reset = () => {
    setIdentified(null);
    setConfined(null);
    setResp(null);
    setSkin(null);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <div>
          <p className="mb-2 text-sm font-bold text-slate-200">۱. آیا هویت ماده مشخص است؟</p>
          <ChoiceGroup options={[{ v: "yes", label: "بله، شناسایی شده" }, { v: "no", label: "خیر، نامشخص" }]} value={identified} onChange={setIdentified} />
        </div>
        <div>
          <p className="mb-2 text-sm font-bold text-slate-200">۲. آیا ورود به فضای بسته یا اتمسفر با کمبود/نامشخصی اکسیژن لازم است؟</p>
          <ChoiceGroup options={[{ v: "yes", label: "بله" }, { v: "no", label: "خیر" }]} value={confined} onChange={setConfined} />
        </div>
        <div>
          <p className="mb-2 text-sm font-bold text-slate-200">۳. خطر تنفسی ماده در چه سطحی است؟</p>
          <ChoiceGroup
            options={[
              { v: "high", label: "بالا (IDLH یا غلظت نامشخص)" },
              { v: "moderate", label: "متوسط (غلظت شناخته‌شده، قابل فیلتر)" },
              { v: "low", label: "کم/بدون خطر خاص" },
            ]}
            value={resp}
            onChange={setResp}
          />
        </div>
        <div>
          <p className="mb-2 text-sm font-bold text-slate-200">۴. خطر تماس پوستی/چشمی چقدر جدی است؟</p>
          <ChoiceGroup
            options={[
              { v: "high", label: "بالا (خورنده/جذب‌شونده کشنده)" },
              { v: "moderate", label: "متوسط (محرک، پاشش احتمالی)" },
              { v: "low", label: "کم/حداقلی" },
            ]}
            value={skin}
            onChange={setSkin}
          />
        </div>
        <button onClick={reset} className="text-xs font-bold text-slate-500 underline hover:text-slate-300">
          بازنشانی پرسش‌ها
        </button>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <h3 className="flex items-center gap-2 font-bold text-white">
          <UIIcon name="helmet" className="h-5 w-5 text-amber-400" /> سطح PPE پیشنهادی
        </h3>
        {!result.level ? (
          <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-6 text-center text-sm text-slate-500">
            برای مشاهده نتیجه، به هر ۴ سؤال پاسخ دهید.
          </div>
        ) : (
          <>
            <div className={`rounded-xl border p-5 ${toneClass[label!.color]}`}>
              <p className="text-2xl font-black">{label!.title}</p>
              <p className="mt-2 text-sm leading-6 opacity-90">{label!.desc}</p>
            </div>
            <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
              <p className="mb-2 text-xs font-bold text-slate-400">دلیل تصمیم</p>
              <ul className="space-y-1.5 text-sm leading-6 text-slate-300">
                {result.reasons.map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        <Disclaimer>
          این ویزارد یک ابزار کمکی سریع بر پایه چارچوب رایج HAZWOPER است، نه جایگزین شناسایی دقیق ماده، برگه SDS، یا نظر افسر ایمنی/فرمانده حادثه. در شرایط واقعی، تصمیم نهایی همیشه با فرمانده حادثه است.
        </Disclaimer>
      </div>
    </div>
  );
}

export function TacticalTools() {
  const [tool, setTool] = useState<"foam" | "water" | "nozzle" | "ppe">("foam");
  const tools = [
    { id: "foam" as const, label: "محاسبه فوم", icon: "drop" },
    { id: "water" as const, label: "آب خنک‌کننده", icon: "fire" },
    { id: "nozzle" as const, label: "دبی نازل و پمپ", icon: "bolt" },
    { id: "ppe" as const, label: "تعیین سطح PPE", icon: "helmet" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-white">ابزارهای تاکتیکی — پشتیبان فرماندهی حادثه (ICS)</h2>
        <p className="text-sm text-slate-400">محاسبات سریع منابع مورد نیاز برای حریق مایعات، خنک‌سازی و دبی نازل. برای تصمیم‌گیری فرمانده حادثه و استقرار منابع.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
              tool === t.id ? "border-red-500/50 bg-red-600 text-white" : "border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <UIIcon name={t.icon} className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tool === "foam" && <FoamCalc />}
      {tool === "water" && <WaterCalc />}
      {tool === "nozzle" && <NozzleCalc />}
      {tool === "ppe" && <PpeWizard />}

      <Disclaimer>
        این محاسبات ابزار کمکی برنامه‌ریزی بر پایه NFPA 11 (فوم) و NFPA 15 (آب خنک‌کننده) هستند. نرخ‌ها و مدت‌ها بر اساس جداول NFPA تنظیم شده اما برای حلال‌های قطبی، نقطه اشتعال دقیق، حالت سوخت (عمق/دمای سوخت)، تجهیزات، باد و دستورالعمل سازمان خود می‌تواند متفاوت باشد؛ تصمیم نهایی با فرمانده حادثه است.
      </Disclaimer>
    </div>
  );
}

/* =================== محاسبه فوم =================== */

// پیش‌فرض‌های NFPA 11 بر اساس نوع سوخت، سناریو، سقف و روش پاشش
type FoamKey = { scenario: "spill" | "tank"; fuel: "hydro" | "polar"; fp: "low" | "high"; roof: "fixed" | "floating"; method: "chamber" | "handline" };
function foamPreset(k: FoamKey): { rate: number; time: number; pct: number; foam: string } {
  if (k.fuel === "polar") {
    if (k.scenario === "spill") return { rate: 6.5, time: 15, pct: 6, foam: "AR-AFFF" };
    if (k.roof === "floating") return { rate: 12.2, time: 20, pct: 6, foam: "AR-AFFF" };
    return { rate: 6.5, time: 30, pct: 6, foam: "AR-AFFF" }; // قطبی، طبق لیست سازنده (~۰٫۱۶)
  }
  // هیدروکربن
  if (k.scenario === "spill") return { rate: 6.5, time: 15, pct: 3, foam: "AFFF" };
  if (k.roof === "floating") return { rate: 12.2, time: 20, pct: 3, foam: "AFFF" }; // rim seal
  if (k.method === "handline") return k.fp === "low" ? { rate: 6.5, time: 65, pct: 3, foam: "AFFF" } : { rate: 6.5, time: 50, pct: 3, foam: "AFFF" };
  // محفظه فوم (Type II)
  return k.fp === "low" ? { rate: 4.1, time: 55, pct: 3, foam: "AFFF" } : { rate: 4.1, time: 30, pct: 3, foam: "AFFF" };
}

// تعداد محفظه فوم بر اساس قطر (NFPA 11)
function foamChambers(Dm: number): number {
  const Dft = (Dm || 0) * 3.28084;
  if (Dft <= 80) return 1;
  if (Dft <= 120) return 2;
  if (Dft <= 140) return 3;
  if (Dft <= 160) return 4;
  if (Dft <= 180) return 5;
  if (Dft <= 200) return 6;
  const extra = Math.PI * ((Dm || 0) / 2) ** 2 - Math.PI * ((200 * 0.3048) / 2) ** 2;
  return 6 + Math.max(0, Math.ceil(extra / 465));
}

function FoamCalc() {
  const [scenario, setScenario] = useState<"spill" | "tank">("tank");
  const [fuel, setFuel] = useState<"hydro" | "polar">("hydro");
  const [fp, setFp] = useState<"low" | "high">("low");
  const [roof, setRoof] = useState<"fixed" | "floating">("fixed");
  const [method, setMethod] = useState<"chamber" | "handline">("chamber");
  const [sealW, setSealW] = useState(0.3);
  const [shape, setShape] = useState<"rect" | "circle" | "area">("circle");
  const [len, setLen] = useState(10);
  const [wid, setWid] = useState(6);
  const [dia, setDia] = useState(18);
  const [area, setArea] = useState(60);
  const [rate, setRate] = useState(4.1);
  const [time, setTime] = useState(55);
  const [pct, setPct] = useState(3);
  const [deviceFlow, setDeviceFlow] = useState(1200);

  // اعمال پیش‌فرض NFPA 11 با تغییر نوع سوخت/سناریو/سقف/روش
  const applyPreset = (patch: Partial<FoamKey>) => {
    const key: FoamKey = { scenario, fuel, fp, roof, method, ...patch };
    const p = foamPreset(key);
    setRate(p.rate);
    setTime(p.time);
    setPct(p.pct);
  };

  const preset = useMemo(() => ({ rate, time, pct, foam: foamPreset({ scenario, fuel, fp, roof, method }).foam }), [rate, time, pct, scenario, fuel, fp, roof, method]);

  const areaM2 = useMemo(() => {
    if (scenario === "tank") {
      if (roof === "floating") return Math.PI * (dia || 0) * (sealW || 0); // حلقه rim seal
      return Math.PI * ((dia || 0) / 2) ** 2; // سقف ثابت: کل سطح
    }
    if (shape === "rect") return (len || 0) * (wid || 0);
    if (shape === "circle") return Math.PI * ((dia || 0) / 2) ** 2;
    return area || 0;
  }, [scenario, roof, shape, dia, sealW, len, wid, area]);

  const solutionFlow = areaM2 * (rate || 0);
  const solutionTotal = solutionFlow * (time || 0);
  const concentrate = solutionTotal * ((pct || 0) / 100);
  const devices = deviceFlow > 0 ? Math.ceil(solutionFlow / deviceFlow) : 0;
  const chambers = scenario === "tank" ? foamChambers(dia) : 0;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        {/* نوع سوخت */}
        <div>
          <p className="mb-2 text-xs font-bold text-slate-400">نوع سوخت (مهم)</p>
          <div className="flex gap-2">
            <button onClick={() => { setFuel("hydro"); applyPreset({ fuel: "hydro" }); }} className={`flex-1 rounded-lg border px-3 py-2 text-xs font-bold ${fuel === "hydro" ? "border-amber-500 bg-amber-500/15 text-amber-300" : "border-slate-700 bg-slate-800 text-slate-300"}`}>هیدروکربن</button>
            <button onClick={() => { setFuel("polar"); applyPreset({ fuel: "polar" }); }} className={`flex-1 rounded-lg border px-3 py-2 text-xs font-bold ${fuel === "polar" ? "border-amber-500 bg-amber-500/15 text-amber-300" : "border-slate-700 bg-slate-800 text-slate-300"}`}>حلال قطبی (الکل/کتون)</button>
          </div>
        </div>
        {/* سناریو */}
        <div>
          <p className="mb-2 text-xs font-bold text-slate-400">سناریو</p>
          <div className="flex gap-2">
            <button onClick={() => { setScenario("tank"); applyPreset({ scenario: "tank" }); }} className={`flex-1 rounded-lg border px-3 py-2 text-sm font-bold ${scenario === "tank" ? "border-amber-500 bg-amber-500/15 text-amber-300" : "border-slate-700 bg-slate-800 text-slate-300"}`}>مخزن ذخیره</button>
            <button onClick={() => { setScenario("spill"); applyPreset({ scenario: "spill" }); }} className={`flex-1 rounded-lg border px-3 py-2 text-sm font-bold ${scenario === "spill" ? "border-amber-500 bg-amber-500/15 text-amber-300" : "border-slate-700 bg-slate-800 text-slate-300"}`}>پخش/دایک</button>
          </div>
        </div>

        {/* گزینه‌های مخزن */}
        {scenario === "tank" && (
          <>
            <div>
              <p className="mb-2 text-xs font-bold text-slate-400">نوع سقف مخزن (مهم برای سطح درگیر)</p>
              <div className="flex gap-2">
                <button onClick={() => { setRoof("fixed"); applyPreset({ roof: "fixed" }); }} className={`flex-1 rounded-lg border px-3 py-2 text-xs font-bold ${roof === "fixed" ? "border-amber-500 bg-amber-500/15 text-amber-300" : "border-slate-700 bg-slate-800 text-slate-300"}`}>سقف ثابت (کل سطح)</button>
                <button onClick={() => { setRoof("floating"); applyPreset({ roof: "floating" }); }} className={`flex-1 rounded-lg border px-3 py-2 text-xs font-bold ${roof === "floating" ? "border-amber-500 bg-amber-500/15 text-amber-300" : "border-slate-700 bg-slate-800 text-slate-300"}`}>سقف شناور (rim seal)</button>
              </div>
            </div>
            {fuel === "hydro" && roof === "fixed" && (
              <div>
                <p className="mb-2 text-xs font-bold text-slate-400">نقطه اشتعال سوخت</p>
                <div className="flex gap-2">
                  <button onClick={() => { setFp("low"); applyPreset({ fp: "low" }); }} className={`flex-1 rounded-lg border px-2 py-2 text-[11px] font-bold ${fp === "low" ? "border-amber-500 bg-amber-500/15 text-amber-300" : "border-slate-700 bg-slate-800 text-slate-300"}`}>کمتر از ۳۸° (بنزین/نفتا)</button>
                  <button onClick={() => { setFp("high"); applyPreset({ fp: "high" }); }} className={`flex-1 rounded-lg border px-2 py-2 text-[11px] font-bold ${fp === "high" ? "border-amber-500 bg-amber-500/15 text-amber-300" : "border-slate-700 bg-slate-800 text-slate-300"}`}>۳۸–۶۰° (کروزن/دیزل)</button>
                </div>
              </div>
            )}
            {fuel === "hydro" && roof === "fixed" && (
              <div>
                <p className="mb-2 text-xs font-bold text-slate-400">روش پاشش</p>
                <div className="flex gap-2">
                  <button onClick={() => { setMethod("chamber"); applyPreset({ method: "chamber" }); }} className={`flex-1 rounded-lg border px-2 py-2 text-[11px] font-bold ${method === "chamber" ? "border-amber-500 bg-amber-500/15 text-amber-300" : "border-slate-700 bg-slate-800 text-slate-300"}`}>محفظه فوم ثابت</button>
                  <button onClick={() => { setMethod("handline"); applyPreset({ method: "handline" }); }} className={`flex-1 rounded-lg border px-2 py-2 text-[11px] font-bold ${method === "handline" ? "border-amber-500 bg-amber-500/15 text-amber-300" : "border-slate-700 bg-slate-800 text-slate-300"}`}>لوله دستی/مانیتور</button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ابعاد */}
        <div className="grid grid-cols-2 gap-3">
          {scenario === "tank" ? (
            <>
              <Field label="قطر مخزن" unit="m" value={dia} onChange={setDia} step={0.5} />
              {roof === "floating" && <Field label="عرض حلقه درز (seal)" unit="m" value={sealW} onChange={setSealW} step={0.05} />}
            </>
          ) : (
            <>
              <div className="col-span-2 flex gap-2">
                <button onClick={() => setShape("rect")} className={`flex-1 rounded-lg border px-2 py-2 text-[11px] font-bold ${shape === "rect" ? "border-amber-500 bg-amber-500/15 text-amber-300" : "border-slate-700 bg-slate-800 text-slate-300"}`}>مستطیل</button>
                <button onClick={() => setShape("circle")} className={`flex-1 rounded-lg border px-2 py-2 text-[11px] font-bold ${shape === "circle" ? "border-amber-500 bg-amber-500/15 text-amber-300" : "border-slate-700 bg-slate-800 text-slate-300"}`}>دایره</button>
                <button onClick={() => setShape("area")} className={`flex-1 rounded-lg border px-2 py-2 text-[11px] font-bold ${shape === "area" ? "border-amber-500 bg-amber-500/15 text-amber-300" : "border-slate-700 bg-slate-800 text-slate-300"}`}>مساحت</button>
              </div>
              {shape === "rect" && (<><Field label="طول" unit="m" value={len} onChange={setLen} step={0.5} /><Field label="عرض" unit="m" value={wid} onChange={setWid} step={0.5} /></>)}
              {shape === "circle" && <Field label="قطر" unit="m" value={dia} onChange={setDia} step={0.5} />}
              {shape === "area" && <Field label="مساحت" unit="m²" value={area} onChange={setArea} step={1} />}
            </>
          )}
          <Field label="نرخ پاشش محلول" unit="L/min/m²" value={rate} onChange={setRate} step={0.1} />
          <Field label="مدت پاشش" unit="min" value={time} onChange={setTime} step={1} />
          <div>
            <span className="mb-1 block text-xs text-slate-400">غلظت کنسانتره</span>
            <div className="flex gap-1.5">
              {[1, 3, 6].map((p) => (
                <button key={p} onClick={() => setPct(p)} className={`flex-1 rounded-lg border px-2 py-2 font-mono-num text-sm font-bold ${pct === p ? "border-amber-500 bg-amber-500/15 text-amber-300" : "border-slate-700 bg-slate-800 text-slate-300"}`}>{p}٪</button>
              ))}
            </div>
          </div>
          <Field label="دبی هر محفظه/لوله فوم" unit="L/min" value={deviceFlow} onChange={setDeviceFlow} step={50} />
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <h3 className="flex items-center gap-2 font-bold text-white"><UIIcon name="drop" className="h-5 w-5 text-amber-400" /> منابع فوم مورد نیاز (NFPA 11)</h3>
        <div className="flex items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-xs">
          <span className="text-slate-500">نوع فوم پیشنهادی:</span>
          <span className="font-bold text-amber-300">{preset.foam}</span>
          {fuel === "polar" && <span className="font-bold text-amber-300">— حتماً مقاوم به الکل</span>}
        </div>
        <Result label={scenario === "tank" && roof === "floating" ? "سطح حلقه rim seal" : "سطح درگیر حریق"} value={fmt(areaM2, 1)} unit="m²" />
        <Result label="دبی محلول فوم (سطح×نرخ)" value={fmt(solutionFlow, 0)} unit={`L/min  ≈ ${fmt(solutionFlow / 60, 1)} L/s`} />
        <Result label="کل محلول فوم (دبی×مدت)" value={fmt(solutionTotal, 0)} unit="L" />
        <Result label="کنسانتره فوم (محلول×٪)" tone="hi" value={fmt(concentrate, 0)} unit="L" />
        {chambers > 0 ? (
          <Result label="حداقل محفظه فوم (NFPA 11)" tone="hi" value={fmt(Math.max(chambers, devices))} unit={`عدد (جدول: ${chambers} / دبی: ${devices})`} />
        ) : (
          <Result label="تعداد لوله‌های فوم" tone="hi" value={fmt(devices)} unit="عدد" />
        )}
        <p className="text-[11px] leading-6 text-slate-500">
          پایه NFPA 11: کنسانتره = سطح × نرخ کاربرد × مدت × غلظت. هیدروکربن با محفظه ثابت: ۴٫۱ L/min/m² (۳۰–۵۵ دقیقه)؛ با لوله/مانیتور: ۶٫۵ (۵۰–۶۵ دقیقه). سقف شناور: فقط حلقه درز (π×قطر×عرض درز) با نرخ ۱۲٫۲ و ۲۰ دقیقه. حلال قطبی به AR-AFFF و نرخ/زمان طبق لیست سازنده نیاز دارد.
        </p>
      </div>
    </div>
  );
}

/* =================== محاسبه آب خنک‌کننده =================== */

function WaterCalc() {
  const [target, setTarget] = useState<"tank" | "area">("tank");
  const [dia, setDia] = useState(10);
  const [height, setHeight] = useState(12);
  const [len, setLen] = useState(15);
  const [wid, setWid] = useState(10);
  const [rate, setRate] = useState(10.2);
  const [duration, setDuration] = useState(60);
  const [tanker, setTanker] = useState(12000);

  const area = useMemo(() => {
    if (target === "tank") return Math.PI * (dia || 0) * (height || 0); // سطح جداره برجی
    return (len || 0) * (wid || 0);
  }, [target, dia, height, len, wid]);

  const flow = area * (rate || 0); // L/min
  const total = flow * (duration || 0); // L
  const totalM3 = total / 1000;
  const tankers = tanker > 0 ? Math.ceil(total / tanker) : 0;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <div>
          <p className="mb-2 text-xs font-bold text-slate-400">هدف خنک‌سازی</p>
          <div className="flex gap-2">
            <button onClick={() => setTarget("tank")} className={`flex-1 rounded-lg border px-3 py-2 text-sm font-bold ${target === "tank" ? "border-amber-500 bg-amber-500/15 text-amber-300" : "border-slate-700 bg-slate-800 text-slate-300"}`}>مخزن برجی</button>
            <button onClick={() => setTarget("area")} className={`flex-1 rounded-lg border px-3 py-2 text-sm font-bold ${target === "area" ? "border-amber-500 bg-amber-500/15 text-amber-300" : "border-slate-700 bg-slate-800 text-slate-300"}`}>سطح/ساختمان</button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {target === "tank" ? (
            <>
              <Field label="قطر مخزن" unit="m" value={dia} onChange={setDia} step={0.5} />
              <Field label="ارتفاع جداره" unit="m" value={height} onChange={setHeight} step={0.5} />
            </>
          ) : (
            <>
              <Field label="طول" unit="m" value={len} onChange={setLen} step={0.5} />
              <Field label="عرض" unit="m" value={wid} onChange={setWid} step={0.5} />
            </>
          )}
          <Field label="نرخ آب خنک‌کننده" unit="L/min/m²" value={rate} onChange={setRate} step={0.1} />
          <Field label="مدت عملیات" unit="min" value={duration} onChange={setDuration} step={5} />
          <Field label="ظرفیت تانکر آب" unit="L" value={tanker} onChange={setTanker} step={500} />
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <h3 className="flex items-center gap-2 font-bold text-white"><UIIcon name="fire" className="h-5 w-5 text-orange-400" /> تقاضای آب</h3>
        <Result label="سطح در معرض" value={fmt(area, 1)} unit="m²" />
        <Result label="دبی آب لازم" value={fmt(flow, 0)} unit={`L/min  ≈ ${fmt(flow / 60, 1)} L/s`} />
        <Result label="کل آب مصرفی" tone="hi" value={fmt(total, 0)} unit={`L  (${fmt(totalM3, 1)} m³)`} />
        <Result label="تعداد تانکر آب" tone="hi" value={fmt(tankers)} unit="عدد" />
        <p className="text-[11px] leading-6 text-slate-500">
          پایه: دبی = سطح × نرخ؛ کل آب = دبی × مدت. نرخ پیش‌فرض ۱۰٫۲ L/min/m² (≈۰٫۲۵ gpm/ft²) برای محافظت از مواجهه مطابق NFPA ۱۵. سطح مخزن برجی = π × قطر × ارتفاع جداره.
        </p>
      </div>
    </div>
  );
}

/* =================== دبی نازل و فشار پمپ =================== */

const HOSE_COEF: Record<string, { label: string; c: number }> = {
  "45": { label: "۴۵ میلی‌متر (۱¾ اینچ)", c: 15.5 },
  "65": { label: "۶۵ میلی‌متر (۲٫۵ اینچ)", c: 2.0 },
  "70": { label: "۷۰ میلی‌متر", c: 1.2 },
  "75": { label: "۷۵ میلی‌متر (۳ اینچ)", c: 0.8 },
  "90": { label: "۹۰ میلی‌متر", c: 0.3 },
  "110": { label: "۱۱۰ میلی‌متر (۴ اینچ)", c: 0.1 },
};

function NozzleCalc() {
  const [tip, setTip] = useState(16); // mm smooth bore
  const [tipP, setTipP] = useState(3.5); // bar nozzle pressure
  const [hose, setHose] = useState("65");
  const [hoseLen, setHoseLen] = useState(60); // m
  const [elev, setElev] = useState(0); // m

  // دبی نازل لوله‌صاف (فرمول استاندارد آتش‌نشانی)
  // Q(gpm) = 29.7·d²(in)·√P(psi)  ⇄  Q(L/min) = 0.664·d²(mm)·√P(bar)
  const flow = useMemo(() => {
    const d = tip || 0; // mm
    const p = tipP || 0; // bar
    return 0.664 * d * d * Math.sqrt(p); // L/min
  }, [tip, tipP]);

  // افت فشار شلنگ
  const friction = useMemo(() => {
    const c = HOSE_COEF[hose].c;
    const qgpm = flow / 3.785;
    const flPsi100 = c * Math.pow(qgpm / 100, 2);
    const flPsi = flPsi100 * ((hoseLen || 0) / 30.48);
    return flPsi * 0.0689476; // bar
  }, [flow, hose, hoseLen]);

  const elevP = (elev || 0) * 0.0981; // bar
  const pumpP = (tipP || 0) + friction + elevP;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <div>
          <p className="mb-2 text-xs font-bold text-slate-400">قطر سر لوله‌صاف (Smooth bore)</p>
          <div className="flex flex-wrap gap-1.5">
            {[12, 14, 16, 19, 22, 25, 28].map((t) => (
              <button key={t} onClick={() => setTip(t)} className={`rounded-lg border px-2.5 py-1.5 font-mono-num text-xs font-bold ${tip === t ? "border-amber-500 bg-amber-500/15 text-amber-300" : "border-slate-700 bg-slate-800 text-slate-300"}`}>{t}mm</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="فشار سر نازل" unit="bar" value={tipP} onChange={setTipP} step={0.5} />
          <Field label="طول شلنگ" unit="m" value={hoseLen} onChange={setHoseLen} step={5} />
          <Field label="اختلاف ارتفاع (+ بالا)" unit="m" value={elev} onChange={setElev} step={1} />
        </div>
        <label className="block">
          <span className="mb-1 block text-xs text-slate-400">قطر شلنگ</span>
          <select value={hose} onChange={(e) => setHose(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-500">
            {Object.entries(HOSE_COEF).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <h3 className="flex items-center gap-2 font-bold text-white"><UIIcon name="bolt" className="h-5 w-5 text-yellow-400" /> دبی و فشار</h3>
        <Result label="دبی خروجی نازل" tone="hi" value={fmt(flow, 0)} unit={`L/min  ≈ ${fmt(flow / 60, 1)} L/s`} />
        <Result label="افت فشار شلنگ" value={fmt(friction, 1)} unit="bar" />
        <Result label="فشار ارتفاع" value={fmt(elevP, 1)} unit="bar" />
        <Result label="فشار خروجی پمپ لازم" tone="hi" value={fmt(pumpP, 1)} unit="bar" />
        <p className="text-[11px] leading-6 text-slate-500">
          دبی نازل لوله‌صاف از فرمول استاندارد آتش‌نشانی Q(L/min) = ۰٫۶۶۴ × d²(mm) × √P(bar) [برابر با Q(gpm)=۲۹٫۷·d²(in)·√P(psi)]. افت فشار شلنگ بر پایه فرمول NFPA FL = C·(Q/۱۰۰)² به‌ازای هر ۱۰۰ فوت با ضرایب قطر، سپس تبدیل به bar. مقادیر تقریبی و برای برنامه‌ریزی است.
        </p>
      </div>
    </div>
  );
}
