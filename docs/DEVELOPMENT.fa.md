# راهنمای محیط توسعه

[English](DEVELOPMENT.md) · **فارسی** · [فهرست مستندات](README.md)

این راهنما برای کسی است که اولین بار پروژه را دریافت می‌کند و می‌خواهد آن را اجرا، بررسی یا تغییر دهد. برای ارسال تغییرات، [راهنمای مشارکت](../CONTRIBUTING.fa.md) را هم بخوان.

## پیش‌نیازها

| ابزار | نسخه یا کاربرد |
|---|---|
| Git | دریافت مخزن، ساخت شاخه و مدیریت تغییرات |
| Node.js | حداقل 22.12؛ نسخهٔ 24 با محیط بررسی‌شده و workflow انتشار هماهنگ است |
| pnpm | دقیقاً **11.19.0**، مطابق `packageManager` در package.json اصلی |
| مرورگر | مرورگر جدید با WebGL؛ بررسی‌های ویندوز با Edge انجام شده‌اند |
| مرورگر Playwright | فقط برای تست مرورگر؛ برای اجرای عادی برنامه ضروری نیست |

در این نسخه به Python، Docker، دیتابیس، backend، حساب کاربری یا کلید API نیاز نداری. نصب بسته‌ها به شبکه نیاز دارد؛ فیلم YouTube، تشخیص کشور از IP و WebContainers اختیاری به سرویس بیرونی وابسته‌اند. داوری با React محلی پس از بارگذاری فایل‌های برنامه مستقل از این سرویس‌هاست.

اگر Corepack همراه Node نصب شده، نسخهٔ مشخص pnpm را با این دستورها آماده کن:

```sh
corepack enable pnpm
corepack install --global pnpm@11.19.0
node --version
pnpm --version
```

