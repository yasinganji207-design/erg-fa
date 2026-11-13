import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  materials,
  hazardClasses,
  ergGuides,
  procedures,
  glossary,
  ghsReference,
  NFPA_SCALE,
  placardForClass,
  categoryOf,
  normalizeSearchText,
  materialSearchText,
  validateData,
  CATEGORY_ORDER,
  PLACARD_CONFIG,
  type Material,
} from "./data/hazmat";
import { NFPADiamond, NFPALegend, NFPA_COLORS } from "./components/NFPADiamond";
import { DOTPlacard, UIIcon, GHSIcon } from "./components/icons";
import { MaterialDetail } from "./components/MaterialDetail";
import { SearchPalette } from "./components/SearchPalette";
import { TacticalTools } from "./components/TacticalTools";
import { QuickResponse } from "./components/QuickResponse";
import { Assistant } from "./components/Assistant";
import { Manual } from "./components/Manual";
import { AppLogo, AppBadge } from "./components/AppLogo";

type TabId = "dashboard" | "assistant" | "quick" | "materials" | "nfpa" | "classes" | "erg" | "procedures" | "tactical" | "glossary" | "manual";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "dashboard", label: "داشبورد", icon: "grid" },
  { id: "assistant", label: "دستیار هوشمند", icon: "ai" },
  { id: "quick", label: "واکنش سریع", icon: "bolt" },
  { id: "materials", label: "مواد خطرناک", icon: "flask" },
  { id: "tactical", label: "ابزار تاکتیکی", icon: "drop" },
  { id: "nfpa", label: "نمادها", icon: "diamond" },
  { id: "classes", label: "رده‌های خطر", icon: "alert" },
  { id: "erg", label: "راهنمای ERG", icon: "book" },
  { id: "procedures", label: "رویه‌ها", icon: "shield" },
  { id: "glossary", label: "واژه‌نامه", icon: "list" },
  { id: "manual", label: "راهنما", icon: "doc" },
];

const FAV_KEY = "hazmat_favorites_v1";
function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);
  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem(FAV_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);
  return { ids, toggle };
}

