import { useState } from "react";
import { UIIcon } from "./icons";

// قوانین طلایی واکنش به مواد خطرناک — قواعد جهانی و بی‌استثنا
const GOLDEN_RULES = [
  { icon: "wind", text: "همواره از جهت باد و بالاتر از سطح حادثه نزدیک شوید (Upwind / Uphill)." },
  { icon: "shield", text: "تا قبل از شناسایی ماده، ایزوله‌سازی اولیه را رعایت کنید و وارد منطقه خطر نشوید." },
  { icon: "helmet", text: "برای ماده ناشناخته یا فضای بسته، همواره دستگاه تنفسی مستقل (SCBA) بپوشید." },
  { icon: "alert", text: "بدون تجهیزات کامل و پشتیبانی، برای نجات شتاب‌زده وارد نشوید (خطر نجات‌دهنده دوم)." },
  { icon: "phone", text: "فوراً ۱۲۵ و تیم متخصص مواد خطرناک را در جریان بگذارید." },
];

interface Step {
  num: number;
  icon: string;
  title: string;
  tone: string;
  do: string[];
  dont?: string[];
}

const STEPS: Step[] = [
  {
    num: 1,
    icon: "assessment",
    title: "شناسایی و ارزیابی صحنه (Size-Up)",
    tone: "sky",
    do: [
      "پلاکارد، شماره UN، رنگ ظرف، بوی خاص و نشانه‌ها را از راه دور بخوانید.",
      "جهت باد، شیب زمین و نقاط پایین (جمع‌شدن گاز سنگین) را تعیین کنید.",
      "تعداد مجروحان، منابع احتراق و خطرات ثانویه (انفجار، ریزش) را ارزیابی کنید.",
      "در صورت ناشناخته بودن ماده، فرض کنید بدترین حالت (سمی/قابل اشتعال) است.",
    ],
    dont: ["دست‌زدن به پلاکارد یا نمونه‌برداری بدون تجهیزات کامل."],
  },
  {
    num: 2,
    icon: "shield",
    title: "ایزوله‌سازی اولیه و تخلیه",
    tone: "red",
    do: [
      "منطقه خطر (Hot Zone) را ایزوله و کنترل دسترسی کنید.",
      "برای ماده با راهنمای شناخته‌شده، شعاع ایزوله‌سازی را از مرجع/ERG بگیرید.",
      "مردم را عمود بر جهت باد و به سمت مرتفع تخلیه کنید.",
      "در گاز سمی (TIH) از فاصله محافظتی بزرگ (روز/شب) استفاده کنید.",
    ],
    dont: ["تخلیه به‌سمت جهت باد یا نقاط پایین."],
  },
  {
    num: 3,
    icon: "helmet",
    title: "انتخاب تجهیزات حفاظتی (PPE)",
    tone: "amber",
    do: [
      "گاز سمی با خطر پوست → سطح A (لباس محصور + SCBA).",
      "مایع شیمیایی با خطر پاشش → سطح B (ضدپاشش + SCBA).",
      "آلاینده شناخته‌شده و غلظت کم → سطح C (ماسک تصفیه‌ای).",
      "همواره SCBA برای فضای بسته یا ماده ناشناخته.",
    ],
  },
  {
    num: 4,
    icon: "phone",
    title: "اعلام و درخواست منابع",
    tone: "sky",
    do: [
      "فرمانده حادثه (IC) و نقطه فرمان را معین کنید.",
      "شماره UN، رده خطر، مقدار و وضعیت را گزارش دهید.",
      "بیمارستان‌ها و مراکز بهداشتی در مسیر باد را هشدار دهید.",
      "تیم متخصص مواد خطرناک، آمبولانس و نیروی پشتیبانی را درخواست کنید.",
    ],
  },
  {
    num: 5,
    icon: "shield",
    title: "واکنش دفاعی (Defensive)",
    tone: "amber",
    do: [
      "خاکریز/سد بسازید تا نشتی وارد فاضلاب، آب یا فضاهای بسته نشود.",
      "موارد در معرض (مخازن مجاور، ساختمان‌ها) را خنک و محافظت کنید.",
      "منابع احتراق را در شعاع خطر قطع کنید.",
      "تنها اقدام تهاجمی با دستور فرمانده حادثه و تجهیزات کامل.",
    ],
    dont: ["ریختن آب مستقیم روی مایع قابل اشتعال یا واکنش‌پذیر با آب (W)."],
  },
  {
    num: 6,
    icon: "recycle",
    title: "رفع آلودگی (Decontamination)",
    tone: "emerald",
    do: [
      "ایستگاه رفع آلودگی را در لبه منطقه میانی (Warm Zone) برپا کنید.",
      "نیروها و مجروحان را پیش از خروج از Hot Zone پاک کنید.",
      "آب آلوده را جمع‌آوری و دفع ایمن کنید.",
    ],
  },
  {
    num: 7,
    icon: "drop",
    title: "کمک‌های اولیه و انتقال مجروحان",
    tone: "red",
    do: [
      "ابتدا مجروح را از منطقه خطر خارج و رفع آلودگی کنید.",
      "نقل به هوای تازه؛ اکسیژن در صورت تنگی نفس یا گاز سمی.",
      "شستشوی فراوان پوست و چشم (حداقل ۱۵ دقیقه) و درآوردن لباس آلوده.",
      "اطلاعات ماده و راهنمای ERG را به تیم اورژانس منتقل کنید.",
    ],
  },
];

