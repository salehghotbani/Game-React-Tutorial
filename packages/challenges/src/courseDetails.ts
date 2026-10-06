import type { KnowledgeQuestion, TeachingStep } from "@react-quest/shared";

export const chapterSupplements: Record<number, TeachingStep[]> = {
  "0": [
    {
      "id": "js-destructure",
      "title": "بازکردن ورودی و مقدار پیش‌فرض",
      "paragraphs": [
        "در destructuring نام ویژگی را از شیء بیرون می‌آوریم. مقدار پیش‌فرض فقط وقتی ورودی undefined است استفاده می‌شود؛ صفر، false و متن خالی خودشان مقدار معتبر هستند. optional chaining با ?. خواندن ویژگی از مقدار null یا undefined را امن می‌کند.",
        "در نمونه، هر کارت همان تابع را با ورودی متفاوت اجرا می‌کند. کارت دوم امتیاز صفر را حفظ می‌کند و کارت سوم مقدار پیش‌فرض می‌گیرد. ?? فقط برای null یا undefined جایگزین می‌گذارد؛ برخلاف || عدد صفر را حذف نمی‌کند."
      ],
      "code": "function Score({ name, points = 10 }) {\n  return <p>{name}: {points}</p>;\n}\nexport default function App() {\n  const user = { profile: null };\n  const city = user.profile?.city ?? \"شهر نامشخص\";\n  return <main><h1>{city}</h1><Score name=\"Sara\" points={5}/>\n    <Score name=\"Mina\" points={0}/><Score name=\"Reza\"/></main>;\n}",
      "preview": "function Score({ name, points = 10 }) {\n  return <p>{name}: {points}</p>;\n}\nexport default function App() {\n  const user = { profile: null };\n  const city = user.profile?.city ?? \"شهر نامشخص\";\n  return <main><h1>{city}</h1><Score name=\"Sara\" points={5}/>\n    <Score name=\"Mina\" points={0}/><Score name=\"Reza\"/></main>;\n}"
    },
    {
      "id": "js-async",
      "title": "Promise، async و await",
      "paragraphs": [
        "async یک تابع را به تابعی تبدیل می‌کند که Promise برمی‌گرداند. await داخل آن منتظر نتیجهٔ Promise می‌ماند؛ کل مرورگر را متوقف نمی‌کند. برای مدیریت شکست از try/catch استفاده می‌کنیم. نتیجهٔ response.json هم Promise است و به await نیاز دارد.",
        "دکمهٔ بارگذاری را بزن: ابتدا Loading و سپس نام کاربران دیده می‌شود. درخواست این نمونه از API آموزشی همین محیط پاسخ می‌گیرد. در فصل دریافت داده، لغو درخواست و جلوگیری از پاسخ قدیمی را اضافه می‌کنیم."
      ],
      "code": "import { useState } from \"react\";\nexport default function App() {\n  const [message, setMessage] = useState(\"آماده\");\n  async function load() {\n    setMessage(\"Loading\");\n    try {\n      const response = await fetch(\"/api/users\");\n      if (!response.ok) throw new Error(\"HTTP error\");\n      const users = await response.json();\n      setMessage(users.map(user => user.name).join(\", \"));\n    } catch { setMessage(\"درخواست ناموفق بود\"); }\n  }\n  return <main><button onClick={load}>بارگذاری</button><output>{message}</output></main>;\n}",
      "preview": "import { useState } from \"react\";\nexport default function App() {\n  const [message, setMessage] = useState(\"آماده\");\n  async function load() {\n    setMessage(\"Loading\");\n    try {\n      const response = await fetch(\"/api/users\");\n      if (!response.ok) throw new Error(\"HTTP error\");\n      const users = await response.json();\n      setMessage(users.map(user => user.name).join(\", \"));\n    } catch { setMessage(\"درخواست ناموفق بود\"); }\n  }\n  return <main><button onClick={load}>بارگذاری</button><output>{message}</output></main>;\n}"
    }
  ],
  "1": [
    {
      "id": "jsx-style",
      "title": "ظاهر، ویژگی‌ها و دسترس‌پذیری",
      "paragraphs": [
        "className نام کلاس CSS است و style یک شیء JavaScript می‌گیرد. نام ویژگی‌های style به شکل backgroundColor نوشته می‌شود. مقدارهایی مثل aria-label و data-testid با خط تیره باقی می‌مانند. label با htmlFor به id ورودی وصل می‌شود.",
        "در نمونه روی برچسب نام کلیک کن تا ورودی فوکوس بگیرد. عنوان، label و دکمهٔ واقعی هم برای صفحه‌کلید و هم برای ابزارهای کمکی معنی دارند. برای ظاهر ثابت از CSS استفاده کن و style را برای مقدارهایی که از داده می‌آیند نگه دار."
      ],
      "code": "export default function App() {\n  const color = \"#e7f0df\";\n  return <main style={{ backgroundColor: color, padding: 16 }}>\n    <h1>پروفایل من</h1><label htmlFor=\"name\">نام</label>\n    <input id=\"name\" defaultValue=\"Sara\"/><button>ذخیره</button>\n  </main>;\n}",
      "preview": "export default function App() {\n  const color = \"#e7f0df\";\n  return <main style={{ backgroundColor: color, padding: 16 }}>\n    <h1>پروفایل من</h1><label htmlFor=\"name\">نام</label>\n    <input id=\"name\" defaultValue=\"Sara\"/><button>ذخیره</button>\n  </main>;\n}"
    }
  ],
  "2": [
    {
      "id": "props-callback",
      "title": "بالابردن State و callback",
      "paragraphs": [
        "اگر دو فرزند یک داده را می‌خوانند، آن را در نزدیک‌ترین والد مشترک نگه دار. والد مقدار را با prop و امکان تغییر را با callback می‌فرستد. فرزند رویداد را اعلام می‌کند و مالک داده تصمیم می‌گیرد چگونه آن را تغییر دهد.",
        "هر دو دکمه را امتحان کن: یک امتیاز مشترک تغییر می‌کند. اگر هر دکمه useState جدا داشت، دو شمارندهٔ مستقل می‌ساختیم. مقدار پیش‌فرض prop و children برای ساخت رابط‌های قابل استفادهٔ دوباره مفیدند؛ خود props را تغییر نده."
      ],
      "code": "import { useState } from \"react\";\nfunction ScoreButton({ points = 1, onAdd, children }) {\n  return <button onClick={() => onAdd(points)}>{children}</button>;\n}\nexport default function App() {\n  const [score, setScore] = useState(0);\n  const add = points => setScore(previous => previous + points);\n  return <main><output>{score}</output>\n    <ScoreButton onAdd={add}>Add 1</ScoreButton>\n    <ScoreButton points={5} onAdd={add}>Add 5</ScoreButton></main>;\n}",
      "preview": "import { useState } from \"react\";\nfunction ScoreButton({ points = 1, onAdd, children }) {\n  return <button onClick={() => onAdd(points)}>{children}</button>;\n}\nexport default function App() {\n  const [score, setScore] = useState(0);\n  const add = points => setScore(previous => previous + points);\n  return <main><output>{score}</output>\n    <ScoreButton onAdd={add}>Add 1</ScoreButton>\n    <ScoreButton points={5} onAdd={add}>Add 5</ScoreButton></main>;\n}"
    }
  ],
  "3": [
    {
      "id": "state-queue-demo",
      "title": "دو تغییر در یک رویداد را مقایسه کن",
      "paragraphs": [
        "State تصویر همان render است. دو بار setCount(count + 1) در یک کلیک، دو مقدار یکسان را درخواست می‌کند؛ اما دو updater تابعی، نتیجهٔ همدیگر را دریافت می‌کنند. setter مقدار متغیر اجرای فعلی را عوض نمی‌کند.",
        "از صفر، دکمهٔ Snapshot را بزن و نتیجهٔ ۱ را ببین. Reset را بزن؛ حالا Updater نتیجهٔ ۲ می‌دهد. برای تغییر وابسته به دادهٔ قبلی، updater انتخاب روشنی است. محاسبهٔ state نباید خودش اثر جانبی داشته باشد."
      ],
      "code": "import { useState } from \"react\";\nexport default function App() {\n  const [count, setCount] = useState(0);\n  function snapshot() { setCount(count + 1); setCount(count + 1); }\n  function updater() { setCount(n => n + 1); setCount(n => n + 1); }\n  return <main><output>{count}</output><button onClick={snapshot}>Snapshot</button>\n    <button onClick={updater}>Updater</button><button onClick={() => setCount(0)}>Reset</button></main>;\n}",
      "preview": "import { useState } from \"react\";\nexport default function App() {\n  const [count, setCount] = useState(0);\n  function snapshot() { setCount(count + 1); setCount(count + 1); }\n  function updater() { setCount(n => n + 1); setCount(n => n + 1); }\n  return <main><output>{count}</output><button onClick={snapshot}>Snapshot</button>\n    <button onClick={updater}>Updater</button><button onClick={() => setCount(0)}>Reset</button></main>;\n}"
    }
  ],
  "4": [
    {
      "id": "list-identity",
      "title": "هویت پایدار و لیست قابل تغییر",
      "paragraphs": [
        "وقتی عضو اول را حذف می‌کنی، index اعضای بعدی تغییر می‌کند. اگر key همان index باشد، React ممکن است state یا ورودی یک عضو را برای عضو دیگری نگه دارد. شناسه را هنگام ساخت داده تولید کن و در render شناسهٔ تصادفی تازه نساز.",
        "در نمونه، نام کتاب دوم را داخل ورودی تغییر بده و سپس کتاب اول را حذف کن؛ ویرایش باید کنار همان کتاب بماند. پیام لیست خالی را نیز پس از حذف همهٔ کتاب‌ها بررسی کن. حذف با filter آرایهٔ تازه می‌سازد."
      ],
      "code": "import { useState } from \"react\";\nexport default function App() {\n  const [books, setBooks] = useState([{ id: \"react\", title: \"React\" }, { id: \"hooks\", title: \"Hooks\" }]);\n  return <main>{books.length === 0 && <p>No books</p>}\n    <ul>{books.map(book => <li key={book.id}>\n      <input aria-label={book.title} defaultValue={book.title}/>\n      <button onClick={() => setBooks(items => items.filter(item => item.id !== book.id))}>Remove {book.title}</button>\n    </li>)}</ul></main>;\n}",
      "preview": "import { useState } from \"react\";\nexport default function App() {\n  const [books, setBooks] = useState([{ id: \"react\", title: \"React\" }, { id: \"hooks\", title: \"Hooks\" }]);\n  return <main>{books.length === 0 && <p>No books</p>}\n    <ul>{books.map(book => <li key={book.id}>\n      <input aria-label={book.title} defaultValue={book.title}/>\n      <button onClick={() => setBooks(items => items.filter(item => item.id !== book.id))}>Remove {book.title}</button>\n    </li>)}</ul></main>;\n}"
    }
  ],
  "5": [
    {
      "id": "form-validation",
      "title": "ثبت معتبر و بازخورد خطا",
      "paragraphs": [
        "اعتبارسنجی را در submit انجام بده تا Enter و کلیک رفتار یکسان داشته باشند. عدد ورودی همچنان متن است؛ با Number تبدیل و با Number.isFinite بررسی کن. NaN، مقدار غیرمثبت و عنوان فقط شامل فاصله نباید ثبت شوند.",
        "ابتدا فرم خالی را ارسال کن تا پیام خطا را ببینی. سپس یک عنوان و مبلغ مثبت بنویس و با Enter ثبت کن. output جمع عددی را نشان می‌دهد؛ مقدارهای ۲ و ۳ باید ۵ شوند، نه متن ۲۳. بعد از ثبت موفق، ورودی‌ها خالی می‌شوند."
      ],
      "code": "import { useState } from \"react\";\nexport default function App() {\n  const [title, setTitle] = useState(\"\");\n  const [amount, setAmount] = useState(\"\");\n  const [total, setTotal] = useState(0);\n  const [error, setError] = useState(\"\");\n  function submit(event) {\n    event.preventDefault();\n    const number = Number(amount);\n    if (!title.trim() || !Number.isFinite(number) || number <= 0) {\n      setError(\"عنوان و مبلغ مثبت وارد کن\"); return;\n    }\n    setTotal(previous => previous + number);\n    setTitle(\"\"); setAmount(\"\"); setError(\"\");\n  }\n  return <form onSubmit={submit}>\n    <label>Title<input value={title} onChange={e => setTitle(e.target.value)}/></label>\n    <label>Amount<input type=\"number\" value={amount} onChange={e => setAmount(e.target.value)}/></label>\n    <button>Add</button>{error && <p role=\"alert\">{error}</p>}<output>{total}</output>\n  </form>;\n}",
      "preview": "import { useState } from \"react\";\nexport default function App() {\n  const [title, setTitle] = useState(\"\");\n  const [amount, setAmount] = useState(\"\");\n  const [total, setTotal] = useState(0);\n  const [error, setError] = useState(\"\");\n  function submit(event) {\n    event.preventDefault();\n    const number = Number(amount);\n    if (!title.trim() || !Number.isFinite(number) || number <= 0) {\n      setError(\"عنوان و مبلغ مثبت وارد کن\"); return;\n    }\n    setTotal(previous => previous + number);\n    setTitle(\"\"); setAmount(\"\"); setError(\"\");\n  }\n  return <form onSubmit={submit}>\n    <label>Title<input value={title} onChange={e => setTitle(e.target.value)}/></label>\n    <label>Amount<input type=\"number\" value={amount} onChange={e => setAmount(e.target.value)}/></label>\n    <button>Add</button>{error && <p role=\"alert\">{error}</p>}<output>{total}</output>\n  </form>;\n}"
    },
    {
      "id": "form-controls",
      "title": "checkbox، select و نوع دکمه",
      "paragraphs": [
        "checkbox مقدار boolean را با checked و event.target.checked کنترل می‌کند. select مقدار انتخاب‌شده را با value و onChange می‌خواند. input را از ابتدا با متن خالی مقداردهی کن تا ناگهان از uncontrolled به controlled تغییر نکند.",
        "دکمهٔ حذف یا نمایش رمز داخل form باید type=\"button\" داشته باشد تا ناخواسته submit نکند. در نمونه، دسته را تغییر بده و checkbox را روشن کن؛ نتیجه از همین دو state محاسبه می‌شود و state سوم لازم نیست."
      ],
      "code": "import { useState } from \"react\";\nexport default function App() {\n  const [category, setCategory] = useState(\"React\");\n  const [done, setDone] = useState(false);\n  return <main><label>Topic<select value={category} onChange={e => setCategory(e.target.value)}>\n    <option>React</option><option>JavaScript</option></select></label>\n    <label><input type=\"checkbox\" checked={done} onChange={e => setDone(e.target.checked)}/>Completed</label>\n    <output>{category}: {done ? \"Done\" : \"Pending\"}</output></main>;\n}",
      "preview": "import { useState } from \"react\";\nexport default function App() {\n  const [category, setCategory] = useState(\"React\");\n  const [done, setDone] = useState(false);\n  return <main><label>Topic<select value={category} onChange={e => setCategory(e.target.value)}>\n    <option>React</option><option>JavaScript</option></select></label>\n    <label><input type=\"checkbox\" checked={done} onChange={e => setDone(e.target.checked)}/>Completed</label>\n    <output>{category}: {done ? \"Done\" : \"Pending\"}</output></main>;\n}"
    }
  ],
  "6": [
    {
      "id": "hook-rules",
      "title": "قانون Hookها و وابستگی درست",
      "paragraphs": [
        "React Hookها را از روی ترتیب فراخوانی دنبال می‌کند؛ آن‌ها را در شرط، حلقه یا handler صدا نزن. در صورت نیاز شرط را داخل Effect قرار بده. تمام مقدارهای واکنشی استفاده‌شده در Effect باید در dependency باشند؛ حذف وابستگی برای خاموش‌کردن هشدار، مسئله را حل نمی‌کند.",
        "Strict Mode در محیط توسعه می‌تواند چرخهٔ setup و cleanup را دوباره اجرا کند تا مشکل آشکار شود؛ این به معنی دو بار اجراشدن همیشگی در تولید نیست. Effect باید بتواند اتصال را بسازد و با cleanup دقیق همان اتصال را حذف کند."
      ],
      "code": "useEffect(() => {\n  if (!enabled) return;\n  const id = setInterval(() => setCount(n => n + 1), 1000);\n  return () => clearInterval(id);\n}, [enabled]);"
    },
    {
      "id": "hook-reuse-demo",
      "title": "منطق مشترک، حافظهٔ مستقل",
      "paragraphs": [
        "Custom Hook منطق را به اشتراک می‌گذارد، نه خود state را. در این مثال useToggle در دو کامپوننت جدا استفاده می‌شود. تغییر یکی نباید مقدار دیگری را تغییر دهد. اگر حافظهٔ مشترک می‌خواهی، آن را در والد یا store نگه دار.",
        "هر کلید را جدا روشن و خاموش کن. سپس دکمهٔ Focus را بزن؛ useRef ورودی را فوکوس می‌کند، ولی تغییر current به‌تنهایی render نمی‌سازد. مقدار نمایشیِ روشن یا خاموش بودن همچنان در useState نگه داشته می‌شود."
      ],
      "code": "import { useState, useRef } from \"react\";\nfunction useToggle() {\n  const [enabled, setEnabled] = useState(false);\n  return [enabled, () => setEnabled(value => !value)];\n}\nfunction Switch({ name }) {\n  const [enabled, toggle] = useToggle();\n  return <button aria-pressed={enabled} onClick={toggle}>{name}: {enabled ? \"On\" : \"Off\"}</button>;\n}\nexport default function App() {\n  const field = useRef(null);\n  return <main><Switch name=\"A\"/><Switch name=\"B\"/>\n    <input aria-label=\"Note\" ref={field}/><button onClick={() => field.current?.focus()}>Focus</button></main>;\n}",
      "preview": "import { useState, useRef } from \"react\";\nfunction useToggle() {\n  const [enabled, setEnabled] = useState(false);\n  return [enabled, () => setEnabled(value => !value)];\n}\nfunction Switch({ name }) {\n  const [enabled, toggle] = useToggle();\n  return <button aria-pressed={enabled} onClick={toggle}>{name}: {enabled ? \"On\" : \"Off\"}</button>;\n}\nexport default function App() {\n  const field = useRef(null);\n  return <main><Switch name=\"A\"/><Switch name=\"B\"/>\n    <input aria-label=\"Note\" ref={field}/><button onClick={() => field.current?.focus()}>Focus</button></main>;\n}"
    }
  ],
  "7": [
    {
      "id": "api-retry",
      "title": "لغو درخواست، خطا و تلاش دوباره",
      "paragraphs": [
        "هنگام عوض‌شدن ورودی درخواست، وضعیت انتظار را از نو شروع و دادهٔ قدیمی را پاک کن. AbortController درخواست قبلی را لغو می‌کند. محافظ active هم جلوی تغییر state از ادامهٔ یک پاسخ قدیمی را می‌گیرد. خطای لغو را مثل خطای سرویس به کاربر نشان نده.",
        "شهر را سریع بین Tehran و Shiraz تغییر بده؛ نتیجه باید شهر انتخاب‌شده باشد. گزینهٔ Error شکست HTTP را نشان می‌دهد و Retry همان درخواست را دوباره اجرا می‌کند. با برگشت به شهر معتبر، صفحه باید بازیابی شود. لیست خالی نیز نتیجهٔ موفقِ بدون عضو است، نه خطای شبکه."
      ],
      "code": "import { useState, useEffect } from \"react\";\nexport default function App() {\n  const [city, setCity] = useState(\"Tehran\");\n  const [attempt, setAttempt] = useState(0);\n  const [result, setResult] = useState({ status: \"loading\" });\n  useEffect(() => {\n    const controller = new AbortController();\n    let active = true;\n    setResult({ status: \"loading\" });\n    async function load() {\n      try {\n        const response = await fetch(\"/api/weather?city=\" + city, { signal: controller.signal });\n        if (!response.ok) throw new Error(\"HTTP error\");\n        const data = await response.json();\n        if (active) setResult({ status: \"success\", data });\n      } catch (error) {\n        if (active && error.name !== \"AbortError\") setResult({ status: \"error\" });\n      }\n    }\n    load();\n    return () => { active = false; controller.abort(); };\n  }, [city, attempt]);\n  return <main><label>City<select value={city} onChange={e => setCity(e.target.value)}>\n    <option>Tehran</option><option>Shiraz</option><option>Error</option></select></label>\n    <output>{result.status === \"success\" ? result.data.city + \" \" + result.data.temperature + \"°C\" : result.status}</output>\n    {result.status === \"error\" && <button onClick={() => setAttempt(n => n + 1)}>Retry</button>}</main>;\n}",
      "preview": "import { useState, useEffect } from \"react\";\nexport default function App() {\n  const [city, setCity] = useState(\"Tehran\");\n  const [attempt, setAttempt] = useState(0);\n  const [result, setResult] = useState({ status: \"loading\" });\n  useEffect(() => {\n    const controller = new AbortController();\n    let active = true;\n    setResult({ status: \"loading\" });\n    async function load() {\n      try {\n        const response = await fetch(\"/api/weather?city=\" + city, { signal: controller.signal });\n        if (!response.ok) throw new Error(\"HTTP error\");\n        const data = await response.json();\n        if (active) setResult({ status: \"success\", data });\n      } catch (error) {\n        if (active && error.name !== \"AbortError\") setResult({ status: \"error\" });\n      }\n    }\n    load();\n    return () => { active = false; controller.abort(); };\n  }, [city, attempt]);\n  return <main><label>City<select value={city} onChange={e => setCity(e.target.value)}>\n    <option>Tehran</option><option>Shiraz</option><option>Error</option></select></label>\n    <output>{result.status === \"success\" ? result.data.city + \" \" + result.data.temperature + \"°C\" : result.status}</output>\n    {result.status === \"error\" && <button onClick={() => setAttempt(n => n + 1)}>Retry</button>}</main>;\n}"
    },
    {
      "id": "api-contract",
      "title": "قرارداد داده و حالت لیست خالی",
      "paragraphs": [
        "قبل از map روی پاسخ، مطمئن شو واقعاً آرایه دریافت کرده‌ای. پاسخ شبکه ورودی بیرونی است و ممکن است شکل مورد انتظار را نداشته باشد. خطای قالب پاسخ را از نبود نتیجه جدا کن و برای حالت خالی پیام مشخص داشته باش.",
        "قواعد قالب داده را نزدیک تابع دریافت نگه دار تا بقیهٔ رابط با دادهٔ معتبر کار کند. در تمرین‌های این سایت API ثابت آموزشی استفاده می‌شود؛ برای برنامهٔ واقعی آدرس سرویس، اعتبارسنجی سرور و کنترل دسترسی جداگانه لازم است."
      ],
      "code": "const response = await fetch(\"/api/users\");\nif (!response.ok) throw new Error(\"HTTP error\");\nconst users = await response.json();\nif (!Array.isArray(users)) throw new Error(\"Invalid data\");\n// users.length === 0: show an empty-state message."
    }
  ],
  "8": [
    {
      "id": "router-params-demo",
      "title": "صفحهٔ جزئیات و مسیر ناموجود",
      "paragraphs": [
        "پارامتر مسیر مانند :id از URL خوانده می‌شود و متن است. قبل از نمایش دادهٔ آن شناسه، وجودش را بررسی کن. مسیر * آدرس تعریف‌نشده را پوشش می‌دهد؛ محصول ناموجود هم باید بازخورد خودش را داشته باشد.",
        "در نمونه سه لینک را امتحان کن. Layout و منو ثابت می‌مانند و Outlet محتوای صفحه را عوض می‌کند. برای نسخهٔ وب از BrowserRouter یا روش پیشنهادی ابزار پروژه استفاده می‌شود؛ MemoryRouter این نمونه فقط آدرس داخلی درس را نگه می‌دارد."
      ],
      "code": "import { MemoryRouter, Routes, Route, Link, Outlet, useParams } from \"react-router-dom\";\nfunction Layout() {\n  return <main><nav><Link to=\"/\">Home</Link> | <Link to=\"/books/react\">React book</Link> | <Link to=\"/missing\">Unknown page</Link></nav><Outlet/></main>;\n}\nfunction Book() {\n  const { id } = useParams();\n  return <h2>{id === \"react\" ? \"Learning React\" : \"Book not found\"}</h2>;\n}\nexport default function App() {\n  return <MemoryRouter><Routes><Route path=\"/\" element={<Layout/>}>\n    <Route index element={<h2>Home</h2>}/><Route path=\"books/:id\" element={<Book/>}/>\n    <Route path=\"*\" element={<h2>Page not found</h2>}/>\n  </Route></Routes></MemoryRouter>;\n}",
      "preview": "import { MemoryRouter, Routes, Route, Link, Outlet, useParams } from \"react-router-dom\";\nfunction Layout() {\n  return <main><nav><Link to=\"/\">Home</Link> | <Link to=\"/books/react\">React book</Link> | <Link to=\"/missing\">Unknown page</Link></nav><Outlet/></main>;\n}\nfunction Book() {\n  const { id } = useParams();\n  return <h2>{id === \"react\" ? \"Learning React\" : \"Book not found\"}</h2>;\n}\nexport default function App() {\n  return <MemoryRouter><Routes><Route path=\"/\" element={<Layout/>}>\n    <Route index element={<h2>Home</h2>}/><Route path=\"books/:id\" element={<Book/>}/>\n    <Route path=\"*\" element={<h2>Page not found</h2>}/>\n  </Route></Routes></MemoryRouter>;\n}"
    },
    {
      "id": "router-state",
      "title": "کدام وضعیت در URL باشد؟",
      "paragraphs": [
        "شناسهٔ صفحه و جست‌وجویی که باید قابل اشتراک باشد معمولاً به URL تعلق دارند. بازبودن موقت یک پنجره می‌تواند state محلی باشد. نگه‌داشتن یک شناسه هم در URL و هم در useState احتمال ناهماهنگی ایجاد می‌کند.",
        "Link برای ناوبری و button برای عمل روی همان صفحه است. آدرس ورودی کاربر است؛ برای شناسهٔ نامعتبر و مسیر ناموجود حالت مشخص بساز. در استقرار یک SPA، سرور باید مسیرهای مستقیم را هم به فایل اصلی برنامه برگرداند."
      ]
    }
  ],
  "9": [
    {
      "id": "redux-demo",
      "title": "دو بخش رابط، یک Store",
      "paragraphs": [
        "Store را بیرون کامپوننت می‌سازیم تا با هر render از نو ایجاد نشود. Provider باید بالای تمام مصرف‌کننده‌ها باشد. یکی از فرزندان با useSelector مقدار را می‌خواند و دیگری با useDispatch action می‌فرستد.",
        "دکمهٔ افزودن را چند بار بزن و تغییر امتیاز در بخش دیگر را ببین. مقدار جمع‌شده از store می‌آید. استفاده از Redux جای تقسیم مسئولیت‌ها را نمی‌گیرد؛ متن یک input که فقط همان فرم مصرف می‌کند معمولاً محلی می‌ماند."
      ],
      "code": "import { configureStore, createSlice } from \"@reduxjs/toolkit\";\nimport { Provider, useSelector, useDispatch } from \"react-redux\";\nconst score = createSlice({ name: \"score\", initialState: { value: 0 },\n  reducers: { add(state) { state.value += 5; }, reset(state) { state.value = 0; } }\n});\nconst store = configureStore({ reducer: { score: score.reducer } });\nfunction Score() { const value = useSelector(state => state.score.value); return <output>{value}</output>; }\nfunction Controls() {\n  const dispatch = useDispatch();\n  return <section><button onClick={() => dispatch(score.actions.add())}>Add 5</button>\n    <button onClick={() => dispatch(score.actions.reset())}>Reset</button></section>;\n}\nexport default function App() { return <Provider store={store}><main><Score/><Controls/></main></Provider>; }",
      "preview": "import { configureStore, createSlice } from \"@reduxjs/toolkit\";\nimport { Provider, useSelector, useDispatch } from \"react-redux\";\nconst score = createSlice({ name: \"score\", initialState: { value: 0 },\n  reducers: { add(state) { state.value += 5; }, reset(state) { state.value = 0; } }\n});\nconst store = configureStore({ reducer: { score: score.reducer } });\nfunction Score() { const value = useSelector(state => state.score.value); return <output>{value}</output>; }\nfunction Controls() {\n  const dispatch = useDispatch();\n  return <section><button onClick={() => dispatch(score.actions.add())}>Add 5</button>\n    <button onClick={() => dispatch(score.actions.reset())}>Reset</button></section>;\n}\nexport default function App() { return <Provider store={store}><main><Score/><Controls/></main></Provider>; }"
    },
    {
      "id": "state-owner",
      "title": "انتخاب مالک State و selector",
      "paragraphs": [
        "useState برای تغییر سادهٔ محلی، useReducer برای چند تغییر مرتبط در یک بخش و Redux برای دادهٔ مشترک بین بخش‌های دور مناسب‌اند. صرف بزرگ‌شدن فایل دلیل انتقال همهٔ داده‌ها به store نیست.",
        "selector باید همان بخش مورد نیاز را بخواند. مجموع سبد یا تعداد انجام‌شده را از دادهٔ اصلی حساب کن تا نسخهٔ دومِ ناهماهنگ نداشته باشی. عملیات شبکه در reducer انجام نمی‌شود؛ reducer فقط state بعدی را از state قبلی و action می‌سازد."
      ],
      "code": "const total = useSelector(state =>\n  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)\n);"
    }
  ],
  "10": [
    {
      "id": "query-weather-demo",
      "title": "Query واقعی، key و دریافت دوباره",
      "paragraphs": [
        "queryKey این نمونه شهر را دارد؛ بنابراین تهران و شیراز دو نتیجهٔ جدا در cache دارند. QueryClient فقط یک بار در سطح این ماژول ساخته می‌شود. signal که queryFn می‌گیرد به fetch می‌رسد تا لغو درخواست قابل استفاده باشد.",
        "شهر را عوض کن، سپس به شهر قبلی برگرد؛ دادهٔ تازهٔ cache بدون شروع خالی نمایش داده می‌شود. Refetch دریافت دوباره را درخواست می‌کند. isFetching دریافت در پس‌زمینه را نشان می‌دهد و لزوماً به معنی نبود داده نیست. Error یک شکست واقعی HTTP آموزشی است."
      ],
      "code": "import { useState } from \"react\";\nimport { QueryClient, QueryClientProvider, useQuery } from \"@tanstack/react-query\";\nconst client = new QueryClient({ defaultOptions: { queries: { retry: false } } });\nfunction Weather() {\n  const [city, setCity] = useState(\"Tehran\");\n  const weather = useQuery({ queryKey: [\"weather\", city], staleTime: 60000,\n    queryFn: async ({ signal }) => {\n      const response = await fetch(\"/api/weather?city=\" + city, { signal });\n      if (!response.ok) throw new Error(\"HTTP error\");\n      return response.json();\n    }\n  });\n  return <main><label>City<select value={city} onChange={e => setCity(e.target.value)}>\n    <option>Tehran</option><option>Shiraz</option><option>Error</option></select></label>\n    <output>{weather.isPending ? \"Loading\" : weather.isError ? \"Request failed\" : weather.data.city + \" \" + weather.data.temperature + \"°C\"}</output>\n    <button onClick={() => weather.refetch()} disabled={weather.isFetching}>Refetch</button>\n    {weather.isFetching && <p>Fetching</p>}</main>;\n}\nexport default function App() { return <QueryClientProvider client={client}><Weather/></QueryClientProvider>; }",
      "preview": "import { useState } from \"react\";\nimport { QueryClient, QueryClientProvider, useQuery } from \"@tanstack/react-query\";\nconst client = new QueryClient({ defaultOptions: { queries: { retry: false } } });\nfunction Weather() {\n  const [city, setCity] = useState(\"Tehran\");\n  const weather = useQuery({ queryKey: [\"weather\", city], staleTime: 60000,\n    queryFn: async ({ signal }) => {\n      const response = await fetch(\"/api/weather?city=\" + city, { signal });\n      if (!response.ok) throw new Error(\"HTTP error\");\n      return response.json();\n    }\n  });\n  return <main><label>City<select value={city} onChange={e => setCity(e.target.value)}>\n    <option>Tehran</option><option>Shiraz</option><option>Error</option></select></label>\n    <output>{weather.isPending ? \"Loading\" : weather.isError ? \"Request failed\" : weather.data.city + \" \" + weather.data.temperature + \"°C\"}</output>\n    <button onClick={() => weather.refetch()} disabled={weather.isFetching}>Refetch</button>\n    {weather.isFetching && <p>Fetching</p>}</main>;\n}\nexport default function App() { return <QueryClientProvider client={client}><Weather/></QueryClientProvider>; }"
    },
    {
      "id": "query-mutation-demo",
      "title": "Mutation و به‌روزرسانی بعد از موفقیت",
      "paragraphs": [
        "در useMutation عملیات تغییر با mutate آغاز می‌شود؛ خودش هنگام نمایش صفحه اجرا نمی‌شود. دکمه را در حالت pending غیرفعال کن و پس از موفقیت دادهٔ مرتبط را به‌روز کن. اگر سرور دادهٔ نهایی را برگرداند، setQueryData می‌تواند همان پاسخ را وارد cache کند.",
        "این مثال عملیات ذخیره را با یک Promise محلی شبیه‌سازی می‌کند و سرور بیرونی ندارد. دکمه را بزن و تغییر امتیاز cache را ببین. در برنامهٔ واقعی mutationFn درخواست تغییر سرور است؛ invalidateQueries دریافت دوباره را درخواست می‌کند، اما setQueryData فقط cache را تغییر می‌دهد."
      ],
      "code": "import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from \"@tanstack/react-query\";\nconst client = new QueryClient();\nclient.setQueryData([\"score\"], 0);\nfunction Score() {\n  const cache = useQueryClient();\n  const { data } = useQuery({ queryKey: [\"score\"], queryFn: () => Promise.resolve(0), staleTime: Infinity });\n  const save = useMutation({ mutationFn: next => Promise.resolve(next),\n    onSuccess: saved => cache.setQueryData([\"score\"], saved)\n  });\n  return <main><output>{data}</output><button disabled={save.isPending} onClick={() => save.mutate(data + 5)}>Save +5</button>\n    {save.isSuccess && <p>Saved to cache</p>}</main>;\n}\nexport default function App() { return <QueryClientProvider client={client}><Score/></QueryClientProvider>; }",
      "preview": "import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from \"@tanstack/react-query\";\nconst client = new QueryClient();\nclient.setQueryData([\"score\"], 0);\nfunction Score() {\n  const cache = useQueryClient();\n  const { data } = useQuery({ queryKey: [\"score\"], queryFn: () => Promise.resolve(0), staleTime: Infinity });\n  const save = useMutation({ mutationFn: next => Promise.resolve(next),\n    onSuccess: saved => cache.setQueryData([\"score\"], saved)\n  });\n  return <main><output>{data}</output><button disabled={save.isPending} onClick={() => save.mutate(data + 5)}>Save +5</button>\n    {save.isSuccess && <p>Saved to cache</p>}</main>;\n}\nexport default function App() { return <QueryClientProvider client={client}><Score/></QueryClientProvider>; }"
    }
  ],
  "11": [
    {
      "id": "derived-demo",
      "title": "جست‌وجو بدون State تکراری",
      "paragraphs": [
        "دادهٔ اصلی و عبارت جست‌وجو برای محاسبهٔ نتیجه کافی‌اند. نتیجه را در render حساب کن تا نیازی به Effect دوم و هماهنگ‌کردن دو نسخهٔ داده نباشد. اول این نسخهٔ ساده را درست و قابل تست بساز.",
        "React را جست‌وجو کن و سپس متنی بی‌نتیجه بنویس تا پیام خالی را ببینی. شمارندهٔ جداگانه را تغییر بده؛ جست‌وجو نباید پاک شود. اگر بعداً محاسبهٔ سنگین اندازه‌گیری شد، می‌توان همین محاسبهٔ خالص را با useMemo و وابستگی‌های کامل نگه داشت."
      ],
      "code": "import { useState } from \"react\";\nconst topics = [\"React basics\", \"JavaScript\", \"React Query\", \"Testing\"];\nexport default function App() {\n  const [search, setSearch] = useState(\"\");\n  const [count, setCount] = useState(0);\n  const visible = topics.filter(topic => topic.toLowerCase().includes(search.toLowerCase()));\n  return <main><label>Search<input value={search} onChange={e => setSearch(e.target.value)}/></label>\n    {visible.length ? <ul>{visible.map(topic => <li key={topic}>{topic}</li>)}</ul> : <p>No results</p>}\n    <button onClick={() => setCount(n => n + 1)}>Count {count}</button></main>;\n}",
      "preview": "import { useState } from \"react\";\nconst topics = [\"React basics\", \"JavaScript\", \"React Query\", \"Testing\"];\nexport default function App() {\n  const [search, setSearch] = useState(\"\");\n  const [count, setCount] = useState(0);\n  const visible = topics.filter(topic => topic.toLowerCase().includes(search.toLowerCase()));\n  return <main><label>Search<input value={search} onChange={e => setSearch(e.target.value)}/></label>\n    {visible.length ? <ul>{visible.map(topic => <li key={topic}>{topic}</li>)}</ul> : <p>No results</p>}\n    <button onClick={() => setCount(n => n + 1)}>Count {count}</button></main>;\n}"
    },
    {
      "id": "measure-performance",
      "title": "چطور دربارهٔ بهینه‌سازی تصمیم بگیری؟",
      "paragraphs": [
        "با Profiler در React DevTools ببین کدام تعامل باعث render و کدام بخش باعث هزینه می‌شود. یک سناریوی مشخص مثل تایپ در جست‌وجو را قبل و بعد مقایسه کن. تعداد render به‌تنهایی سرعت واقعی را ثابت نمی‌کند.",
        "memo با props تازهٔ شیء یا تابع ممکن است سودی نداشته باشد. useCallback فقط هویت تابع را نگه می‌دارد و اجرای آن را سریع‌تر نمی‌کند. برنامه باید بدون memoization هم درست کار کند؛ بعد از هر تغییر، رفتار و وابستگی‌ها را دوباره بررسی کن."
      ]
    }
  ],
  "12": [
    {
      "id": "testing-demo",
      "title": "تست سالم و نسخهٔ خراب را اجرا کن",
      "paragraphs": [
        "این نمونه از Testing Library واقعی استفاده می‌کند: رابط را در ظرف جدا render می‌کند، دکمه را با role و نام پیدا می‌کند، کلیک می‌کند و متن خروجی را بررسی می‌کند. ابزار تست از داخل مرورگر همین محیط اجرا می‌شود و نتیجه در صفحهٔ نمونه دیده می‌شود.",
        "ابتدا Run test را بزن؛ مقدار صفر و سپس یک باید قبول شوند. گزینهٔ Broken را روشن کن و دوباره اجرا کن؛ تست باید خطای رفتار پس از کلیک را پیدا کند. فقط بررسی وجود دکمه هر دو نسخه را قبول می‌کرد. finally ظرف تست را بعد از هر بار اجرا پاک می‌کند."
      ],
      "code": "import { useState } from \"react\";\nimport { render, fireEvent, within } from \"@testing-library/react\";\nfunction Counter({ broken }) {\n  const [count, setCount] = useState(0);\n  return <main><output role=\"status\">{count}</output>\n    <button onClick={() => { if (!broken) setCount(n => n + 1); }}>+1</button></main>;\n}\nexport default function App() {\n  const [broken, setBroken] = useState(false);\n  const [result, setResult] = useState(\"Not run\");\n  async function runTest() {\n    const container = document.createElement(\"div\");\n    document.body.append(container);\n    let view;\n    try {\n      view = render(<Counter broken={broken}/>, { container });\n      const screen = within(container);\n      if (screen.getByRole(\"status\").textContent !== \"0\") throw new Error(\"Expected initial 0\");\n      fireEvent.click(screen.getByRole(\"button\", { name: \"+1\" }));\n      if (screen.getByRole(\"status\").textContent !== \"1\") throw new Error(\"Expected 1 after click\");\n      setResult(\"Passed: initial value and click\");\n    } catch (error) { setResult(\"Failed: \" + error.message); }\n    finally { view?.unmount(); container.remove(); }\n  }\n  return <main><label><input type=\"checkbox\" checked={broken} onChange={e => setBroken(e.target.checked)}/>Broken</label>\n    <button onClick={runTest}>Run test</button><p role=\"status\">{result}</p></main>;\n}",
      "preview": "import { useState } from \"react\";\nimport { render, fireEvent, within } from \"@testing-library/react\";\nfunction Counter({ broken }) {\n  const [count, setCount] = useState(0);\n  return <main><output role=\"status\">{count}</output>\n    <button onClick={() => { if (!broken) setCount(n => n + 1); }}>+1</button></main>;\n}\nexport default function App() {\n  const [broken, setBroken] = useState(false);\n  const [result, setResult] = useState(\"Not run\");\n  async function runTest() {\n    const container = document.createElement(\"div\");\n    document.body.append(container);\n    let view;\n    try {\n      view = render(<Counter broken={broken}/>, { container });\n      const screen = within(container);\n      if (screen.getByRole(\"status\").textContent !== \"0\") throw new Error(\"Expected initial 0\");\n      fireEvent.click(screen.getByRole(\"button\", { name: \"+1\" }));\n      if (screen.getByRole(\"status\").textContent !== \"1\") throw new Error(\"Expected 1 after click\");\n      setResult(\"Passed: initial value and click\");\n    } catch (error) { setResult(\"Failed: \" + error.message); }\n    finally { view?.unmount(); container.remove(); }\n  }\n  return <main><label><input type=\"checkbox\" checked={broken} onChange={e => setBroken(e.target.checked)}/>Broken</label>\n    <button onClick={runTest}>Run test</button><p role=\"status\">{result}</p></main>;\n}"
    },
    {
      "id": "testing-async",
      "title": "تست رفتار زمان‌دار و مستقل",
      "paragraphs": [
        "getByRole برای عنصری است که همین حالا وجود دارد. findByRole منتظر ظاهرشدن عنصر می‌ماند و waitFor یک assertion را تا موفقیت تکرار می‌کند. به‌جای خواب ثابت، منتظر نتیجهٔ قابل مشاهده شو؛ برای تایمرها می‌توان از ساعت کنترل‌شدهٔ ابزار تست استفاده کرد.",
        "هر تست باید داده و ظرف مستقل داشته باشد و بتواند تنها اجرا شود. حالت موفق، خطا، ورودی نامعتبر و بازگشت دادهٔ ذخیره‌شده را پوشش بده. در تمرین testCounter ابزار assertion را محیط به تابع تو می‌دهد؛ در پروژهٔ جدا، Vitest یا ابزار مشابه آن را فراهم می‌کند."
      ],
      "code": "render(<Users />);\nconst user = await screen.findByText(\"Ada\");\nexpect(user).toBeInTheDocument();"
    }
  ],
  "13": [
    {
      "id": "architecture-demo",
      "title": "بازآرایی یک فهرست با حفظ رفتار",
      "paragraphs": [
        "در این نمونه useReadingList فقط تغییر داده را انجام می‌دهد، BookRow فقط یک عضو را نشان می‌دهد و App فرم و ترکیب رابط را می‌سازد. callbackهای remove و add مسیر تغییر داده را روشن می‌کنند. این مرزها را بر اساس مسئولیت انتخاب کن، نه فقط تعداد خط.",
        "یک کتاب اضافه و سپس حذف کن. قبل از هر بازآرایی همین دو رفتار و ورودی خالی را آزمایش کن و بعد همان تست‌ها را اجرا کن. Hook داده‌ای که لازم است را برمی‌گرداند؛ نیازی نیست تمام جزئیات داخلی یا setter خام را به همهٔ کامپوننت‌ها بدهد."
      ],
      "code": "import { useState } from \"react\";\nfunction useReadingList() {\n  const [books, setBooks] = useState([]);\n  const add = title => {\n    if (title.trim()) setBooks(items => [...items, { id: crypto.randomUUID(), title: title.trim() }]);\n  };\n  const remove = id => setBooks(items => items.filter(book => book.id !== id));\n  return { books, add, remove };\n}\nfunction BookRow({ book, onRemove }) {\n  return <li>{book.title}<button onClick={() => onRemove(book.id)}>Remove</button></li>;\n}\nexport default function App() {\n  const { books, add, remove } = useReadingList();\n  const [title, setTitle] = useState(\"\");\n  return <main><form onSubmit={e => { e.preventDefault(); add(title); setTitle(\"\"); }}>\n    <label>Book title<input value={title} onChange={e => setTitle(e.target.value)}/></label><button>Add</button></form>\n    <ul>{books.map(book => <BookRow key={book.id} book={book} onRemove={remove}/>)}</ul></main>;\n}",
      "preview": "import { useState } from \"react\";\nfunction useReadingList() {\n  const [books, setBooks] = useState([]);\n  const add = title => {\n    if (title.trim()) setBooks(items => [...items, { id: crypto.randomUUID(), title: title.trim() }]);\n  };\n  const remove = id => setBooks(items => items.filter(book => book.id !== id));\n  return { books, add, remove };\n}\nfunction BookRow({ book, onRemove }) {\n  return <li>{book.title}<button onClick={() => onRemove(book.id)}>Remove</button></li>;\n}\nexport default function App() {\n  const { books, add, remove } = useReadingList();\n  const [title, setTitle] = useState(\"\");\n  return <main><form onSubmit={e => { e.preventDefault(); add(title); setTitle(\"\"); }}>\n    <label>Book title<input value={title} onChange={e => setTitle(e.target.value)}/></label><button>Add</button></form>\n    <ul>{books.map(book => <BookRow key={book.id} book={book} onRemove={remove}/>)}</ul></main>;\n}"
    },
    {
      "id": "safe-storage",
      "title": "خواندن امن دادهٔ ذخیره‌شده",
      "paragraphs": [
        "JSON.parse ممکن است برای متن خراب خطا بدهد؛ حتی JSON معتبر هم ممکن است شکل دادهٔ اشتباه داشته باشد. try/catch و اعتبارسنجی نوع را با هم استفاده کن و در نبود داده، آرایهٔ خالی معتبر برگردان. محدودیت فضای ذخیره هم می‌تواند نوشتن را شکست دهد.",
        "نسخهٔ قالب داده را در کلید یا محتوا مشخص کن تا بعداً بتوانی آن را مهاجرت بدهی. در پیش‌نمایش این سایت، localStorage پروژه از اطلاعات حساب و پیشرفت سایت جداست. ذخیره در مرورگر برای همان دستگاه است و همگام‌سازی بین دستگاه‌ها ایجاد نمی‌کند."
      ],
      "code": "function loadBooks() {\n  try {\n    const value = JSON.parse(localStorage.getItem(\"books-v1\") || \"[]\");\n    if (!Array.isArray(value)) return [];\n    return value.filter(book => book && typeof book.id === \"string\" && typeof book.title === \"string\");\n  } catch { return []; }\n}\nconst [books, setBooks] = useState(loadBooks);"
    }
  ],
  "14": [
    {
      "id": "final-contracts",
      "title": "آماده‌سازی آزمون‌های ساخت",
      "paragraphs": [
        "در تابلوی My Project Board کارت‌ها شناسه، عنوان و وضعیت todo/doing/done دارند. تعداد کارت‌های done از داده حساب می‌شود. در My Budget مبلغ را به عدد تبدیل کن؛ جمع همهٔ هزینه‌ها باید مستقل از فیلترِ نمای لیست بماند.",
        "نیازمندی‌های دقیقِ نام کامپوننت، label، data-add و کلید ذخیره در صفحهٔ هر آزمون نوشته شده‌اند. ابتدا ورودی نامعتبر، سپس افزودن، تغییر وضعیت یا دسته، فیلتر، حذف و بازگشت بعد از بستن را بررسی کن. نمونهٔ این فصل پروژهٔ جداگانه است؛ پیاده‌سازی آزمون را خودت می‌سازی."
      ]
    },
    {
      "id": "final-mini-project",
      "title": "نمونهٔ ترکیبی: هدف روزانهٔ من",
      "paragraphs": [
        "این برنامهٔ کوچک عنوان یک هدف و تعداد گام‌های انجام‌شده را ذخیره می‌کند. state اولیه از ذخیرهٔ معتبر خوانده می‌شود، نام هدف با فرم کنترل می‌شود و Effect فقط برای همگام‌کردن ذخیره است. مقدارهایی که از state حساب می‌شوند جدا ذخیره نشده‌اند.",
        "عنوان را تغییر بده و چند گام اضافه کن. «اجرای نمونه» را دوباره بزن؛ مقدار همین نشست نمونه باید باقی بماند. این ذخیرهٔ نمونه برای آزمایش است؛ ساختهٔ آزمون خودت از صفحهٔ پروژه‌ها با کد و ذخیرهٔ مستقل داخل همین سایت نمایش داده می‌شود."
      ],
      "code": "import { useState, useEffect } from \"react\";\nfunction loadGoal() {\n  try {\n    const value = JSON.parse(localStorage.getItem(\"daily-goal-v1\") || \"null\");\n    if (value && typeof value.title === \"string\" && Number.isInteger(value.steps) && value.steps >= 0) return value;\n  } catch { /* Use a valid initial goal. */ }\n  return { title: \"Learn React\", steps: 0 };\n}\nfunction useGoal() {\n  const [goal, setGoal] = useState(loadGoal);\n  const [error, setError] = useState(false);\n  useEffect(() => {\n    try { localStorage.setItem(\"daily-goal-v1\", JSON.stringify(goal)); setError(false); }\n    catch { setError(true); }\n  }, [goal]);\n  return { goal, error, rename: title => setGoal(g => ({ ...g, title })),\n    advance: () => setGoal(g => ({ ...g, steps: g.steps + 1 })) };\n}\nexport default function App() {\n  const { goal, error, rename, advance } = useGoal();\n  return <main><h1>My daily goal</h1><label>Goal<input value={goal.title} onChange={e => rename(e.target.value)}/></label>\n    <p>{goal.title}</p><output>{goal.steps}</output><button onClick={advance}>Complete a step</button>\n    {error && <p role=\"alert\">Could not save</p>}</main>;\n}",
      "preview": "import { useState, useEffect } from \"react\";\nfunction loadGoal() {\n  try {\n    const value = JSON.parse(localStorage.getItem(\"daily-goal-v1\") || \"null\");\n    if (value && typeof value.title === \"string\" && Number.isInteger(value.steps) && value.steps >= 0) return value;\n  } catch { /* Use a valid initial goal. */ }\n  return { title: \"Learn React\", steps: 0 };\n}\nfunction useGoal() {\n  const [goal, setGoal] = useState(loadGoal);\n  const [error, setError] = useState(false);\n  useEffect(() => {\n    try { localStorage.setItem(\"daily-goal-v1\", JSON.stringify(goal)); setError(false); }\n    catch { setError(true); }\n  }, [goal]);\n  return { goal, error, rename: title => setGoal(g => ({ ...g, title })),\n    advance: () => setGoal(g => ({ ...g, steps: g.steps + 1 })) };\n}\nexport default function App() {\n  const { goal, error, rename, advance } = useGoal();\n  return <main><h1>My daily goal</h1><label>Goal<input value={goal.title} onChange={e => rename(e.target.value)}/></label>\n    <p>{goal.title}</p><output>{goal.steps}</output><button onClick={advance}>Complete a step</button>\n    {error && <p role=\"alert\">Could not save</p>}</main>;\n}"
    },
    {
      "id": "project-review",
      "title": "اجرای پروژه و مرور نهایی",
      "paragraphs": [
        "در سایت، کد را اجرا کن، آزمون‌ها را ارسال کن و ساختهٔ خودت را از «نمایش ساختهٔ من در سایت» باز کن. برای پروژهٔ جدا، Vite می‌تواند قالب React بسازد؛ main.jsx کامپوننت App را با createRoot به عنصر ریشه متصل می‌کند و فایل CSS ظاهر را تعیین می‌کند.",
        "مرور نهایی شامل ورودی نامعتبر، حالت خالی، خطای درخواست یا ذخیره، کار با صفحه‌کلید، نمایش موبایل و حفظ داده پس از بازگشت است. در هر تصمیم بگو داده کجا نگه‌داری می‌شود و چرا. قبولی تست‌های این دوره رفتارهای تعیین‌شده را می‌سنجد؛ جای مرور همهٔ نیازهای محصول واقعی را نمی‌گیرد."
      ],
      "code": "pnpm create vite my-react-app --template react\ncd my-react-app\npnpm install\npnpm dev\n# Before sharing the app:\npnpm build"
    }
  ]
};

