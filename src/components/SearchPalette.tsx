import { useEffect, useMemo, useRef, useState } from "react";
import { materials, ergGuides, glossary, materialSearchText, normalizeSearchText } from "../data/hazmat";
import { UIIcon, GHSIcon } from "./icons";

type Result =
  | { type: "material"; id: string; title: string; sub: string; un: string; ghs?: string[] }
  | { type: "guide"; number: number; title: string }
  | { type: "glossary"; abbr: string; title: string; sub: string };

export function SearchPalette({
  open,
  onClose,
  onMaterial,
  onGuide,
  onGlossary,
}: {
  open: boolean;
  onClose: () => void;
  onMaterial: (id: string) => void;
  onGuide: (n: number) => void;
  onGlossary: () => void;
}) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const all = useMemo<Result[]>(() => {
    const mats: Result[] = materials.map((m) => ({
      type: "material" as const,
      id: m.id,
      title: m.nameFa,
      sub: m.nameEn,
      un: m.un,
      ghs: m.ghs,
    }));
    const guides: Result[] = Object.values(ergGuides).map((g) => ({
      type: "guide" as const,
      number: g.number,
      title: g.title,
    }));
    const terms: Result[] = glossary.map((t) => ({
      type: "glossary" as const,
      abbr: t.abbr,
      title: `${t.abbr} — ${t.fa}`,
      sub: t.en,
    }));
    return [...mats, ...guides, ...terms];
  }, []);

  const results = useMemo(() => {
    const raw = q.trim();
    const query = normalizeSearchText(raw);
    const guideQuery = query.replace(/^(?:erg|guide)\s+/, "").trim();
    if (!raw) return all.slice(0, 12);
    const matches = all
      .filter((r) => {
        if (r.type === "material") {
          const material = materials.find((m) => m.id === r.id);
          return material ? materialSearchText(material).includes(query) : false;
        }
        if (r.type === "guide") return normalizeSearchText(String(r.number)).includes(guideQuery) || normalizeSearchText(r.title).includes(query);
        return normalizeSearchText(r.title).includes(query) || normalizeSearchText(r.sub).includes(query) || normalizeSearchText(r.abbr).includes(query);
      });

    // Keep an exact ERG number visible even when many UN numbers share the query.
    const score = (r: Result) => {
      if (r.type === "guide" && normalizeSearchText(String(r.number)) === guideQuery) return 3;
      if (r.type === "material" && normalizeSearchText(r.un) === query) return 2;
      if (r.type === "glossary" && normalizeSearchText(r.abbr) === query) return 2;
      return 0;
    };
    return matches.sort((a, b) => score(b) - score(a)).slice(0, 30);
  }, [q, all]);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [q]);

  if (!open) return null;

  const choose = (r: Result) => {
    if (r.type === "material") onMaterial(r.id);
    else if (r.type === "guide") onGuide(r.number);
    else onGlossary();
    onClose();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) choose(results[active]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const typeMeta: Record<string, { label: string; color: string }> = {
    material: { label: "ماده", color: "text-amber-300 border-amber-500/40 bg-amber-500/10" },
    guide: { label: "راهنما", color: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10" },
    glossary: { label: "اصطلاح", color: "text-amber-300 border-amber-500/40 bg-amber-500/10" },
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-8" onClick={onClose}>
      <div className="fade-up mt-[8vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700 bg-[#0a1020] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-700 px-4">
          <UIIcon name="search" className="h-5 w-5 text-slate-500" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="جستجوی ماده، شماره UN، راهنمای ERG یا اصطلاح..."
            className="w-full bg-transparent py-4 text-sm text-white placeholder-slate-500 outline-none"
          />
          <kbd className="hidden rounded border border-slate-600 bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400 sm:block">ESC</kbd>
        </div>
        <div className="max-h-[55vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">نتیجه‌ای یافت نشد.</div>
          ) : (
            results.map((r, i) => {
              const meta = typeMeta[r.type];
              return (
                <button
                  key={r.type === "material" ? r.id : r.type === "guide" ? `g${r.number}` : r.abbr}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(r)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-right transition ${i === active ? "bg-slate-800" : "hover:bg-slate-800/50"}`}
                >
                  {r.type === "material" ? (
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-slate-950 p-1">
                      {r.ghs?.[0] ? <GHSIcon id={r.ghs[0] as never} className="h-6 w-6" /> : <UIIcon name="flask" className="h-4 w-4 text-slate-500" />}
                    </span>
                  ) : (
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-md border text-xs font-bold ${meta.color}`}>
                      {r.type === "guide" ? r.number : "Aa"}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-slate-100">{r.title}</span>
                    <span className="block truncate text-xs text-slate-500" dir={r.type === "material" || r.type === "glossary" ? "ltr" : "rtl"}>
                      {r.type === "material" ? `${r.sub} · UN ${r.un}` : r.type === "guide" ? `Guide ${r.number}` : r.sub}
                    </span>
                  </span>
                  <span className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-bold ${meta.color}`}>{meta.label}</span>
                </button>
              );
            })
          )}
        </div>
        <div className="flex items-center justify-between border-t border-slate-700 px-4 py-2 text-[11px] text-slate-500">
          <span>جستجوی یکپارچه در {all.length} ورودی (مواد، راهنماها و واژه‌نامه)</span>
          <span className="flex items-center gap-2">
            <kbd className="rounded border border-slate-600 bg-slate-800 px-1">↑</kbd>
            <kbd className="rounded border border-slate-600 bg-slate-800 px-1">↓</kbd>
            پیمایش
          </span>
        </div>
      </div>
    </div>
  );
}