const toneMap: Record<string, { ring: string; chip: string; num: string; bar: string }> = {
  sky: { ring: "border-amber-500/40", chip: "bg-amber-500/15 text-amber-300", num: "bg-amber-600 text-white", bar: "bg-amber-500" },
  red: { ring: "border-red-500/40", chip: "bg-red-500/15 text-red-300", num: "bg-red-600 text-white", bar: "bg-red-500" },
  amber: { ring: "border-amber-500/40", chip: "bg-amber-500/15 text-amber-300", num: "bg-amber-600 text-white", bar: "bg-amber-500" },
  emerald: { ring: "border-emerald-500/40", chip: "bg-emerald-500/15 text-emerald-300", num: "bg-emerald-600 text-white", bar: "bg-emerald-500" },
};

export function QuickResponse({ onSearch, onTool, onProcedures }: { onSearch: () => void; onTool: () => void; onProcedures: () => void }) {
  const [open, setOpen] = useState<number | null>(1);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-white">واکنش سریع در صحنه حادثه</h2>
        <p className="text-sm text-slate-400">جریان پشتیبان تصمیم برای واکنش به مواد خطرناک — از لحظه رسیدن تا پایان عملیات.</p>
      </div>

      {/* قوانین طلایی */}
      <div className="rounded-2xl border border-red-500/40 bg-gradient-to-bl from-red-950/40 to-[#0b1426] p-5">
        <h3 className="mb-3 flex items-center gap-2 text-base font-black text-red-200">
          <UIIcon name="alert" className="h-5 w-5 text-red-400" />
          قوانین طلایی — همیشه رعایت شود
        </h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {GOLDEN_RULES.map((r, i) => (
            <li key={i} className="flex items-start gap-2.5 rounded-lg bg-black/20 p-2.5">
              <UIIcon name={r.icon} className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
              <span className="text-sm leading-6 text-red-100/90">{r.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* دسترسی‌های سریع */}
      <div className="grid grid-cols-3 gap-3">
        <button onClick={onSearch} className="flex flex-col items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/60 p-4 transition hover:border-amber-500/50 hover:bg-slate-900">
          <UIIcon name="search" className="h-7 w-7 text-amber-400" />
          <span className="text-xs font-bold text-slate-200">شناسایی ماده</span>
        </button>
        <button onClick={onTool} className="flex flex-col items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/60 p-4 transition hover:border-amber-500/50 hover:bg-slate-900">
          <UIIcon name="drop" className="h-7 w-7 text-amber-400" />
          <span className="text-xs font-bold text-slate-200">محاسبه آب/فوم</span>
        </button>
        <button onClick={onProcedures} className="flex flex-col items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/60 p-4 transition hover:border-emerald-500/50 hover:bg-slate-900">
          <UIIcon name="list" className="h-7 w-7 text-emerald-400" />
          <span className="text-xs font-bold text-slate-200">رویه‌ها</span>
        </button>
      </div>

      {/* مراحل */}
      <div className="space-y-3">
        {STEPS.map((s) => {
          const t = toneMap[s.tone];
          const isOpen = open === s.num;
          return (
            <div key={s.num} className={`overflow-hidden rounded-2xl border bg-slate-900/50 transition ${isOpen ? t.ring : "border-slate-800"}`}>
              <button
                onClick={() => setOpen(isOpen ? null : s.num)}
                aria-expanded={isOpen}
                aria-controls={`quick-step-${s.num}`}
                className="flex w-full items-center gap-3 p-4 text-right"
              >
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl font-mono-num text-lg font-black ${t.num}`}>{s.num}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-white">{s.title}</p>
                </div>
                <svg viewBox="0 0 24 24" className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {isOpen && (
                <div id={`quick-step-${s.num}`} className="space-y-3 px-4 pb-4">
                  <div className={`h-1 w-full rounded ${t.bar}`} />
                  <div>
                    <p className={`mb-2 inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-bold ${t.chip}`}>
                      <UIIcon name="shield" className="h-3.5 w-3.5" /> اقدامات
                    </p>
                    <ul className="space-y-1.5">
                      {s.do.map((d, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm leading-7 text-slate-300">
                          <span className={`mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${t.bar}`} />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {s.dont?.length ? (
                    <div className="rounded-lg border border-red-500/20 bg-red-950/20 p-3">
                      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-red-300">
                        <UIIcon name="alert" className="h-3.5 w-3.5" /> ممنوع (Do NOT)
                      </p>
                      <ul className="space-y-1">
                        {s.dont.map((d, i) => (
                          <li key={i} className="text-sm leading-6 text-red-200/80">✕ {d}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-[11px] leading-6 text-amber-200/80">
        <UIIcon name="alert" className="h-4 w-4 shrink-0 text-amber-400" />
        این جریان ابزار یادآوری است و جایگزین آموزش، راهنمای رسمی ERG، SDS و دستورالعمل سازمان آتش‌نشانی شما نیست.
      </div>
    </div>
  );
}