اگر Corepack در دسترس نیست، از [راهنمای رسمی pnpm](https://pnpm.io/installation) استفاده کن و نسخهٔ 11.19.0 را صریح انتخاب کن. نسخهٔ latest لزوماً با این مخزن یکسان نیست. راهنمای [Corepack](https://github.com/nodejs/corepack) تنظیم مسیر و نصب آن را توضیح می‌دهد.

## دریافت و اجرای برنامه

برای بررسی محلی:

```sh
git clone https://github.com/salehghotbani/Game-React-Tutorial.git
cd Game-React-Tutorial
pnpm install --frozen-lockfile
pnpm dev
```

برای مشارکت، ابتدا fork بگیر و نسخهٔ خودت را clone کن؛ روش آن در [راهنمای مشارکت](../CONTRIBUTING.fa.md) آمده است.

آدرس معمول [http://127.0.0.1:5173](http://127.0.0.1:5173) است. ترمینال را باز نگه دار. اگر پورت اشغال باشد، آدرس واقعی را از خروجی Vite بردار و برای تست مرورگر هم همان آدرس را تنظیم کن.

برای اولین بررسی: تم و زبان را انتخاب کن، به کامپیوتر برو، توضیح درس اول را کامل بخوان، یک نمونه اجرا کن و تمرین اول را با متن شخصی خودت جواب بده. پاسخ درست ۲۰۰ XP می‌دهد؛ با reload باقی ماندن پیشرفت را بررسی کن.

فایل `.env` ضروری نیست. دستورها را از ریشهٔ مخزن اجرا کن. بسته‌های داخلی سورس TypeScript را مستقیم در اختیار Vite می‌گذارند؛ برای تغییر آن‌ها لازم نیست هر بسته را جدا build یا publish کنی.

## دستورهای روزمره

| دستور | کاربرد |
|---|---|
| `pnpm dev` | سرور توسعه، معمولاً پورت 5173 |
| `pnpm typecheck` | بررسی TypeScript سخت‌گیرانه بدون تولید خروجی |
| `pnpm lint` | ESLint با الزام صفر warning |
| `pnpm test` | تست‌های Vitest، از جمله state، compiler و فیزیک واقعی |
| `pnpm build` | خروجی production در `apps/web/dist` |
| `pnpm preview` | نمایش production با Vite، معمولاً پورت 4173 |
| `pnpm preview:static /Game-React-Tutorial/` | نمایش فایل‌های build با Node، پورت 4180 و پیشوند مشخص |
| `pnpm check` | TypeScript، lint، تست واحد و build |
| `pnpm browsers:install` | نصب Chromium مورد نیاز Playwright |
| `pnpm test:e2e` | تست مرورگر؛ شامل بررسی‌های طولانی تمام تمرین‌ها |

`pnpm check` تست مرورگر را اجرا نمی‌کند. برای تست محدود با Edge نصب‌شده در ویندوز:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
pnpm test:e2e tests/e2e/beginner.spec.ts --trace off
```

راهنمای [تست‌ها](TESTING.md) دستورهای انتخاب سناریو، production و خروجی استاتیک را توضیح می‌دهد. پیش‌نمایش Vite middleware و هدر isolation دارد؛ `preview:static` فقط فایل‌های ساخته‌شده را ارائه می‌کند.

## نقشهٔ کد

| مسیر | مسئولیت |
|---|---|
| `apps/web/src/main.tsx` | ریشهٔ React، providerها و router |
| `apps/web/src/pages/GamePage.tsx` | اتصال دنیای بازی، فعالیت‌ها، آموزش و state |
| `apps/web/src/components/` | HUD، تنظیمات، آموزش، Monaco، splitter، کتاب و تلویزیون |
| `apps/web/src/store/` | `gameSlice.ts` برای حالت موقت؛ `progressSlice.ts`، `progression.ts` و `roomLife.ts` برای پیشرفت و ذخیره |
| `apps/web/src/hooks/` | فعالیت‌های اتاق، تم و ساعت سرور |
| `apps/web/src/i18n/` | تشخیص کشور، انتخاب زبان و جهت صفحه |
| `apps/web/*Plugin.ts` | bundle آزمایشگاه، ساعت و کشور در Vite |
| `packages/game/src/` | صحنه، هندسه، حرکت، دوربین، فیزیک و ماشین‌ها |
| `packages/challenges/src/` | فصل‌ها، مهارت‌ها، درس‌ها، تمرین‌ها و پروژه‌ها |
| `packages/learning-engine/src/` | compiler worker، runtime، bridge iframe و داوری |
| `packages/localization/src/` | کاتالوگ `en.json` و ترجمهٔ متن و نمونهٔ آموزشی |
| `packages/shared/src/index.ts` | قراردادهای مشترک TypeScript و DSL تست |
| `packages/arcade/src/` | منطق و رابط Bug Hunter |
| `apps/api/` | جای رزروشده برای backend آینده؛ فعلاً سرور اجرایی یا بستهٔ workspace ندارد |
| `tests/e2e/` | سناریوهای واقعی مرورگر |
| `.github/` | workflow انتشار و قالب‌های issue و PR |

نام بسته‌های داخلی با `@react-quest/` شروع می‌شود و وابستگی داخلی `workspace:*` است. جزئیات در [معماری](ARCHITECTURE.md) آمده است.

## جریان اجرا

ورودی صفحه به کنترلر بازیکن یا ماشین می‌رسد؛ Rapier در گام ثابت ۶۰ هرتز حرکت و برخورد را محاسبه می‌کند و دوربین وضعیت صحنه را دنبال می‌کند. فعالیت نزدیک می‌تواند آموزش را باز کند. آموزش قبل از تمرین کامل می‌شود؛ کد Monaco در worker کامپایل، در iframe اجرا و با تست‌های رفتار داوری می‌شود. reducer فقط پس از اعتبارسنجی نتیجه و همان نسخهٔ کد/پاسخ‌ها، پیشرفت و پاداش را ثبت می‌کند.

بستهٔ بازی Monaco یا runtime درس را import نمی‌کند. قوانین خالص را از رندر جدا نگه دار و در هر فریم فیزیک Redux dispatch نکن. قبل از تغییر داوری، [سیستم درس](LESSON_SYSTEM.md) و برای افزودن قابلیت، [دستورالعمل توسعه](EXTENDING.md) را بخوان.

## تنظیمات و endpointها

| تنظیم | مقدار معمول و کاربرد |
|---|---|
| `VITE_BASE_PATH` | `/`؛ برای build زیرمسیر مخزن آن را تغییر بده |
| `VITE_STATIC_HOST` | بدون مقدار؛ برای هاست فایل استاتیک دقیقاً `true` |
| `PLAYWRIGHT_CHANNEL` | Chromium پیش‌فرض؛ `msedge` برای Edge نصب‌شده |
| `PLAYWRIGHT_BASE_URL` | `http://127.0.0.1:5173`؛ آدرس سرور موجود تست |
| `PLAYWRIGHT_STATIC_HOST` | فقط برای تست Pages روی فایل‌سرور: `true` |
| `CURRICULUM_IDS` | فهرست IDها با کاما؛ فقط محدودکنندهٔ sweep فارسی در `education.spec.ts` |

تنظیمات Vite هنگام شروع یا build خوانده می‌شوند؛ پس از تغییر، سرور را دوباره اجرا کن. `VITE_*` در کد مرورگر قرار می‌گیرد و محل نگهداری secret نیست. تنظیم موقت ترمینال را پس از کار پاک کن. قواعد بارگذاری در [مستندات رسمی Vite](https://vite.dev/guide/env-and-mode) آمده است.

Vite در dev و preview دو endpoint دارد:

```powershell
Invoke-RestMethod http://127.0.0.1:5173/api/time
Invoke-RestMethod http://127.0.0.1:5173/api/locale -Headers @{ 'CF-IPCountry' = 'IR' }
```

اولی `timestamp` و `timeZone` می‌دهد؛ دومی `country` یا `null`. endpointهای تمرین weather، movies، users و fail داخل bridge شبیه‌سازی شده‌اند و endpoint سرور Vite نیستند. روی هاست استاتیک، ساعت از هدر HTTP و کشور از مرورگر خوانده می‌شود.

## داده و اشکال‌زدایی

در DevTools، Console، Network و Application/Storage را بررسی کن. Redux DevTools تغییر حالت و پیشرفت را نشان می‌دهد. نمایش برخوردها در تنظیمات برای هندسه مفید است؛ reset player موقعیت/حالت را عوض می‌کند و درس‌ها را پاک نمی‌کند.

| کلید localStorage | داده |
|---|---|
| `react-quest-progress-v1` | پروفایل نسخهٔ ۳، کدها، گواه‌ها، مراحل درس، راهنماها، مرور و پاداش اتاق؛ کلید ثابت نسخه‌های قبلی را migrate می‌کند |
| `react-quest-language-v1` | انتخاب دستی `en` یا `fa`؛ حالت خودکار این override را حذف می‌کند |
| `react-quest-theme-v1` | `light`، `dark` یا `auto` |
| `react-quest-camera-v1` | ترجیح دوربین |
| `react-quest-workspace-v1:*` | چیدمان جداگانهٔ درس و تمرین |

پروفایل هر origin جداست: localhost، پورت دیگر و سایت fork دادهٔ مشترک ندارند. قبل از پاک‌کردن، مقدار پیشرفت را اگر لازم داری از DevTools ذخیره کن. برای تست کاربر تازه از پروفایل جدید یا fixture خالی Playwright استفاده کن. تغییر یک عدد XP در storage راه پشتیبانی‌شدهٔ باز کردن امکانات نیست؛ مجموع از گواه‌ها محاسبه می‌شود. موقعیت ماشین فقط در همان جلسه می‌ماند.

## رفع مشکل

- pnpm پیدا نمی‌شود: ترمینال را دوباره باز کن و نسخه و PATH را بررسی کن؛ pin پروژه را صرفاً برای تطبیق با نصب سیستم تغییر نده.
- lockfile با manifest تطبیق ندارد: از ریشه نصب کن؛ اگر تغییر وابستگی عمدی است، `pnpm install` و lockfile جدید را همراه manifest ثبت کن. lockfile را حذف نکن.
- type یا بسته پیدا نمی‌شود: آن را در manifest بستهٔ مصرف‌کننده اعلام کن؛ باقی‌ماندهٔ npm ممکن است خطا را فقط روی سیستم محلی پنهان کند.
- خطای EPERM ویندوز: پردازش‌های dev/preview/test همین checkout را متوقف کن و با همان حساب معمولی نصب را دوباره انجام بده؛ مالکیت فایل و قفل فایل را بررسی کن.
- صحنه پس از rename خالی یا قدیمی است: اولین خطای Console/Network را بررسی کن و Vite را با `pnpm dev --force` دوباره اجرا کن. از نام‌هایی که فقط در حروف بزرگ/کوچک متفاوت‌اند پرهیز کن.
- کنترل کار نمی‌کند: از editor یا dialog خارج شو، صحنه را focus و بازی را resume کن؛ ورودی هنگام تایپ و توقف عمداً گرفته نمی‌شود.
- مشکل رندر یا تست: WebGL و کتابخانه‌های مرورگر را بررسی کن؛ تنظیم Playwright از software WebGL استفاده می‌کند.
- کشور/زبان اشتباه است: انتخاب دستی ذخیره‌شده، VPN، هدر کشور و fallback را بررسی کن؛ انتخاب دستی همیشه در دسترس است.
- ساعت همگام نیست: روی Vite `/api/time` و روی فایل‌سرور هدرهای `Date`/`Age` را بررسی کن؛ تم روشن/تاریک دستی در دسترس است.
- WebContainers یا YouTube در دسترس نیست: دلیل fallback را بخوان و از React محلی، کتاب و یادداشت استفاده کن؛ مشکل سرویس بیرونی را جدا از خطای برنامه گزارش بده.

برای انتشار fork، [راهنمای انتشار](DEPLOYMENT.md) را بخوان. نتیجه‌های قبلی و محدودیت‌های runner در [اعتبارسنجی](VALIDATION.md) ثبت شده‌اند. پوشه‌های cache/store، `dist`، `node_modules`، فایل‌های env و artifacts را وارد Git نکن.
