import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ergGuides, glossary, materialSearchText, materials, normalizeSearchText, toLatinDigits, type Material } from "../data/hazmat";
import { UIIcon } from "./icons";

type ChatMsg = { role: "user" | "assistant"; text: string };

const QUICK_PROMPTS = ["نشتی آمونیاک چه کارهایی دارد؟", "اطلاعات کلر و فاصله ایمنی", "راهنمای ERG 115", "PPE مناسب چیست؟"];
const SAFETY_NOTE = "این پاسخ از داده‌های داخلی برنامه برای یادآوری سریع است؛ در حادثه واقعی با ERG رسمی، SDS و فرمانده حادثه تطبیق دهید.";

function findMaterialMatches(query: string): Material[] {
  const normalized = normalizeSearchText(query);
  const un = toLatinDigits(query).match(/\b\d{4}\b/)?.[0];
  const terms = normalized.split(" ").filter((term) => term.length > 1);
  const ranked = materials
    .map((material) => {
      const haystack = materialSearchText(material);
      let score = 0;
      if (un && material.un === un) score += 100;
      if (haystack.includes(normalized)) score += 30;
      for (const term of terms) if (haystack.includes(term)) score += term.length > 3 ? 4 : 2;
      return { material, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);
  return ranked.slice(0, 4).map(({ material }) => material);
}

function findGuide(query: string) {
  const number = toLatinDigits(query).match(/\b\d{3}\b/)?.[0];
  return number ? ergGuides[Number(number)] : undefined;
}

function formatMaterial(material: Material, query: string): string {
  const q = normalizeSearchText(query);
  const guide = ergGuides[material.guide];
  const lines = [
    `${material.nameFa} (${material.nameEn})`,
    `UN ${material.un} | رده ${material.hazardClass} — ${material.hazardClassName} | راهنمای ERG ${material.guide}`,
  ];
  if (material.description) lines.push(`\nشناخت: ${material.description}`);
  if (material.nfpa) lines.push(`NFPA: سلامت ${material.nfpa.health}، اشتعال ${material.nfpa.flammability}، ناپایداری ${material.nfpa.instability}${material.nfpa.special ? `، ویژه ${material.nfpa.special}` : ""}`);
  if (material.vapor) lines.push(`رفتار بخار: ${material.vapor}`);

  if (/فاصله|تخلیه|ایزوله|حفاظت|اقدام|protective|isolation/.test(q)) {
    if (material.isolation) lines.push(`ایزوله اولیه: نشتی کوچک ${material.isolation.small}؛ نشتی بزرگ ${material.isolation.large}.`);
    if (material.protectiveAction) lines.push(`اقدام حفاظتی: روز/شب برای نشتی کوچک ${material.protectiveAction.day} / ${material.protectiveAction.night}؛ نشتی بزرگ ${material.protectiveAction.largeDay} / ${material.protectiveAction.largeNight}.`);
    lines.push(`PPE: ${material.ppe ?? "در داده ماده ثبت نشده"}. ${guide.protectiveClothing}`);
    lines.push(`راهنمای عمومی تخلیه: ${guide.evacuation.join(" ")}`);
  } else if (/آتش|اطفا|حریق|fire/.test(q)) {
    if (material.fire) lines.push(`خطر آتش: ${material.fire}`);
    if (material.fireResponse) lines.push(`واکنش: ${material.fireResponse}`);
    lines.push(`اقدامات ERG: ${guide.fire.join(" ")}`);
  } else if (/نشت|ریزش|spill|leak|آلودگی/.test(q)) {
    if (material.spill) lines.push(`نشت: ${material.spill}`);
    lines.push(`اقدامات ERG: ${guide.spill.join(" ")}`);
  } else if (/کمک|مصدوم|تنفس|چشم|پوست|اولیه|first/.test(q)) {
    if (material.health) lines.push(`سلامت: ${material.health}`);
    if (material.firstAid?.length) lines.push(`کمک‌های اولیه: ${material.firstAid.join(" ")}`);
    lines.push(`کمک‌های اولیه ERG: ${guide.firstAid.join(" ")}`);
  } else {
    if (material.health) lines.push(`سلامت: ${material.health}`);
    if (material.fire) lines.push(`آتش: ${material.fire}`);
    if (material.reactivity) lines.push(`واکنش‌پذیری: ${material.reactivity}`);
    lines.push(`PPE ثبت‌شده: ${material.ppe ?? "ثبت نشده"}. برای جزئیات، راهنمای ERG ${material.guide} را باز کنید.`);
  }
  return `${lines.join("\n")}\n\n${SAFETY_NOTE}`;
}

function formatGuide(query: string): string | undefined {
  const guide = findGuide(query);
  if (!guide) return undefined;
  return [
    `راهنمای ERG ${guide.number}: ${guide.title} (${guide.titleEn})`,
    `\nخطرات احتمالی:\n• ${guide.potentialHazards.join("\n• ")}`,
    `\nایمنی عمومی:\n• ${guide.publicSafety.join("\n• ")}`,
    `\nلباس حفاظتی: ${guide.protectiveClothing}`,
    `\nتخلیه و اقدام حفاظتی:\n• ${guide.evacuation.join("\n• ")}`,
    `\nآتش:\n• ${guide.fire.join("\n• ")}`,
    `\nنشت:\n• ${guide.spill.join("\n• ")}`,
    `\nکمک‌های اولیه:\n• ${guide.firstAid.join("\n• ")}`,
    `\n${SAFETY_NOTE}`,
  ].join("\n");
}

function formatGlossary(query: string): string | undefined {
  const q = normalizeSearchText(query);
  const term = glossary.find((item) => [item.abbr, item.en, item.fa, item.def].some((value) => normalizeSearchText(value).includes(q) || q.includes(normalizeSearchText(value))));
  return term ? `${term.abbr} — ${term.fa}\n${term.en}\n\n${term.def}\n\n${SAFETY_NOTE}` : undefined;
}

function answer(query: string): string {
  const guideAnswer = formatGuide(query);
  if (guideAnswer) return guideAnswer;
  const materialMatches = findMaterialMatches(query);
  if (materialMatches.length === 1) return formatMaterial(materialMatches[0], query);
  if (materialMatches.length > 1) return `چند ماده مرتبط پیدا شد. برای پاسخ دقیق‌تر نام ماده یا شماره UN را کامل‌تر بنویسید:\n\n${materialMatches.map((m) => `• ${m.nameFa} — UN ${m.un} — ERG ${m.guide}`).join("\n")}\n\n${SAFETY_NOTE}`;
  const glossaryAnswer = formatGlossary(query);
  if (glossaryAnswer) return glossaryAnswer;
  return `در پایگاه داده آفلاین برای «${query}» تطبیق دقیقی پیدا نشد. نام فارسی/انگلیسی ماده، شماره UN یا شماره راهنمای ERG را وارد کنید.\n\nنمونه: «آمونیاک»، «UN 1005»، «ERG 125»، یا «فاصله تخلیه کلر».\n\n${SAFETY_NOTE}`;
}

function findLocalMatches(text: string): Material[] {
  const uns = new Set(toLatinDigits(text).match(/\b\d{4}\b/g) || []);
  return uns.size ? materials.filter((material) => uns.has(toLatinDigits(material.un))).slice(0, 3) : [];
}

export function Assistant({ onMaterial }: { onMaterial: (m: Material) => void }) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, loading]);

  function send(text = input) {
    const q = text.trim();
    if (!q || loading) return;
    setMessages((current) => [...current, { role: "user", text: q }]);
    setInput("");
    setLoading(true);
    window.setTimeout(() => {
      setMessages((current) => [...current, { role: "assistant", text: answer(q) }]);
      setLoading(false);
    }, 120);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-black text-white sm:text-2xl"><UIIcon name="cloud" className="h-6 w-6 text-amber-400" /> دستیار HAZMAT آفلاین</h1>
          <p className="text-sm text-slate-400">جست‌وجوی محلی در مواد، راهنماهای ERG و واژه‌نامه بدون اینترنت یا کلید API.</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-300"><UIIcon name="wifiOff" className="h-3.5 w-3.5" /> کاملاً آفلاین</span>
      </div>

      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-[12px] leading-6 text-amber-100"><b>یادآوری:</b> این بخش پاسخ تولیدی اینترنتی نیست؛ فقط داده‌های بسته‌شده داخل برنامه را بازیابی می‌کند. در عملیات واقعی همیشه با ERG رسمی، SDS و فرمانده حادثه تطبیق دهید.</div>

      <div className="min-h-[320px] max-h-[65vh] space-y-3 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        {messages.length === 0 && <div className="grid min-h-[280px] place-items-center text-center"><div className="max-w-lg space-y-3"><UIIcon name="cloud" className="mx-auto h-10 w-10 text-amber-500/60" /><p className="font-bold text-slate-300">درباره یک ماده یا راهنمای ERG بپرسید</p><div className="flex flex-wrap justify-center gap-2">{QUICK_PROMPTS.map((prompt) => <button key={prompt} onClick={() => send(prompt)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-300 hover:border-amber-500/50 hover:text-amber-300">{prompt}</button>)}</div></div></div>}
        {messages.map((message, index) => {
          const isUser = message.role === "user";
          const locals = isUser ? [] : findLocalMatches(message.text);
          return <div key={`${message.role}-${index}`} className={`flex ${isUser ? "justify-end" : "justify-start"}`}><div className={`max-w-[90%] space-y-2 rounded-xl px-4 py-2.5 text-sm leading-7 ${isUser ? "bg-amber-500/15 text-amber-100" : "border border-slate-700/60 bg-slate-900/60 text-slate-200"}`}><p className="whitespace-pre-wrap">{message.text}</p>{locals.length > 0 && <div className="flex flex-wrap gap-1.5 border-t border-slate-700/60 pt-2">{locals.map((material) => <button key={material.id} onClick={() => onMaterial(material)} className="rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-[11px] font-bold text-amber-300 hover:bg-amber-500/20">مشاهده {material.nameFa}</button>)}</div>}</div></div>;
        })}
        {loading && <div className="flex justify-start"><div className="rounded-xl border border-slate-700/60 bg-slate-900/60 px-4 py-3 text-xs text-slate-400">در حال جست‌وجوی پایگاه آفلاین...</div></div>}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2"><input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={onKeyDown} placeholder="نام ماده، UN، ERG یا اصطلاح را بنویسید..." className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-500" /><button onClick={() => send()} disabled={loading || !input.trim()} className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-l from-red-500 to-orange-500 text-white transition disabled:opacity-40" aria-label="جستجو"><UIIcon name="send" className="h-5 w-5" /></button>{messages.length > 0 && <button onClick={() => setMessages([])} className="hidden shrink-0 items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-xs font-bold text-slate-400 transition hover:bg-slate-800 sm:flex" title="پاک‌کردن گفتگو"><UIIcon name="trash" className="h-4 w-4" /></button>}</div>
    </div>
  );
}
