# مرجع مواد خطرناک — راهنمای واکنش اضطراری ERG فارسی

**erg-fa** — مرجع فارسی، متن‌باز و کاملاً آفلاینِ کتاب راهنمای واکنش اضطراری (Emergency Response Guidebook – ERG) برای آتش‌نشانان، نیروهای HSE و تیم‌های واکنش اضطراری.

تا امروز هیچ مرجع فارسیِ قابل‌استفاده در میدان برای ERG وجود نداشت؛ این ابزار برای پر کردن همین خلأ ساخته شده است: در محل حادثه، بدون اینترنت، در چند ثانیه ماده را پیدا کنید و فاصله ایزولاسیون، تجهیزات حفاظت فردی و اقدامات اولیه را ببینید.

## امکانات

- 🔎 **جستجوی سریع** بر اساس نام فارسی/انگلیسی، شماره UN و شماره راهنما (Ctrl+K)
- 🧪 **۲۶۱ ماده با مشخصات کامل**: کلاس خطر، لوزی NFPA 704، پیکتوگرام‌های GHS، نقطه اشتعال، رفتار بخار، PPE پیشنهادی، فواصل ایزولاسیون و اقدامات حفاظتی
- 📚 **نمایه کامل ۱٬۵۶۷ مدخل ERG 2024** بر اساس شماره UN
- 📖 **متن راهنماهای ERG** (صفحات نارنجی): خطرات، ایمنی عمومی، لباس حفاظتی، تخلیه، آتش، نشت و کمک‌های اولیه
- ⚡ **واکنش سریع** و ابزارهای تاکتیکی میدانی
- 🤖 **دستیار محلی آفلاین** برای جستجو در داده‌های برنامه — بدون ارسال هیچ داده‌ای به سرور
- 📴 **کاملاً آفلاین (PWA)**: پس از اولین بازدید روی گوشی نصب می‌شود و بدون اینترنت کار می‌کند
- ☀️ حالت خوانایی زیر نور آفتاب و تم تیره برای کار شبانه

## اجرا و توسعه

```bash
npm install
npm run dev      # محیط توسعه
npm run build    # خروجی نهایی تک‌فایل در dist/
npm run preview  # پیش‌نمایش خروجی
```

خروجی build یک فایل HTML مستقل است و روی هر هاست استاتیکی (از جمله GitHub Pages) قابل انتشار است.

## منابع داده

داده‌ها بر پایه منابع عمومی و استانداردهای زیر گردآوری شده‌اند:

- **Emergency Response Guidebook (ERG 2024)** — وزارت حمل‌ونقل ایالات متحده (PHMSA)
- **NFPA 704** — سیستم لوزی خطر
- **GHS** — سیستم هماهنگ جهانی طبقه‌بندی و برچسب‌گذاری مواد شیمیایی

## ⚠️ هشدار مهم

این یک مرجع **غیررسمی** و کمکی است و جایگزین کتاب رسمی ERG، برگه اطلاعات ایمنی (SDS)، دستورالعمل‌های سازمان شما و نظر فرمانده حادثه نیست. در حادثه واقعی همیشه منابع رسمی را ملاک قرار دهید و مقادیر حساس (فواصل، سمیت، نقاط اشتعال) را با منبع اصلی تطبیق دهید.

## مشارکت

گزارش خطای داده، پیشنهاد ماده جدید و Pull Request مورد استقبال است — به‌ویژه از سوی آتش‌نشانان و کارشناسان HSE. لطفاً برای اصلاح داده‌های ایمنی، منبع (صفحه ERG یا SDS) را هم ذکر کنید.

## سازنده

**یاسین گنجی** — آتش‌نشان صنعتی؛ این ابزار را برای استفاده واقعی در عملیات ساخته و نگهداری می‌کند.

## مجوز

منتشرشده تحت مجوز [MIT](LICENSE). داده‌های ERG متعلق به منابع عمومی اصلی خود هستند.

---

## English summary

**erg-fa** is a free, open-source, offline-first Persian (Farsi) reference for the *Emergency Response Guidebook (ERG 2024)*, built for firefighters, HSE officers and emergency responders in Persian-speaking regions — where no field-usable Persian ERG reference existed.

It includes 261 fully detailed hazardous-material entries (NFPA 704 diamonds, GHS pictograms, isolation & protective-action distances, PPE guidance), the complete 1,567-entry ERG 2024 UN index, full ERG guide texts, tactical field tools and a local on-device assistant. It ships as a single-file PWA that works fully offline after the first visit.

Built and maintained by **Yasin Ganji**, an industrial firefighter, and used in real hazmat response work.

> ⚠️ Unofficial quick-reference tool. Always verify against the official ERG, the material's SDS and your incident commander's direction.

MIT License — see [LICENSE](LICENSE).
