import { UIIcon } from "./icons";
import { AppBadge } from "./AppLogo";
import { materials, ergGuides, glossary } from "../data/hazmat";

// بخش راهنما — معرفی اپ + آموزش هر بخش (قابل چاپ/خروجی PDF)
function Doc({ id, n, icon, title, children }: { id?: string; n: number; icon: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-slate-200 py-5">
      <h2 className="mb-2 flex items-center gap-2 text-lg font-black text-slate-900">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-900 text-sm font-black text-white">{n}</span>
        <UIIcon name={icon} className="h-5 w-5 text-slate-500" />
        {title}
      </h2>
      <div className="space-y-2 text-[13.5px] leading-7 text-slate-700">{children}</div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return <li className="flex gap-2"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" /><span>{children}</span></li>;
}

function TocItem({ href, label }: { href: string; label: string }) {
  return <a href={href} className="hover:text-amber-700">{label}</a>;
}

export function Manual({ onClose }: { onClose?: () => void }) {
  return (
    <div className="print-area mx-auto max-w-3xl rounded-2xl bg-white p-6 text-slate-900 shadow-xl sm:p-10">
      {/* دکمه‌های بالا */}
      <div className="no-print mb-6 flex items-center justify-between">
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">راهنمای رسمی اپلیکیشن</span>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-700">
            <UIIcon name="print" className="h-4 w-4" /> چاپ / خروجی PDF
          </button>
          {onClose && (
            <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-300 text-slate-500 hover:bg-slate-100" aria-label="بستن">
              <UIIcon name="close" className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* جلد */}
      <header className="mb-6 border-b-2 border-slate-900 pb-5">
        <div className="flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-br from-red-600 to-orange-600">
            <svg viewBox="0 0 32 32" className="h-9 w-9"><polygon points="16,3 29,16 16,29 3,16" fill="none" stroke="#fff" strokeWidth="2.2" /><path d="M16 9c1.4 2.8-1.4 3.8-1.4 5.6 0 0 1.9-1 1.9-2.8 1.6 1.6 2.6 3.4 2.6 5.4a4.4 4.4 0 1 1-8.8 0c0-2 1.4-3.4 2.4-4.6.5 1.5 2 1.5 2 .4 0-1.8 1.2-2.8 1.3-4z" fill="#fff" /></svg>
          </div>
          <div>
            <h1 className="text-2xl font-black leading-tight text-slate-900 sm:text-3xl">مرجع مواد خطرناک آتش‌نشانی</h1>
            <p className="text-sm font-bold text-slate-500" dir="ltr">HAZMAT · Emergency Response Reference</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 font-bold text-amber-700"><AppBadge size={18} /> نسخه عمومی و متن‌باز</span>
          <span className="rounded-md bg-emerald-50 px-2 py-1 font-bold text-emerald-700">نسخه آفلاین (PWA)</span>
          <span className="rounded-md bg-slate-100 px-2 py-1 font-bold text-slate-600">طراحی و توسعه: یاسین گنجی</span>
        </div>
      </header>

      {/* ۱. معرفی */}
      <Doc n={1} icon="assessment" title="معرفی اپلیکیشن">
        <p>این اپلیکیشن یک مرجع متن‌باز واکنش اضطراری برای مواد خطرناک است که برای استفاده <b>افسران آتش‌نشانی، تیم‌های HSE و نیروهای واکنش اضطراری</b> طراحی شده است.</p>
        <p>هدف: ارائه دسترسی <b>سریع، آفلاین و قابل‌اتکا</b> به شناسایی مواد، خطرات، فواصل تخلیه، تجهیزات حفاظتی، راهنمای ERG، رویه‌های میدانی و ابزارهای محاسباتی — همه در یک ابزار.</p>
        <p>ویژگی کلیدی: <b>کاملاً آفلاین کار می‌کند.</b> پس از اولین بازدید، حتی بدون اینترنت در محل حادثه قابل استفاده است و می‌توان آن را روی گوشی نصب کرد (افزودن به صفحه اصلی — بخش ۱۳).</p>
        <p className="rounded-lg bg-slate-50 p-3 text-slate-600">
          <b>ساختار اپ:</b> در سمت راست صفحه (دسکتاپ) یا با دکمه ☰ (موبایل) یک منوی کناری با ۱۱ بخش وجود دارد: داشبورد، دستیار هوشمند، واکنش سریع، مواد خطرناک، ابزار تاکتیکی، نمادها، رده‌های خطر، راهنمای ERG، رویه‌ها، واژه‌نامه و راهنما (همین صفحه). با کلیک روی هرکدام، محتوای اصلی صفحه عوض می‌شود.
        </p>
      </Doc>

      {/* هشدار ایمنی (کادر راهنما، بدون شماره) */}
      <div className="my-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-[13px] leading-7 text-amber-900">
        <p className="mb-1 flex items-center gap-2 font-black"><UIIcon name="alert" className="h-5 w-5" /> هشدار ایمنی مهم</p>
        این مرجع صرفاً جهت <b>آموزش و یادآوری سریع</b> است و جایگزین راهنمای رسمی <b>ERG</b>، برگه‌های اطلاعات ایمنی (<b>SDS</b>) و دستورالعمل سازمان آتش‌نشانی شما نیست. در حادثه واقعی همواره منابع رسمی، نظر <b>فرمانده حادثه (IC)</b> و تیم متخصص مواد خطرناک ملاک قرار گیرد.
      </div>

      {/* فهرست */}
      <div className="no-print mb-2 rounded-xl bg-slate-50 p-4 text-[13px]">
        <p className="mb-2 font-black text-slate-900">فهرست بخش‌ها</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-600">
          <TocItem href="#s2" label="۲. داشبورد" />
          <TocItem href="#s3" label="۳. دستیار هوشمند" />
          <TocItem href="#s4" label="۴. واکنش سریع" />
          <TocItem href="#s5" label="۵. پایگاه مواد" />
          <TocItem href="#s6" label="۶. ابزار تاکتیکی" />
          <TocItem href="#s7" label="۷. نمادها" />
          <TocItem href="#s8" label="۸. رده‌های خطر" />
          <TocItem href="#s9" label="۹. راهنمای ERG" />
          <TocItem href="#s10" label="۱۰. رویه‌ها" />
          <TocItem href="#s11" label="۱۱. واژه‌نامه" />
          <TocItem href="#s12" label="۱۲. جستجوی یکپارچه" />
          <TocItem href="#s13" label="۱۳. نصب، آفلاین و حالت روز" />
        </div>
      </div>

      {/* آموزش بخش‌ها */}
      <Doc id="s2" n={2} icon="grid" title="داشبورد">
        <p>صفحه‌ای که با باز کردن اپ می‌بینید. از بالا به پایین شامل:</p>
        <ul className="space-y-1.5">
          <Bullet><b>۳ دکمه اصلی:</b> «واکنش سریع در صحنه» (بخش ۴)، «دستیار HAZMAT آفلاین» (بخش ۳) و «جستجوی مواد» (بخش ۵) — برای پرش مستقیم به هرکدام.</Bullet>
          <Bullet><b>۴ کارت آمار:</b> تعداد کل مواد ثبت‌شده، تعداد رده‌های خطر DOT، تعداد راهنماهای ERG موجود و تعداد گازهای سمی تنفسی (TIH) که فاصله تخلیه دقیق دارند.</Bullet>
          <Bullet><b>مواد موردعلاقه:</b> فقط وقتی نمایش داده می‌شود که حداقل یک ماده را با ستاره (★) نشان کرده باشید (بخش ۵).</Bullet>
          <Bullet><b>مواد پرخطر:</b> ۶ ماده با بالاترین امتیاز سلامت یا اشتعال‌پذیری NFPA، برای دسترسی سریع بدون جستجو.</Bullet>
          <Bullet><b>گازهای سمی تنفسی (TIH):</b> فهرست کامل موادی که فاصله تخلیه محاسبه‌شده (روز/شب) دارند — این‌ها پرخطرترین مواد از نظر ابر گاز سمی هستند.</Bullet>
        </ul>
      </Doc>

      <Doc id="s3" n={3} icon="ai" title="دستیار HAZMAT آفلاین">
        <p>یک جعبه گفتگوی محلی برای جست‌وجو در {materials.length} ماده، راهنماهای ERG و واژه‌نامه داخلی اپ — بدون اینترنت، کلید API یا ارسال داده به سرور خارجی.</p>
        <p><b>روش استفاده:</b></p>
        <ul className="space-y-1.5">
          <Bullet>نام فارسی یا انگلیسی ماده، شماره UN، شماره راهنمای ERG یا یک اصطلاح را بنویسید.</Bullet>
          <Bullet>برای پاسخ‌های دقیق‌تر پرسش را مشخص کنید؛ مانند «فاصله تخلیه کلر»، «نشتی آمونیاک» یا «PPE متانول».</Bullet>
          <Bullet>دکمه‌های نمونه ابتدای صفحه، جست‌وجوهای رایج را سریع اجرا می‌کنند.</Bullet>
        </ul>
        <p><b>نکته:</b> پاسخ‌ها از داده‌های بسته‌شده داخل برنامه بازیابی می‌شوند و مدل زبانی یا جست‌وجوی زنده وب نیستند.</p>
        <ul className="space-y-1.5">
          <Bullet>اگر پاسخ شماره UN یک ماده را داشته باشد، دکمه مشاهده همان ماده در پایگاه آفلاین زیر پیام ظاهر می‌شود.</Bullet>
          <Bullet>برای پاک‌کردن کامل گفتگو، آیکون سطل زباله کنار دکمه جست‌وجو را بزنید.</Bullet>
        </ul>
        <p className="rounded-lg bg-red-50 p-3 text-red-700">⚠ هرگز بر اساس پاسخ این بخش به‌تنهایی تصمیم عملیاتی (فاصله تخلیه، PPE، روش اطفا) نگیرید — همیشه با ERG رسمی، SDS و نظر فرمانده حادثه تطبیق دهید.</p>
      </Doc>

      <Doc id="s4" n={4} icon="bolt" title="واکنش سریع در صحنه">
        <p>یک صفحه ثابت و همیشه یک‌شکل برای دقایق اول حضور در صحنه — بدون نیاز به جستجو یا تایپ. دو بخش دارد:</p>
        <ul className="space-y-1.5">
          <Bullet><b>۵ قانون طلایی:</b> قواعدی که همیشه و برای هر حادثه صادق‌اند (جهت باد، ایزوله‌سازی قبل از شناسایی، SCBA برای ماده ناشناخته، پرهیز از نجات شتاب‌زده، اطلاع فوری ۱۲۵) — همیشه در بالای صفحه دیده می‌شوند.</Bullet>
          <Bullet><b>۷ مرحله واکنش:</b> از «شناسایی و ارزیابی صحنه» تا «کمک‌های اولیه و انتقال مجروحان»، هرکدام با چک‌لیست «انجام دهید» و در موارد لازم «انجام ندهید». برای ورود عملیاتی، مراحل را به‌ترتیب از بالا به پایین دنبال کنید.</Bullet>
        </ul>
        <p className="rounded-lg bg-slate-50 p-3 text-slate-600">این صفحه اطلاعات ماده خاصی نمی‌دهد — برای آن به بخش ۵ (پایگاه مواد) یا بخش ۳ (دستیار هوشمند) بروید.</p>
      </Doc>

      <Doc id="s5" n={5} icon="flask" title="پایگاه داده مواد خطرناک">
        <p>جستجوی <b>{materials.length} ماده</b> بر اساس نام فارسی، نام انگلیسی، شماره UN یا رده خطر؛ شامل مواد و جریان‌های فرایندی منتخب منطقه عسلویه و پارس جنوبی.</p>
        <p><b>روش استفاده:</b></p>
        <ul className="space-y-1.5">
          <Bullet>در کادر بالای صفحه («نام ماده، شماره UN، نام انگلیسی...») تایپ کنید — نتایج همزمان با تایپ فیلتر می‌شوند. با × کنار کادر جستجو را پاک کنید.</Bullet>
          <Bullet>زیر کادر جستجو، دکمه‌های رده (گازهای قابل اشتعال، گازهای سمی، مایعات قابل اشتعال، مواد خورنده، مواد سمی و ۱۱ رده دیگر) را می‌بینید — با کلیک روی هرکدام فقط مواد همان رده نمایش داده می‌شود.</Bullet>
          <Bullet>برای دیدن موارد منطقه‌ای، عبارت «عسلویه»، «پارس جنوبی» یا «South Pars» را جستجو کنید. برای مخلوط‌هایی مثل گاز ترش و برش‌های C3/C4/C5+، شماره UN نهایی به ترکیب واقعی و SDS محموله وابسته است.</Bullet>
          <Bullet>روی هر کارت ماده کلیک کنید تا برگه کامل آن باز شود؛ برگه شامل لوزی NFPA 704، نمادهای GHS، حالت فیزیکی، توصیف، بخش‌های خطر سلامتی/آتش/واکنش‌پذیری، تجهیزات حفاظتی پیشنهادی، ناسازگاری‌ها، کمک‌های اولیه، واکنش به نشتی و آتش، و لینک مستقیم به راهنمای ERG مربوطه است.</Bullet>
          <Bullet><b>گازهای سمی تنفسی (TIH):</b> برای موادی مثل کلر و آمونیاک، در برگه یک جدول «فاصله‌گذاری اضطراری» با اعداد نشتی کوچک/بزرگ و در صورت وجود، فاصله محافظتی روز/شب دیده می‌شود.</Bullet>
          <Bullet>روی آیکون ستاره (☆) بالای هر کارت کلیک کنید تا ماده به «موارد موردعلاقه» در داشبورد اضافه شود (ستاره پر می‌شود: ★). برای حذف، دوباره کلیک کنید.</Bullet>
          <Bullet>داخل برگه هر ماده، دکمه «چاپ برگه» یک نسخه تمیز و مناسب چاپ (بدون دکمه‌های رابط کاربری) برای تخته فرمانده حادثه یا آرشیو تولید می‌کند.</Bullet>
        </ul>
      </Doc>

      <Doc id="s6" n={6} icon="drop" title="ابزارهای تاکتیکی (پشتیبان فرماندهی حادثه)">
        <p>چهار ماشین‌حساب/ابزار میدانی، قابل انتخاب از ۴ دکمه بالای صفحه:</p>
        <ul className="space-y-1.5">
          <Bullet><b>محاسبه فوم (NFPA 11):</b> ابتدا نوع سوخت (هیدروکربن یا حلال قطبی مثل الکل/کتون) و سناریو (مخزن ذخیره یا پخش/دایک) را انتخاب کنید؛ برای مخزن، نوع سقف (ثابت یا شناور) هم مهم است — سقف شناور فقط حلقه درز (rim seal) را درگیر می‌کند، نه کل سطح. با وارد کردن ابعاد، اپ به‌طور خودکار نرخ پاشش و مدت پیشنهادی NFPA را پر می‌کند (قابل ویرایش دستی) و سطح، دبی محلول، کل محلول، مقدار کنسانتره و تعداد محفظه/لوله فوم لازم را محاسبه می‌کند. برای حلال قطبی حتماً فوم AR-AFFF لازم است.</Bullet>
          <Bullet><b>آب خنک‌کننده (NFPA 15):</b> با انتخاب هدف (مخزن برجی یا سطح/ساختمان) و وارد کردن ابعاد و نرخ آب، دبی لازم، کل آب مصرفی طول عملیات و تعداد تانکر آب مورد نیاز (بر اساس ظرفیت هر تانکر) را نشان می‌دهد.</Bullet>
          <Bullet><b>دبی نازل و فشار پمپ:</b> با انتخاب قطر سر لوله‌صاف (Smooth bore)، فشار سر نازل، قطر و طول شلنگ و اختلاف ارتفاع، دبی خروجی، افت فشار شلنگ، فشار ناشی از ارتفاع و در نهایت فشار خروجی پمپ لازم را محاسبه می‌کند.</Bullet>
          <Bullet><b>تعیین سطح PPE:</b> به ۴ سؤال ساده (شناسایی ماده، نیاز به فضای بسته/کمبود اکسیژن، شدت خطر تنفسی، شدت خطر تماس پوستی/چشمی) پاسخ دهید تا سطح پیشنهادی A تا D به‌همراه دلیل تصمیم نمایش داده شود. با دکمه «بازنشانی پرسش‌ها» می‌توانید دوباره شروع کنید.</Bullet>
        </ul>
        <p className="rounded-lg bg-slate-50 p-3 text-slate-600">در هر ۴ ابزار، مقادیر پیش‌فرض قابل تغییر دستی هستند؛ اگر روش کار سازمان شما متفاوت است، اعداد را مطابق دستورالعمل داخلی اصلاح کنید.</p>
      </Doc>

      <Doc id="s7" n={7} icon="diamond" title="نمادها (NFPA 704 و GHS)">
        <p>یک لوزی ایمنی NFPA 704 تعاملی: چهار خانه رنگی سلامت (آبی)، اشتعال‌پذیری (قرمز)، ناپایداری/واکنش‌پذیری (زرد) و خطر ویژه (سفید)، هرکدام با درجه ۰ تا ۴ — با تغییر اعداد، توضیح هر سطح را می‌بینید. پایین‌تر، مرجع کامل ۹ نماد خطر GHS (شعله، جمجمه، خورندگی، اکسیدکننده و…) با معنی و نمونه ماده برای هرکدام آمده است.</p>
      </Doc>

      <Doc id="s8" n={8} icon="alert" title="رده‌های خطر DOT">
        <p>۹ رده اصلی مواد خطرناک طبق دسته‌بندی وزارت حمل‌ونقل آمریکا (DOT)، هرکدام با شکل و رنگ پلاکارد لوزی واقعی، عنوان، زیرمجموعه‌ها و چند نمونه ماده — برای شناسایی سریع پلاکارد روی کامیون یا مخزن در صحنه حادثه.</p>
      </Doc>

      <Doc id="s9" n={9} icon="book" title="راهنمای ERG">
        <p>{Object.keys(ergGuides).length} راهنمای واکنش اضطراری کامل (بر پایه Emergency Response Guidebook). از فهرست کناری شماره راهنما را انتخاب کنید یا در برگه هر ماده روی برچسب شماره راهنما کلیک کنید تا مستقیم به همان راهنما بروید. هر راهنما شامل خطرات بالقوه، ایمنی عمومی، تجهیزات حفاظتی، فاصله تخلیه، واکنش به آتش/نشتی و کمک‌های اولیه است.</p>
      </Doc>

      <Doc id="s10" n={10} icon="shield" title="رویه‌های اضطراری">
        <p>چک‌لیست‌های تفصیلی‌تر از «واکنش سریع» برای شش موضوع کلیدی: ارزیابی صحنه، ایزوله‌سازی و تخلیه، انتخاب PPE، رفع آلودگی (Decontamination)، سیستم فرمان حادثه (ICS) و مدیریت گازهای سمی تنفسی (TIH). برای مرور کامل یک موضوع خاص (نه فقط خلاصه ۷ مرحله‌ای) از این بخش استفاده کنید.</p>
      </Doc>

      <Doc id="s11" n={11} icon="list" title="واژه‌نامه اصطلاحات">
        <p>{glossary.length} سرنام و اصطلاح رایج آتش‌نشانی/HAZMAT (ERG، SDS، SCBA، BLEVE، IDLH، TLV، LEL/UEL، TIH، AR-AFFF و…) به‌همراه تعریف کوتاه فارسی. در بالای صفحه می‌توانید نام یا سرنام را جستجو کنید.</p>
      </Doc>

      <Doc id="s12" n={12} icon="search" title="جستجوی یکپارچه">
        <p>سریع‌ترین راه رسیدن به هر اطلاعاتی در اپ، بدون نیاز به دانستن اینکه در کدام بخش قرار دارد.</p>
        <ul className="space-y-1.5">
          <Bullet>با کلید ترکیبی <b>Ctrl+K</b> (روی موبایل: دکمه ذره‌بین کنار لوگو) پنجره جستجو باز می‌شود.</Bullet>
          <Bullet>همزمان در مواد، راهنماهای ERG و واژه‌نامه جستجو می‌کند و نتایج را دسته‌بندی‌شده نمایش می‌دهد.</Bullet>
          <Bullet>اعداد فارسی (۱۲۳) و لاتین (123) هر دو پشتیبانی می‌شوند — نیازی به تعویض صفحه‌کلید نیست.</Bullet>
          <Bullet>با کلیدهای جهت‌نمای بالا/پایین بین نتایج حرکت کنید و با Enter نتیجه انتخاب‌شده را باز کنید؛ با Esc پنجره را ببندید.</Bullet>
        </ul>
      </Doc>

      <Doc id="s13" n={13} icon="bolt" title="نصب، استفاده آفلاین و حالت روز (PWA)">
        <ul className="space-y-1.5">
          <Bullet><b>نصب روی اندروید:</b> در مرورگر Chrome صفحه را باز کنید، از منوی سه‌نقطه بالا گزینه «افزودن به صفحه اصلی» را بزنید تا اپ با آیکون اختصاصی و حالت تمام‌صفحه (بدون نوار آدرس) روی گوشی نصب شود.</Bullet>
          <Bullet><b>آفلاین:</b> پس از اولین بازدید، تمام صفحات و پایگاه داده روی خود دستگاه ذخیره می‌شوند؛ از آن پس حتی بدون آنتن یا اینترنت، اپ کامل کار می‌کند — دقیقاً مناسب داخل واحدهای صنعتی یا مناطق بدون پوشش شبکه.</Bullet>
          <Bullet><b>حالت خوانایی زیر نور آفتاب:</b> دکمه خورشید/ماه در گوشه بالای صفحه (کنار لوگو) بین تم تیره (پیش‌فرض، مناسب شب و فضای داخلی) و تم روشن پرکنتراست (مناسب کار زیر نور مستقیم آفتاب) جابه‌جا می‌کند. انتخاب شما روی همان گوشی ذخیره می‌شود و در بازدید بعدی نیازی به تنظیم دوباره نیست.</Bullet>
          <Bullet><b>تماس اضطراری:</b> دکمه قرمز «۱۲۵» در سایدبار مستقیماً برنامه تماس گوشی را با شماره آتش‌نشانی باز می‌کند.</Bullet>
        </ul>
      </Doc>

      {/* میان‌برها */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-[13px]">
        <p className="mb-2 font-black text-slate-900">میان‌برهای صفحه‌کلید</p>
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          <p><kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 font-mono">Ctrl + K</kbd> — باز کردن جستجوی یکپارچه</p>
          <p><kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 font-mono">/</kbd> — باز کردن همان جستجوی یکپارچه (میان‌بر جایگزین)</p>
          <p><kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 font-mono">Esc</kbd> — بستن پنجره‌ها</p>
        </div>
      </div>

      {/* فوتر سند */}
      <footer className="mt-6 border-t border-slate-200 pt-4 text-center text-xs text-slate-500">
        <p>بر پایه استانداردهای NFPA 704، GHS و Emergency Response Guidebook</p>
        <p className="mt-1">مرجع متن‌باز واکنش اضطراری مواد خطرناک · طراحی و توسعه: یاسین گنجی</p>
      </footer>
    </div>
  );
}