export const chapterDetails: Record<number, { outcomes: string[]; checkpoint: KnowledgeQuestion }> = {
  "0": {
    "outcomes": [
      "داده را با map، filter و کپی تغییر بده.",
      "ورودی تابع و نتیجهٔ درخواست async را بخوان."
    ],
    "checkpoint": {
      "id": "course-check-0",
      "prompt": "خروجی این عبارت چیست؟",
      "options": [
        "۱۰",
        "۰",
        "undefined"
      ],
      "answer": 1,
      "explanation": "عملگر ?? فقط null و undefined را جایگزین می‌کند؛ صفر یک مقدار معتبر است و باقی می‌ماند.",
      "code": "const points = 0;\npoints ?? 10;"
    }
  },
  "1": {
    "outcomes": [
      "تگ، تابع کامپوننت و JSX را از هم تشخیص بده.",
      "داده و ویژگی قابل دسترس را وارد JSX کن."
    ],
    "checkpoint": {
      "id": "course-check-1",
      "prompt": "برای نمایش مقدار name کدام JSX درست است؟",
      "options": [
        "<h2>name</h2>",
        "<h2>{name}</h2>",
        "<h2>\"name\"</h2>"
      ],
      "answer": 1,
      "explanation": "آکولاد مقدار عبارت JavaScript را وارد JSX می‌کند؛ بدون آن کلمهٔ name متن ثابت است."
    }
  },
  "2": {
    "outcomes": [
      "کامپوننت را با Props و children قابل استفادهٔ دوباره کن.",
      "دادهٔ مشترک را در والد و تغییر را در callback نگه دار."
    ],
    "checkpoint": {
      "id": "course-check-2",
      "prompt": "دو فرزند باید یک امتیاز یکسان را تغییر دهند؛ مالک State کجا باشد؟",
      "options": [
        "در هر فرزند یک State جدا",
        "در متغیر معمولی داخل هر render",
        "در نزدیک‌ترین والد مشترک"
      ],
      "answer": 2,
      "explanation": "یک منبع مشترک در والد از ناهماهنگی جلوگیری می‌کند؛ مقدار و callback به فرزندان می‌رسند."
    }
  },
  "3": {
    "outcomes": [
      "رویداد را به تغییر State وصل کن.",
      "Snapshot و updater تابعی را با مثال مقایسه کن."
    ],
    "checkpoint": {
      "id": "course-check-3",
      "prompt": "با مقدار اولیهٔ صفر، بعد از این کلیک count چند می‌شود؟",
      "options": [
        "۱",
        "۲",
        "۰"
      ],
      "answer": 1,
      "explanation": "هر updater نتیجهٔ قبلی را می‌گیرد: ابتدا ۰ به ۱ و سپس ۱ به ۲ می‌رسد.",
      "code": "setCount(n => n + 1);\nsetCount(n => n + 1);"
    }
  },
  "4": {
    "outcomes": [
      "لیست و حالت خالی را از آرایه نمایش بده.",
      "با شناسهٔ پایدار و نسخهٔ تازه، عضو را تغییر بده."
    ],
    "checkpoint": {
      "id": "course-check-4",
      "prompt": "برای لیستی که حذف و جابه‌جایی دارد، کدام key مناسب است؟",
      "options": [
        "item.id که هنگام ساخت داده تولید شده",
        "index فعلی لیست",
        "Math.random() در هر render"
      ],
      "answer": 0,
      "explanation": "شناسهٔ پایدار هویت همان داده را در تغییر ترتیب حفظ می‌کند؛ index و شناسهٔ تصادفی این قرارداد را ندارند."
    }
  },
  "5": {
    "outcomes": [
      "input، checkbox و select را کنترل کن.",
      "ورودی نامعتبر را قبل از ثبت رد کن و بازخورد بده."
    ],
    "checkpoint": {
      "id": "course-check-5",
      "prompt": "برای جمع عددی دو مقدار input، چه کاری لازم است؟",
      "options": [
        "جمع مستقیم event.target.valueها",
        "تبدیل با Number و بررسی معتبر بودن",
        "ذخیرهٔ جمع در یک رشته"
      ],
      "answer": 1,
      "explanation": "value ورودی متن است. برای جلوگیری از چسبیدن رشته‌ها باید تبدیل عددی و اعتبارسنجی انجام شود."
    }
  },
  "6": {
    "outcomes": [
      "Effect را با dependency و cleanup درست بساز.",
      "useRef و حافظهٔ مستقل Custom Hook را به کار ببر."
    ],
    "checkpoint": {
      "id": "course-check-6",
      "prompt": "دو بار استفاده از useToggle چه چیزی را مشترک می‌کند؟",
      "options": [
        "همیشه یک state مشترک",
        "عنصر DOM مشترک",
        "منطق مشترک و state مستقل"
      ],
      "answer": 2,
      "explanation": "هر فراخوانی Hook state خودش را دارد؛ برای دادهٔ مشترک باید مالک مشترک بسازی."
    }
  },
  "7": {
    "outcomes": [
      "انتظار، خطا، نتیجه و حالت خالی را نمایش بده.",
      "درخواست قبلی را لغو کن و امکان تلاش دوباره بده."
    ],
    "checkpoint": {
      "id": "course-check-7",
      "prompt": "اگر fetch پاسخ HTTP 500 بدهد، کدام بررسی لازم است؟",
      "options": [
        "فقط catch؛ fetch همیشه reject می‌شود",
        "بررسی response.ok قبل از استفاده از داده",
        "نمایش پاسخ به عنوان موفقیت"
      ],
      "answer": 1,
      "explanation": "fetch برای وضعیت HTTP ناموفق الزاماً reject نمی‌شود؛ response.ok را بررسی و خطای برنامه را ایجاد کن."
    }
  },
  "8": {
    "outcomes": [
      "مسیر، Layout، Outlet و پارامتر را ترکیب کن.",
      "برای آدرس یا شناسهٔ ناموجود بازخورد بده."
    ],
    "checkpoint": {
      "id": "course-check-8",
      "prompt": "در Layout مسیر تودرتو، محتوای فرزند کجا نمایش داده می‌شود؟",
      "options": [
        "<Outlet />",
        "داخل useParams()",
        "در queryKey"
      ],
      "answer": 0,
      "explanation": "Outlet محل نمایش route فرزند است؛ useParams فقط پارامترهای URL را می‌خواند."
    }
  },
  "9": {
    "outcomes": [
      "تغییر State را با Action و reducer خالص بنویس.",
      "Store مشترک را با Provider و selector به رابط وصل کن."
    ],
    "checkpoint": {
      "id": "course-check-9",
      "prompt": "کدام کار در reducer جای دارد؟",
      "options": [
        "ارسال درخواست شبکه",
        "تغییر مستقیم DOM",
        "محاسبهٔ State بعدی از State و Action"
      ],
      "answer": 2,
      "explanation": "reducer باید خالص و قابل پیش‌بینی باشد؛ درخواست و کار با DOM خارج از آن انجام می‌شوند."
    }
  },
  "10": {
    "outcomes": [
      "Query key، تازگی و دریافت پس‌زمینه را تشخیص بده.",
      "بعد از Mutation، cache مرتبط را به‌روز کن."
    ],
    "checkpoint": {
      "id": "course-check-10",
      "prompt": "درخواست آب‌وهوا به city وابسته است؛ key مناسب کدام است؟",
      "options": [
        "[\"weather\"]",
        "[\"weather\", city]",
        "[Math.random()]"
      ],
      "answer": 1,
      "explanation": "ورودی مؤثر در queryFn باید در queryKey باشد تا نتیجهٔ شهرهای مختلف با هم مخلوط نشود."
    }
  },
  "11": {
    "outcomes": [
      "دادهٔ مشتق‌شده را بدون State اضافی محاسبه کن.",
      "قبل از memoization یک هزینهٔ مشخص را اندازه بگیر."
    ],
    "checkpoint": {
      "id": "course-check-11",
      "prompt": "آرایهٔ فیلترشده از items و search به دست می‌آید؛ شروع مناسب چیست؟",
      "options": [
        "محاسبهٔ مستقیم هنگام render",
        "State دوم و Effect برای همگام‌سازی",
        "حذف search از dependencyها"
      ],
      "answer": 0,
      "explanation": "محاسبهٔ خالص در render نسخهٔ تکراریِ ناهماهنگ نمی‌سازد. فقط پس از اندازه‌گیری هزینه دربارهٔ useMemo تصمیم بگیر."
    }
  },
  "12": {
    "outcomes": [
      "عنصر را با role و نام قابل دسترس پیدا کن.",
      "با assertion پس از تعامل، نسخهٔ خراب را رد کن."
    ],
    "checkpoint": {
      "id": "course-check-12",
      "prompt": "کدام تست شمارندهٔ بدون handler را تشخیص می‌دهد؟",
      "options": [
        "فقط وجود button",
        "فقط مقدار اولیهٔ صفر",
        "کلیک و بررسی افزایش مقدار خروجی"
      ],
      "answer": 2,
      "explanation": "نسخهٔ خراب می‌تواند دکمه و صفر اولیه داشته باشد. بررسی نتیجهٔ بعد از کلیک تفاوت رفتار را ثابت می‌کند."
    }
  },
  "13": {
    "outcomes": [
      "مسئولیت نمایش و منطق داده را جدا کن.",
      "ذخیرهٔ خراب را به حالت اولیهٔ معتبر برگردان."
    ],
    "checkpoint": {
      "id": "course-check-13",
      "prompt": "JSON ذخیره‌شده معتبر است؛ آیا به‌تنهایی کافی است؟",
      "options": [
        "بله، هر JSON آرایهٔ درست است",
        "خیر، شکل و نوع داده هم باید بررسی شود",
        "بله، نیازی به حالت اولیه نیست"
      ],
      "answer": 1,
      "explanation": "عدد یا شیء اشتباه هم JSON معتبر است؛ علاوه بر try/catch باید قرارداد داده را بررسی کنی."
    }
  },
  "14": {
    "outcomes": [
      "نیازمندی را به رفتار قابل تست و مراحل کوچک تبدیل کن.",
      "پروژهٔ خودت را بساز، ذخیره کن و داخل سایت نمایش بده."
    ],
    "checkpoint": {
      "id": "course-check-14",
      "prompt": "در My Budget با فیلتر food، جمع کل باید چه چیزی را نشان دهد؟",
      "options": [
        "جمع تمام هزینه‌ها، مستقل از فیلتر",
        "فقط هزینه‌های دیده‌شده",
        "مقدار قبلی بدون محاسبهٔ دوباره"
      ],
      "answer": 0,
      "explanation": "فیلتر فقط نمای لیست را تغییر می‌دهد؛ جمع کل از آرایهٔ اصلی محاسبه می‌شود. این قرارداد در نیازمندی آزمون آمده است."
    }
  }
};