// حالت خوانایی زیر نور آفتاب (کنتراست بالا، پس‌زمینه روشن)
const DAY_MODE_KEY = "hazmat_daymode_v1";
function useDayMode() {
  const [day, setDay] = useState(false);
  useEffect(() => {
    try {
      setDay(localStorage.getItem(DAY_MODE_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("day-mode", day);
  }, [day]);
  const toggle = useCallback(() => {
    setDay((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(DAY_MODE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);
  return { day, toggle };
}

// منوی کناری عمودی (دسکتاپ) و کشویی (موبایل)
function Sidebar({ tab, setTab, onSearch, onClose, variant }: { tab: TabId; setTab: (t: TabId) => void; onSearch: () => void; onClose?: () => void; variant: "desktop" | "mobile" }) {
  const wrap =
    variant === "desktop"
      ? "sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-l border-slate-800 bg-[#070b16] px-3 py-4 lg:flex"
      : "flex h-full w-72 flex-col border-l border-slate-800 bg-[#070b16] px-3 py-4";
  return (
    <aside className={wrap}>
      {/* سربرگ */}
      <div className="flex items-center justify-between px-2 pb-3">
        <button onClick={() => setTab("dashboard")} className="flex items-center gap-2.5 text-right">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-red-600 to-orange-600 shadow-lg shadow-red-900/40">
            <svg viewBox="0 0 32 32" className="h-6 w-6">
              <polygon points="16,3 29,16 16,29 3,16" fill="none" stroke="#fff" strokeWidth="2.2" />
              <path d="M16 9c1.4 2.8-1.4 3.8-1.4 5.6 0 0 1.9-1 1.9-2.8 1.6 1.6 2.6 3.4 2.6 5.4a4.4 4.4 0 1 1-8.8 0c0-2 1.4-3.4 2.4-4.6.5 1.5 2 1.5 2 .4 0-1.8 1.2-2.8 1.3-4z" fill="#fff" />
            </svg>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-black text-white">مرجع مواد خطرناک</p>
            <p className="text-[10px] text-amber-400" dir="ltr">HAZMAT · ERG</p>
          </div>
        </button>
        {onClose && (
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg border border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700" aria-label="بستن منو">
            <UIIcon name="close" className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className="mb-3 h-px bg-slate-800" />

      {/* جستجو */}
      <button onClick={onSearch} className="mb-3 flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-400 transition hover:border-slate-600 hover:text-slate-200">
        <span className="flex items-center gap-2"><UIIcon name="search" className="h-4 w-4" /> جستجوی ماده</span>
        <kbd className="rounded border border-slate-600 bg-slate-800 px-1 text-[10px] text-slate-500">Ctrl K</kbd>
      </button>

      {/* ناوبری عمودی */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-right transition ${
              tab === t.id ? "bg-gradient-to-l from-red-600 to-orange-600 text-white shadow-md shadow-red-900/30" : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <UIIcon name={t.icon} className="h-5 w-5 shrink-0" />
            <span>{t.label}</span>
            {tab === t.id && <span className="mr-auto h-1.5 w-1.5 rounded-full bg-white" />}
          </button>
        ))}
      </nav>

      {/* فوتر منو */}
      <div className="space-y-3 pt-3">
        <a href="tel:125" className="flex items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2.5 text-sm font-black text-red-300 transition hover:bg-red-500/20">
          <span className="relative flex h-2.5 w-2.5">
            <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-red-500" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
          آتش‌نشانی <span className="font-mono-num">۱۲۵</span>
        </a>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
          <AppLogo size={40} />
        </div>
      </div>
    </aside>
  );
}

export default function App() {
  const [tab, setTab] = useState<TabId>("dashboard");
  const [selected, setSelected] = useState<Material | null>(null);
  const [guide, setGuide] = useState<number | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const fav = useFavorites();
  const { day: dayMode, toggle: toggleDay } = useDayMode();

  const openMaterial = useCallback((m: Material) => setSelected(m), []);
  const openMaterialById = useCallback((id: string) => {
    const m = materials.find((x) => x.id === id);
    if (m) setSelected(m);
  }, []);
  const openGuide = useCallback((n: number) => {
    setSelected(null);
    setTab("erg");
    setGuide(n);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      } else if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // قفل اسکرول هنگام باز بودن منوی کشویی موبایل
  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  // بررسی سلامت پایگاه داده (فقط در محیط توسعه)
  useEffect(() => {
    if ((import.meta as { env?: { DEV?: boolean } }).env?.DEV) {
      const report = validateData();
      if (report.missingGuideForMaterial.length) {
        console.warn("[HAZMAT] مواد با راهنمای ناموجود:", report.missingGuideForMaterial);
      }
      if (report.duplicateIds.length) console.warn("[HAZMAT] شناسه تکراری:", report.duplicateIds);
      if (report.duplicateUns.length) console.info("[HAZMAT] UN‌های مشترک (معمولاً طبیعی):", report.duplicateUns);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#060a13] bg-grid text-slate-200 lg:flex">
      {/* منوی کناری عمودی دسکتاپ */}
      <Sidebar tab={tab} setTab={setTab} onSearch={() => setPaletteOpen(true)} variant="desktop" />
      {/* ستون محتوا */}
      <div className="flex min-w-0 flex-1 flex-col">
      {/* هدر */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#070b16]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <button onClick={() => setTab("dashboard")} className="flex items-center gap-3 text-right">
            <div className="relative grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-red-600 to-orange-600 shadow-lg shadow-red-900/40">
              <svg viewBox="0 0 32 32" className="h-7 w-7">
                <polygon points="16,3 29,16 16,29 3,16" fill="none" stroke="#fff" strokeWidth="2.2" />
                <path d="M16 9c1.4 2.8-1.4 3.8-1.4 5.6 0 0 1.9-1 1.9-2.8 1.6 1.6 2.6 3.4 2.6 5.4a4.4 4.4 0 1 1-8.8 0c0-2 1.4-3.4 2.4-4.6.5 1.5 2 1.5 2 .4 0-1.8 1.2-2.8 1.3-4z" fill="#fff" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-black leading-tight text-white sm:text-lg">مرجع مواد خطرناک آتش‌نشانی</h1>
              <p className="text-[11px] text-slate-400" dir="ltr">HAZMAT · Emergency Response Reference</p>
              <p className="mt-0.5 inline-flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">
                <AppBadge size={18} /> نسخه عمومی و متن‌باز
              </p>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDay}
              className={`grid h-9 w-9 place-items-center rounded-lg border transition ${dayMode ? "border-amber-500 bg-amber-100 text-amber-700" : "border-slate-600 bg-slate-800/70 text-slate-300 hover:bg-slate-700"}`}
              aria-label={dayMode ? "خاموش‌کردن حالت روز" : "حالت خوانایی زیر نور آفتاب"}
              title={dayMode ? "بازگشت به تم تیره" : "حالت خوانایی زیر نور آفتاب"}
            >
              <UIIcon name={dayMode ? "sun" : "moon"} className="h-5 w-5" />
            </button>
            <button
              onClick={() => setNavOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-600 bg-slate-800/70 text-slate-300 transition hover:bg-slate-700 lg:hidden"
              aria-label="باز کردن منو"
            >
              <UIIcon name="menu" className="h-5 w-5" />
            </button>
            <button
              onClick={() => setPaletteOpen(true)}
              className="hidden items-center gap-2 rounded-lg border border-slate-600 bg-slate-800/70 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-700 sm:flex"
            >
              <UIIcon name="search" className="h-4 w-4" />
              <span>جستجو</span>
              <kbd className="rounded border border-slate-600 bg-slate-900 px-1 text-[10px] text-slate-500">Ctrl K</kbd>
            </button>
            <button
              onClick={() => setPaletteOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-600 bg-slate-800/70 text-slate-300 transition hover:bg-slate-700 sm:hidden"
              aria-label="جستجو"
            >
              <UIIcon name="search" className="h-5 w-5" />
            </button>
            <a
              href="tel:125"
              className="flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-300 transition hover:bg-red-500/20"
            >
              <span className="relative flex h-2.5 w-2.5">
              <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-red-500" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            <span className="hidden sm:inline">آتش‌نشانی</span>
            <span className="font-mono-num">۱۲۵</span>
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:py-8">
        {tab === "dashboard" && <Dashboard onTab={setTab} onMaterial={openMaterial} favorites={fav.ids} onToggleFav={fav.toggle} />}
        {tab === "assistant" && <Assistant onMaterial={openMaterial} />}
        {tab === "quick" && <QuickResponse onSearch={() => setPaletteOpen(true)} onTool={() => setTab("tactical")} onProcedures={() => setTab("procedures")} />}
        {tab === "materials" && <MaterialsView onMaterial={openMaterial} favorites={fav.ids} onToggleFav={fav.toggle} />}
        {tab === "nfpa" && <NfpaView />}
        {tab === "classes" && <ClassesView />}
        {tab === "erg" && <ErgView initialGuide={guide} onPick={setGuide} />}
        {tab === "procedures" && <ProceduresView />}
        {tab === "tactical" && <TacticalTools />}
        {tab === "glossary" && <GlossaryView />}
        {tab === "manual" && <Manual />}
      </main>

      {/* فوتر */}
      <footer className="mt-12 border-t border-slate-800 bg-[#070b16]">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-sm leading-7 text-amber-200/90">
            <div className="mb-1 flex items-center gap-2 font-bold text-amber-300">
              <UIIcon name="alert" className="h-5 w-5" />
              هشدار مهم — صرفاً جهت آموزش و یادآوری سریع
            </div>
            این مرجع جایگزین راهنمای رسمی <span className="font-mono-num font-bold">ERG</span>، برگه‌های اطلاعات ایمنی (SDS) و دستورالعمل سازمان آتش‌نشانی شما نیست. در حادثه واقعی همواره منابع رسمی، نظر فرمانده حادثه (IC) و تیم متخصص مواد خطرناک را ملاک قرار دهید. اطلاعات نقاط اشتعال، فاصله‌ها و سمیت تقریبی و محیط‌بسته است.
          </div>
          {/* معرفی مرجع */}
          <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-amber-500/30 bg-gradient-to-bl from-amber-950/30 to-slate-950/40 p-5 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-3">
              <AppLogo size={64} />
              <div className="hidden h-10 w-px bg-slate-700 sm:block" />
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-300">مرجع واکنش اضطراری مواد خطرناک</p>
                <p className="text-[11px] text-slate-500">Persian ERG Reference · متن‌باز و آفلاین</p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-sm font-black text-amber-300">مرجع فارسی و متن‌باز راهنمای واکنش اضطراری (ERG)</p>
              <p className="mt-1 text-xs text-slate-500">برای استفاده آتش‌نشانان، نیروهای HSE و تیم‌های واکنش اضطراری</p>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-slate-500">
            بر پایه استانداردهای NFPA 704، GHS و Emergency Response Guidebook · نسخه آفلاین (PWA)
          </p>
          <p className="mt-3 text-center text-xs text-slate-600">
            طراحی و توسعه: <span className="font-bold text-slate-400">یاسین گنجی</span>
          </p>
        </div>
      </footer>
      </div>{/* پایان ستون محتوا */}

      {selected && <MaterialDetail material={selected} onClose={() => setSelected(null)} onOpenGuide={openGuide} />}
      <SearchPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onMaterial={openMaterialById}
        onGuide={openGuide}
        onGlossary={() => setTab("glossary")}
      />

      {/* منوی کشویی — موبایل */}
      {navOpen && (
        <div className="fixed inset-0 z-[55] lg:hidden" onClick={() => setNavOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="slide-in absolute right-0 top-0 h-full" onClick={(e) => e.stopPropagation()}>
            <Sidebar
              tab={tab}
              setTab={(t) => { setTab(t); setNavOpen(false); }}
              onSearch={() => { setPaletteOpen(true); setNavOpen(false); }}
              onClose={() => setNavOpen(false)}
              variant="mobile"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* =================== داشبورد =================== */

function Dashboard({ onTab, onMaterial, favorites, onToggleFav }: { onTab: (t: TabId) => void; onMaterial: (m: Material) => void; favorites: string[]; onToggleFav: (id: string) => void }) {
  const highRisk = materials
    .filter((m) => m.nfpa && (m.nfpa.health >= 3 || m.nfpa.flammability >= 4))
    .sort((a, b) => {
      const score = (m: Material) => (m.nfpa?.health ?? 0) + (m.nfpa?.flammability ?? 0) + (m.nfpa?.instability ?? 0);
      return score(b) - score(a);
    })
    .slice(0, 6);
  const tih = materials.filter((m) => m.isolation);
  const favMaterials = favorites.map((id) => materials.find((m) => m.id === id)).filter(Boolean) as Material[];

  const stats = [
    { icon: "flask", value: materials.length, label: "ماده خطرناک ثبت‌شده", color: "text-amber-300" },
    { icon: "alert", value: 9, label: "رده خطر DOT", color: "text-amber-300" },
    { icon: "book", value: Object.keys(ergGuides).length, label: "راهنمای واکنش", color: "text-emerald-300" },
    { icon: "wind", value: tih.length, label: "گاز سمی تنفسی (TIH)", color: "text-red-300" },
  ];

  return (
    <div className="space-y-8">
      {/* هیرو */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#070b16] p-6 sm:p-10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-50" />
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-red-600/20 blur-3xl" />
          <div className="absolute -bottom-28 -left-16 h-80 w-80 rounded-full bg-orange-500/15 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#070b16] via-[#070b16]/70 to-[#070b16]/30" />
        </div>
        <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-red-600/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="relative z-10 grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-300">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              آماده واکنش اضطراری · HAZMAT
            </div>
            <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl">
              واکنش سریع و ایمن به
              <br />
              <span className="bg-gradient-to-l from-red-400 to-orange-400 bg-clip-text text-transparent">مواد خطرناک</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">
              پایگاه داده مرجع مواد، لوزی ایمنی NFPA 704، رده‌بندی خطر DOT، راهنمای واکنش اضطراری ERG و رویه‌های میدانی — همگی در یک ابزار سریع برای نیروهای آتش‌نشانی و امداد.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={() => onTab("quick")} className="flex items-center gap-2 rounded-xl bg-gradient-to-l from-red-600 to-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-900/40 transition hover:from-red-500 hover:to-orange-500">
                <UIIcon name="bolt" className="h-4 w-4" />
                واکنش سریع در صحنه
              </button>
              <button onClick={() => onTab("assistant")} className="flex items-center gap-2 rounded-xl bg-gradient-to-l from-amber-500 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-900/40 transition hover:from-amber-400 hover:to-indigo-500">
                <UIIcon name="ai" className="h-4 w-4" />
                دستیار هوشمند
              </button>
              <button onClick={() => onTab("materials")} className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-5 py-2.5 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
                <UIIcon name="search" className="h-4 w-4" />
                جستجوی مواد
              </button>
            </div>
          </div>
          <div className="hidden justify-self-center md:flex">
            <NFPADiamond nfpa={{ health: 4, flammability: 4, instability: 3, special: "OX" }} size={200} />
          </div>
        </div>
      </section>

      {/* بنر معرفی */}
      <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-amber-500/30 bg-gradient-to-l from-amber-950/40 via-[#0b1426] to-[#0b1426] px-4 py-3">
        <AppLogo size={44} />
        <span className="text-sm font-bold text-slate-200">مرجع فارسی راهنمای واکنش اضطراری (ERG) — متن‌باز، آفلاین و رایگان برای همه نیروهای امدادی.</span>
      </div>

      {/* آمار */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="fade-up rounded-2xl border border-slate-800 bg-slate-900/50 p-4 transition hover:border-slate-700 hover:bg-slate-900">
            <UIIcon name={s.icon} className={`h-6 w-6 ${s.color}`} />
            <p className="mt-2 font-mono-num text-3xl font-black text-white">{s.value}</p>
            <p className="text-xs text-slate-400">{s.label}</p>
          </div>
        ))}
      </section>

      {/* مواد موردعلاقه */}
      {favMaterials.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <UIIcon name="shield" className="h-5 w-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">مواد موردعلاقه</h3>
            <span className="font-mono-num rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">{favMaterials.length}</span>
          </div>
          <div className="fade-up grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {favMaterials.map((m) => (
              <MaterialCard key={m.id} material={m} onSelect={onMaterial} isFav onToggleFav={onToggleFav} />
            ))}
          </div>
        </section>
      )}

      {/* دسترسی سریع به مواد پرریسک */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold text-white">
            <UIIcon name="alert" className="h-5 w-5 text-red-400" />
            مواد پرخطر (سمی/قابل اشتعال)
          </h3>
          <button onClick={() => onTab("materials")} className="flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300">
            همه مواد <UIIcon name="arrow" className="h-4 w-4" />
          </button>
        </div>
        <div className="fade-up grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {highRisk.map((m) => (
              <MaterialCard key={m.id} material={m} onSelect={onMaterial} />
          ))}
        </div>
      </section>

      {/* ورودی‌های سریع */}
      <section className="grid gap-3 md:grid-cols-3">
        {[
          { id: "nfpa", icon: "diamond", title: "لوزی NFPA 704", desc: "یادگیری رنگ‌ها و درجه‌بندی ۰ تا ۴ سلامت، اشتعال و ناپایداری" },
          { id: "classes", icon: "alert", title: "رده‌های خطر DOT", desc: "۹ رده اصلی مواد خطرناک با پلاکارد و نماد استاندارد" },
          { id: "procedures", icon: "shield", title: "رویه‌های اضطراری", desc: "ارزیابی صحنه، تخلیه، PPE، رفع آلودگی و سیستم فرمان" },
        ].map((c) => (
          <button key={c.id} onClick={() => onTab(c.id as TabId)} className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-5 text-right transition hover:border-slate-600 hover:bg-slate-900">
            <UIIcon name={c.icon} className="h-7 w-7 text-amber-400 transition group-hover:scale-110" />
            <h4 className="mt-3 font-bold text-white">{c.title}</h4>
            <p className="mt-1 text-sm leading-6 text-slate-400">{c.desc}</p>
          </button>
        ))}
      </section>

      {/* هشدار گازهای سمی */}
      {tih.length > 0 && (
        <section className="rounded-2xl border border-red-500/30 bg-red-950/20 p-5">
          <div className="flex items-center gap-2">
            <UIIcon name="wind" className="h-5 w-5 text-red-300" />
            <h3 className="font-bold text-red-200">گازهای سمی تنفسی (TIH) — نیاز به تخلیه گسترده</h3>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {tih.map((m) => (
              <button key={m.id} onClick={() => onMaterial(m)} className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-black/30 px-3 py-1.5 text-sm text-red-100 transition hover:bg-black/50">
                {m.nfpa ? <NFPADiamond nfpa={m.nfpa} size={24} showLabels={false} /> : <span className="h-3 w-3 rounded-full bg-red-500" />}
                {m.nameFa}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* =================== کارت ماده =================== */

const MaterialCard = memo(function MaterialCard({ material, onSelect, isFav, onToggleFav }: { material: Material; onSelect: (m: Material) => void; isFav?: boolean; onToggleFav?: (id: string) => void }) {
  const pc = placardForClass(material.hazardClass);
  return (
    <div className="group relative">
      <button
        onClick={() => onSelect(material)}
        className="flex w-full items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-right transition hover:border-amber-500/50 hover:bg-slate-900"
      >
        {material.nfpa ? (
          <NFPADiamond nfpa={material.nfpa} size={56} showLabels={false} />
        ) : (
          <span className="grid place-items-center p-0.5">
            <DOTPlacard number={pc.number} symbol={pc.symbol} bg={pc.bg} fg={pc.fg} size={56} />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            <span className="font-mono-num rounded border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">UN {material.un}</span>
            <span className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">رده {material.hazardClass}</span>
          </div>
          <p className="truncate font-bold text-slate-100">{material.nameFa}</p>
          <p className="truncate text-xs text-slate-500" dir="ltr">{material.nameEn}</p>
        </div>
        <UIIcon name="arrow" className="h-5 w-5 shrink-0 text-slate-600 transition group-hover:text-amber-400" />
      </button>
      {onToggleFav && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav(material.id);
          }}
          className={`absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-lg border backdrop-blur transition ${isFav ? "border-amber-500/40 bg-amber-500/15 text-amber-400" : "border-slate-600/60 bg-slate-900/70 text-slate-500 hover:text-amber-400"}`}
          aria-label={isFav ? "حذف از موردعلاقه" : "افزودن به موردعلاقه"}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round">
            <path d="M12 3.5l2.7 5.5 6 .9-4.3 4.2 1 6L12 17.7 6.6 20.6l1-6L3.3 9.9l6-.9z" />
          </svg>
        </button>
      )}
    </div>
  );
});

/* =================== نمای مواد =================== */

function MaterialsView({ onMaterial, favorites, onToggleFav }: { onMaterial: (m: Material) => void; favorites: string[]; onToggleFav: (id: string) => void }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  const categories = useMemo(() => {
    const present = new Set(materials.map((m) => categoryOf(m)));
    return CATEGORY_ORDER.filter((c) => present.has(c));
  }, []);

  const filtered = useMemo(() => {
    const raw = q.trim();
    const query = normalizeSearchText(raw);
    return materials.filter((m) => {
      const matchQ = !query || materialSearchText(m).includes(query) || normalizeSearchText(categoryOf(m)).includes(query);
      const matchC = cat === "all" || categoryOf(m) === cat;
      return matchQ && matchC;
    });
  }, [q, cat]);

  const grouped = useMemo(() => {
    const map = new Map<string, Material[]>();
    for (const m of filtered) {
      const c = categoryOf(m);
      if (!map.has(c)) map.set(c, []);
      map.get(c)!.push(m);
    }
    return categories.filter((c) => map.has(c)).map((c) => ({ category: c, items: map.get(c)! }));
  }, [filtered, categories]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-white">پایگاه داده مواد خطرناک</h2>
        <p className="text-sm text-slate-400">جستجو در {materials.length} ماده بر اساس نام، شماره UN یا دسته — برای جزئیات و راهنمای واکنش روی هر ماده بزنید.</p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative">
          <UIIcon name="search" className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="نام ماده، شماره UN، نام انگلیسی..."
            className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pr-11 pl-10 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-500"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              aria-label="پاک‌کردن جستجو"
              className="absolute left-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md text-slate-500 transition hover:bg-slate-800 hover:text-slate-300"
            >
              <UIIcon name="close" className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          <FilterChip active={cat === "all"} onClick={() => setCat("all")}>همه ({materials.length})</FilterChip>
          {categories.map((c) => (
            <FilterChip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</FilterChip>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-500">{filtered.length} ماده یافت شد</p>

      {grouped.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center text-slate-500">ماده‌ای یافت نشد.</div>
      ) : (
        <div className="space-y-7">
          {grouped.map((g) => (
            <div key={g.category}>
              <div className="mb-3 flex items-center gap-3">
                <h3 className="text-sm font-black text-slate-200">{g.category}</h3>
                <span className="font-mono-num rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-400">{g.items.length}</span>
                <div className="h-px flex-1 bg-slate-800" />
              </div>
              <div className="fade-up grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map((m) => (
                  <MaterialCard key={m.id} material={m} onSelect={onMaterial} isFav={favorites.includes(m.id)} onToggleFav={onToggleFav} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-lg border px-3 py-2 text-sm font-bold transition ${
        active ? "border-amber-500 bg-amber-500/15 text-amber-300" : "border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

/* =================== نمای لوزی NFPA =================== */

function NfpaView() {
  const [h, setH] = useState(4);
  const [f, setF] = useState(3);
  const [i, setI] = useState(0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">لوزی ایمنی NFPA 704</h2>
        <p className="text-sm text-slate-400">سیستم استاندارد شناسایی خطرات مواد برای واکنش اضطراری. عدد بالاتر = خطر بیشتر.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* تعاملی */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex justify-center">
            <NFPADiamond nfpa={{ health: h, flammability: f, instability: i }} size={220} />
          </div>
          <div className="mt-6 space-y-4">
            <RatingPicker label="سلامت" value={h} onChange={setH} color={NFPA_COLORS.health} fg="#fff" />
            <RatingPicker label="قابل اشتعال" value={f} onChange={setF} color={NFPA_COLORS.flammability} fg="#fff" />
            <RatingPicker label="ناپایداری" value={i} onChange={setI} color={NFPA_COLORS.instability} fg="#1f2937" />
          </div>
        </div>

        {/* راهنمای رنگ‌ها */}
        <div className="space-y-3">
          <NFPALegend color={NFPA_COLORS.health} label="آبی — سلامت (Health)" desc="خطر برای بدن (سمیت، خورندگی)" scale={NFPA_SCALE.health} />
          <NFPALegend color={NFPA_COLORS.flammability} label="قرمز — قابل اشتعال (Fire)" desc="تمایل به اشتعال" scale={NFPA_SCALE.flammability} />
          <NFPALegend color={NFPA_COLORS.instability} label="زرد — ناپایداری (Reactivity)" desc="آزادی انرژی (انفجار، واکنش)" scale={NFPA_SCALE.instability} />
        </div>
      </div>

      {/* خطرات ویژه */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <h3 className="mb-3 flex items-center gap-2 font-bold text-white">
          <span className="grid h-7 w-7 place-items-center rounded-md border-2 border-slate-700 text-sm font-black text-slate-200">W</span>
          خطرات ویژه (مربع سفید پایین)
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { code: "OX", desc: "اکسیدکننده — آتش‌سوزی را تقویت می‌کند", color: "#f59e0b" },
            { code: "SA", desc: "خفگی‌آور ساده — گازهای خنثی (نیتروژن، آرگون)", color: "#38bdf8" },
            { code: "W", desc: "با آب واکنش می‌دهد — استفاده از آب ممنوع", color: "#f87171" },
            { code: "★", desc: "پلیمریزه‌شونده ساده / واکنش رادیکالی", color: "#a78bfa" },
          ].map((s) => (
            <div key={s.code} className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-3">
              <span className="grid h-9 w-9 place-items-center rounded-md border-2 text-sm font-black" style={{ borderColor: s.color, color: s.color }}>{s.code}</span>
              <p className="mt-2 text-xs leading-6 text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* نمادهای خطر GHS */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <h3 className="mb-1 text-lg font-bold text-white">نمادهای خطر GHS</h3>
        <p className="mb-4 text-sm text-slate-400">نمادهای لوزی قرمز استاندارد جهانی برای طبقه‌بندی و برچسب‌گذاری مواد شیمیایی.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ghsReference.map((g) => (
            <div key={g.id} className="flex items-start gap-3 rounded-xl border border-slate-700/60 bg-slate-900/60 p-3">
              <GHSIcon id={g.id} className="h-11 w-11 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-100">{g.name}</p>
                <p className="text-xs leading-6 text-slate-400">{g.meaning}</p>
                <p className="mt-1 text-[11px] text-slate-500">نمونه: {g.examples}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RatingPicker({ label, value, onChange, color, fg }: { label: string; value: number; onChange: (v: number) => void; color: string; fg: string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-200">{label}</span>
        <span className="font-mono-num text-xs text-slate-500">درجه {value} از ۴</span>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2, 3, 4].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`grid h-9 flex-1 place-items-center rounded-md text-sm font-black transition ${
              value === n ? "ring-2 ring-white" : "opacity-50 hover:opacity-90"
            }`}
            style={{ background: n === 0 ? "#475569" : color, color: n === 0 ? "#fff" : fg }}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

/* =================== نمای رده‌های خطر =================== */

function ClassesView() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-white">رده‌بندی خطر DOT</h2>
        <p className="text-sm text-slate-400">۹ رده اصلی مواد خطرناک مطابق مقررات حمل‌ونقل، با پلاکارد و نماد استاندارد.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hazardClasses.map((c) => {
          const cfg = PLACARD_CONFIG[c.number];
          return (
            <div key={c.number} className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="flex items-center gap-4">
                <div className="shrink-0 rounded-lg bg-slate-950/60 p-1">
                  <DOTPlacard number={c.number} symbol={c.symbol} bg={cfg.bg} fg={cfg.fg} size={72} />
                </div>
                <div>
                  <p className="font-mono-num text-xs text-slate-500">رده {c.number}</p>
                  <h3 className="font-bold text-white">{c.nameFa}</h3>
                  <p className="text-xs text-slate-500" dir="ltr">{c.nameEn}</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-400">{c.description}</p>

              {c.divisions.length > 0 && (
                <div className="mt-3">
                  <p className="mb-1 text-xs font-bold text-slate-500">تقسیم‌بندی</p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.divisions.map((d) => (
                      <span key={d.id} className="rounded border border-slate-700 bg-slate-800/60 px-2 py-0.5 text-xs text-slate-300">
                        <span className="font-mono-num font-bold text-amber-300">{d.id}</span> {d.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto pt-3">
                <p className="mb-1 text-xs font-bold text-slate-500">نمونه‌ها</p>
                <p className="text-xs text-slate-400">{c.examples.join("، ")}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* جدول پلاکارد رنگ‌ها برای رده ۲ */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <h3 className="mb-3 font-bold text-white">پلاکارد رنگی رده ۲ (گازها)</h3>
        <div className="flex flex-wrap gap-4">
          {[
            { id: "2.1", name: "قابل اشتعال", bg: "#ef4444", fg: "#fff" },
            { id: "2.2", name: "غیرقابل اشتعال / غیرسمی", bg: "#22c55e", fg: "#fff" },
            { id: "2.3", name: "سمی", bg: "#f8fafc", fg: "#1f2937" },
          ].map((g) => (
            <div key={g.id} className="flex items-center gap-3">
              <DOTPlacard number={g.id} symbol="gas" bg={g.bg} fg={g.fg} size={56} />
              <span className="text-sm text-slate-300">{g.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =================== نمای راهنمای ERG =================== */

function ErgView({ initialGuide, onPick }: { initialGuide: number | null; onPick: (n: number) => void }) {
  const guideNums = useMemo(() => Object.keys(ergGuides).map(Number).sort((a, b) => a - b), []);
  const [active, setActive] = useState<number>(initialGuide && ergGuides[initialGuide] ? initialGuide : guideNums[0]);

  // همگام‌سازی با انتخاب از یک ماده (به‌جای setState در حین رندر)
  useEffect(() => {
    if (initialGuide && ergGuides[initialGuide]) setActive(initialGuide);
  }, [initialGuide]);

  const g = ergGuides[active];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-white">راهنمای واکنش اضطراری (ERG)</h2>
        <p className="text-sm text-slate-400">صفحات راهنمای استاندارد برای واکنش به حمل مواد خطرناک — بر اساس شماره راهنما روی پلاکارد.</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        {/* فهرست راهنماها */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-3">
          <p className="mb-2 px-2 text-xs font-bold text-slate-500">انتخاب راهنما</p>
          <div className="max-h-[70vh] space-y-1 overflow-y-auto pr-1">
            {guideNums.map((n) => (
              <button
                key={n}
                onClick={() => {
                  setActive(n);
                  onPick(n);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-right transition ${
                  active === n ? "bg-red-600 text-white" : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <span className="text-sm">{ergGuides[n].title}</span>
                <span className={`font-mono-num shrink-0 text-xs ${active === n ? "text-red-100" : "text-slate-500"}`}>{n}</span>
              </button>
            ))}
          </div>
        </div>

        {/* محتوای راهنما */}
        {g && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-l from-slate-900 to-slate-800/40 p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-red-600 font-mono-num text-lg font-black text-white">{g.number}</span>
                <div>
                  <h3 className="text-lg font-black text-white">{g.title}</h3>
                  <p className="text-xs text-slate-400" dir="ltr">Guide {g.number} · {g.titleEn}</p>
                </div>
              </div>
            </div>

            <ErgBlock icon="alert" title="خطرات بالقوه" items={g.potentialHazards} tone="danger" />
            <ErgBlock icon="shield" title="ایمنی عمومی" items={g.publicSafety} tone="info" />
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
              <div className="mb-2 flex items-center gap-2">
                <UIIcon name="helmet" className="h-5 w-5 text-amber-300" />
                <h4 className="font-bold text-amber-200">لباس حفاظتی</h4>
              </div>
              <p className="text-sm leading-7 text-amber-100/90">{g.protectiveClothing}</p>
            </div>
            <ErgBlock icon="wind" title="تخلیه" items={g.evacuation} tone="warn" />
            <ErgBlock icon="fire" title="واکنش به آتش" items={g.fire} tone="default" />
            <ErgBlock icon="drop" title="واکنش به نشتی" items={g.spill} tone="info" />
            <ErgBlock icon="assessment" title="کمک‌های اولیه" items={g.firstAid} tone="danger" />
          </div>
        )}
      </div>
    </div>
  );
}

function ErgBlock({ icon, title, items, tone }: { icon: string; title: string; items: string[]; tone: "default" | "danger" | "warn" | "info" }) {
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

/* =================== نمای رویه‌ها =================== */

function ProceduresView() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-white">رویه‌های واکنش اضطراری</h2>
        <p className="text-sm text-slate-400">چک‌لیست‌های کلیدی برای مدیریت حادثه مواد خطرناک از لحظه رسیدن تا پایان عملیات.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {procedures.map((p) => (
          <div key={p.id} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="mb-3 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 text-amber-300">
                <UIIcon name={p.icon} className="h-6 w-6" />
              </span>
              <h3 className="font-bold text-white">{p.title}</h3>
            </div>
            <ol className="space-y-2">
              {p.steps.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm leading-7 text-slate-300">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-red-600/20 font-mono-num text-xs font-bold text-red-300">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =================== واژه‌نامه =================== */

function GlossaryView() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const query = normalizeSearchText(q);
    if (!query) return glossary;
    return glossary.filter((t) => [t.abbr, t.fa, t.en, t.def].some((value) => normalizeSearchText(value).includes(query)));
  }, [q]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-white">واژه‌نامه اصطلاحات HAZMAT</h2>
        <p className="text-sm text-slate-400">سرنام‌ها و اصطلاحات رایج در حوزه واکنش اضطراری و مواد خطرناک — قابل جستجو.</p>
      </div>
      <div className="relative">
        <UIIcon name="search" className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="جستجوی اصطلاح یا سرنام..."
          className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pr-11 pl-10 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-500"
        />
        {q && (
          <button
            onClick={() => setQ("")}
            aria-label="پاک‌کردن جستجو"
            className="absolute left-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md text-slate-500 transition hover:bg-slate-800 hover:text-slate-300"
          >
            <UIIcon name="close" className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <div key={t.abbr} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="flex items-center gap-2">
              <span className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-2 py-1 font-mono-num text-xs font-black text-amber-300">{t.abbr}</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-100">{t.fa}</p>
                <p className="truncate text-[11px] text-slate-500" dir="ltr">{t.en}</p>
              </div>
            </div>
            <p className="mt-2 text-xs leading-6 text-slate-400">{t.def}</p>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center text-slate-500">موردی یافت نشد.</div>}
    </div>
  );
}
