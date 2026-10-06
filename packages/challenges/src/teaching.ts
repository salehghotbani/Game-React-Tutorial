import type { Challenge, TeachingLesson, TeachingStep } from '@react-quest/shared';
import { chapters } from './curriculum';
import { chapterDetails, chapterSupplements } from './courseDetails';

const step = (id: string, title: string, paragraphs: string[], code?: string, notes?: TeachingStep['notes'], preview?: string): TeachingStep => ({ id, title, paragraphs, code, notes, preview });
const app = (jsx: string, before = '') => `${before}\nexport default function App() {\n  return (${jsx});\n}`.trim();

const react: TeachingStep[] = [
  step('what-react', 'React چیست و چه کاری انجام می‌دهد؟', [
    'چیزی که در یک سایت می‌بینی و با آن کار می‌کنی، رابط کاربری نام دارد: عنوان، تصویر، ورودی و دکمه. React یک کتابخانهٔ JavaScript برای ساختن این رابط است. کتابخانه یعنی کدهای آماده‌ای که کمک می‌کنند برنامهٔ خودمان را بنویسیم.',
    'مثلاً در یک فروشگاه، چند کارت محصول داریم. با React شکل یک کارت را یک بار تعریف می‌کنیم و برای محصولات مختلف استفاده می‌کنیم. بعداً یاد می‌گیریم با کلیک روی «افزودن»، تعداد سبد هم تغییر کند.',
    'در این درس از صفر شروع می‌کنیم. ابتدا معنی کد را می‌خوانی، سپس نمونهٔ آماده را اجرا می‌کنی. تمرین خودت در مرحلهٔ بعد باز می‌شود. خواندن درس و اجرای مثال هیچ امتیازی کم نمی‌کند.'
  ]),
  step('html', 'تگ چیست؟ عنوان و متن روی صفحه', [
    'HTML زبان توصیف ساختار صفحه است. تگ، نام یک بخش داخل علامت‌های < و > است. h1 عنوان اصلی و p پاراگراف متن را نمایش می‌دهد. main بخش اصلی صفحه را در بر می‌گیرد.',
    'در <h1>سلام</h1>، بخش اول تگ باز است، «سلام» محتوای آن و بخش آخر تگ بسته است. اسلش / نشان می‌دهد عنوان تمام شده. دو بخش عنوان و متن را داخل main قرار می‌دهیم.'
  ], '<main>\n  <h1>سلام، من سارا هستم</h1>\n  <p>این اولین صفحهٔ من است.</p>\n</main>', [
    { code: '<main>…</main>', text: 'ظرف مشترک عنوان و پاراگراف.' },
    { code: '<h1>…</h1>', text: 'عنوان اصلی صفحه؛ متن آن را خودمان انتخاب می‌کنیم.' },
    { code: '<p>…</p>', text: 'یک پاراگراف برای توضیح یا معرفی.' }
  ], app('<main><h1>سلام، من سارا هستم</h1><p>این اولین صفحهٔ من است.</p></main>')),
  step('function', 'کامپوننت: یک تابع که ظاهر را برمی‌گرداند', [
    'تابع در JavaScript یک بخش نام‌دار از برنامه است که وقتی اجرا شود کاری انجام می‌دهد. function شروع تعریف تابع است. نام App دلخواه است و () جای ورودی‌های تابع است؛ فعلاً ورودی نداریم. کد داخل { } بدنهٔ تابع است.',
    'return یعنی «این نتیجه را برگردان». وقتی نتیجهٔ یک تابع، توصیف ظاهر صفحه باشد، در React به آن کامپوننت می‌گوییم. نام کامپوننت با حرف بزرگ شروع می‌شود، مثل App یا Welcome.',
    'export default این کامپوننت را خروجی اصلی فایل می‌کند تا محیط آموزش بتواند آن را نمایش دهد. این عبارت مربوط به JavaScript است. در این پروژه فایل و اجرای React از قبل آماده‌اند.'
  ], 'export default function App() {\n  return (\n    <h1>خوش آمدی!</h1>\n  );\n}', [
    { code: 'function App()', text: 'تعریف کامپوننت App؛ React آن را اجرا می‌کند.' },
    { code: 'return (…) ', text: 'ظاهر مورد نظرمان را برمی‌گرداند. پرانتز برای نوشتن چند خط مفید است.' },
    { code: 'export default', text: 'معرفی کامپوننت اصلی فایل به محیط اجرا.' }
  ], app('<h1>خوش آمدی!</h1>')),
  step('jsx', 'JSX: نوشتن ظاهر داخل JavaScript', [
    'کدی مثل <h1>سلام</h1> در فایل JavaScript، JSX نام دارد. JSX شبیه HTML است و به ما اجازه می‌دهد ظاهر را کنار منطق کامپوننت بنویسیم. ابزار پروژه آن را به کدی تبدیل می‌کند که React می‌فهمد.',
    'تگ‌ها را ببند: <p>متن</p> و برای تگ بدون محتوا مثل تصویر، <img />. چند عنصر را در یک ظرف مثل main یا <>…</> قرار بده. در JSX برای کلاس ظاهری از className استفاده می‌کنیم.',
    'فاصله‌گذاری، نوع کوتیشن و سمی‌کالنِ اختیاری معیار امتیاز نیستند. بسته‌بودن تگ‌ها لازم است تا JavaScript بتواند کد را اجرا کند. در تمرین اول، متن عنوان و پاراگراف انتخاب خودت است.'
  ], 'export default function App() {\n  return (\n    <main>\n      <h1>دفتر یادگیری من</h1>\n      <p>امروز ساخت صفحه را یاد گرفتم</p>\n    </main>\n  );\n}', undefined, app('<main><h1>دفتر یادگیری من</h1><p>امروز ساخت صفحه را یاد گرفتم</p></main>'))
];
const javascript: TeachingStep[] = [
  step('js-data', 'متغیر، شیء و آرایه یعنی چه؟', [
    'متغیر یک نام برای نگه‌داشتن مقدار است. const name = "Sara" یک متن را با نام name نگه می‌دارد. متن داخل کوتیشن و عدد بدون کوتیشن نوشته می‌شود. true و false مقدارهای درست/نادرست‌اند.',
    'شیء چند ویژگی یک چیز را نگه می‌دارد؛ مثلاً { name: "Sara", active: true }. با user.name نام را می‌خوانیم. آرایه با [ ] چند مقدار را کنار هم نگه می‌دارد. این داده‌ها بعداً به کارت‌ها و لیست‌های React تبدیل می‌شوند.'
  ], 'const user = { name: "Sara", active: true };\nconst users = [user, { name: "Reza", active: false }];\nconst name = user.name;'),
  step('js-functions', 'تابع و علامت =>', [
    'تابع می‌تواند ورودی بگیرد و نتیجه برگرداند. در تابع double، ورودی number است و خروجی دو برابر آن است. فراخوانی double(3) نتیجهٔ 6 می‌دهد.',
    'number => number * 2 شکل کوتاه همان تابع است و arrow function نام دارد. عبارت بعد از => خودکار برگردانده می‌شود؛ اگر بدنه را با { } بنویسیم، برای برگرداندن نتیجه return لازم داریم.'
  ], 'function double(number) {\n  return number * 2;\n}\nconst doubleShort = number => number * 2;\n// double(3) و doubleShort(3) هر دو 6 هستند.'),
  step('js-map-filter', 'filter انتخاب می‌کند، map تبدیل می‌کند', [
    'filter روی هر عضو آرایه، تابع شرط را اجرا می‌کند و فقط اعضایی را نگه می‌دارد که نتیجه‌شان true باشد. users.filter(user => user.active) فقط کاربران فعال را برمی‌گرداند.',
    'map روی هر عضو تابعی را اجرا می‌کند و نتیجه‌ها را در آرایهٔ جدید می‌گذارد. user => user.name یعنی «از هر کاربر، نامش را بردار». اصل آرایه دست‌نخورده می‌ماند.',
    'اگر filter و map را پشت سر هم بنویسیم، اول انتخاب و بعد تبدیل انجام می‌شود. در نمونه، دو کاربر فعال وجود دارند؛ نام این دو در صفحه دیده می‌شود.'
  ], 'const users = [\n  { name: "Sara", active: true },\n  { name: "Reza", active: false },\n  { name: "Mina", active: true }\n];\nconst names = users.filter(user => user.active).map(user => user.name);', [
    { code: 'user => user.active', text: 'شرط انتخاب: آیا این کاربر فعال است؟' },
    { code: 'user => user.name', text: 'تبدیل: از این کاربر فقط نام را می‌خواهیم.' }
  ], app('<ul>{names.map(name => <li key={name}>{name}</li>)}</ul>', 'const users = [{name:"Sara",active:true},{name:"Reza",active:false},{name:"Mina",active:true}];\nconst names = users.filter(user => user.active).map(user => user.name);')),
  step('js-copy', 'تغییر داده با ساختن نسخهٔ جدید', [
    'برای اضافه‌کردن عضو، [...items, newItem] یک آرایهٔ جدید با اعضای قبلی و عضو تازه می‌سازد. ... به معنی بازکردن اعضاست. برای حذف، filter و برای تغییر یک عضو، map مفید است.',
    'برای کپی شیء، {...user, name: "Mina"} ویژگی‌های قبلی را نگه می‌دارد و name را جایگزین می‌کند. این کپی سطحی است؛ برای تغییر شیء داخلی باید آن بخش را هم کپی کنیم. در React نسخهٔ تازه را به تابع تغییر state می‌دهیم.'
  ], 'const scores = [2, 4];\nconst nextScores = [...scores, 6];\n// scores هنوز [2, 4] است.\nconst person = { name: "Sara", score: 2 };\nconst nextPerson = { ...person, score: 3 };')
];
const components: TeachingStep[] = [
  step('component-purpose', 'چرا کامپوننت جدا می‌سازیم؟', [
    'کامپوننت بخشی از رابط با یک نام مشخص است؛ مثل کارت کاربر یا نوار جست‌وجو. وقتی یک بخش چند بار تکرار می‌شود یا مسئولیت مشخصی دارد، تابع جدا برای آن می‌سازیم.',
    'در نمونه، Welcome ظاهر یک بخش را برمی‌گرداند و App دو بار آن را استفاده می‌کند. <Welcome /> یعنی «این کامپوننت را اینجا نمایش بده». تگ کوچک مثل section عنصر HTML است؛ نام بزرگ مثل Welcome کامپوننت خودمان است.'
  ], 'function Welcome() {\n  return <section><h2>به کلاس خوش آمدی</h2></section>;\n}\nexport default function App() {\n  return <main><Welcome /><Welcome /></main>;\n}', undefined, 'function Welcome(){return <section><h2>به کلاس خوش آمدی</h2></section>;}\nexport default function App(){return <main><Welcome/><Welcome/></main>;}'),
  step('component-export', 'خروجی اصلی و خروجی نام‌دار', [
    'export default برای کامپوننت اصلی فایل است. export function Welcome خروجی نام‌دار می‌سازد؛ فایل دیگری می‌تواند آن را با نام Welcome بخواند. یک فایل می‌تواند چند خروجی نام‌دار و یک خروجی اصلی داشته باشد.',
    'در تمرین‌هایی که یک کامپوننت را با ورودی‌های تازه آزمایش می‌کنیم، باید آن را export کنیم تا تست بتواند مستقیم به همان تابع دسترسی داشته باشد. نام خواسته‌شده در این تمرین، قرارداد دسترسی تست است.'
  ], 'export function Welcome() {\n  return <h2>سلام</h2>;\n}\nexport default function App() {\n  return <Welcome />;\n}')
];
const props: TeachingStep[] = [
  step('props-what', 'Props چیست و کجا به کار می‌آید؟', [
    'Props ورودی‌های یک کامپوننت‌اند. اگر شکل کارت یکی باشد ولی نام آدم‌ها فرق کند، نام را به‌عنوان ورودی می‌فرستیم. کامپوننت والد جایی است که کارت را استفاده می‌کند؛ فرزند، کامپوننت کارت است.',
    'در <Greeting name="Sara" />، ویژگی name یک prop است. تابع Greeting آن را از ورودی دریافت می‌کند. { name } در پارامتر تابع، ویژگی name را از شیء ورودی بیرون می‌آورد؛ این نوشتار destructuring نام دارد.',
    'در JSX، آکولاد {name} یعنی مقدار JavaScript را اینجا نمایش بده. متن ثابت کوتیشن دارد؛ مقدار عددی مثل age={20} داخل آکولاد است. Props را در فرزند تغییر نمی‌دهیم.'
  ], 'function Greeting({ name }) {\n  return <h2>سلام {name}</h2>;\n}\nexport default function App() {\n  return <main><Greeting name="Sara" /><Greeting name="Mina" /></main>;\n}', [
    { code: 'name="Sara"', text: 'والد مقدار متنی را به فرزند می‌فرستد.' },
    { code: 'Greeting({ name })', text: 'فرزند ورودی نام را دریافت می‌کند.' },
    { code: '{name}', text: 'مقدار ورودی در ظاهر صفحه استفاده می‌شود.' }
  ], 'function Greeting({name}){return <h2>سلام {name}</h2>;}\nexport default function App(){return <main><Greeting name="Sara"/><Greeting name="Mina"/></main>;}'),
  step('children', 'children: محتوای داخل یک کامپوننت', [
    'اگر بین تگ باز و بستهٔ کامپوننت چیزی بگذاریم، آن محتوا به‌صورت prop با نام children به کامپوننت می‌رسد. این روش برای قاب، پنجره یا بخش مشترک مفید است.',
    'Panel در نمونه فقط قاب section را می‌سازد. محتوای داخل قاب را App تعیین می‌کند. آکولاد {children} محل نمایش آن محتواست.'
  ], 'function Panel({ children }) {\n  return <section>{children}</section>;\n}\nexport default function App() {\n  return <Panel><h2>یادداشت امروز</h2><p>تمرین کوتاه</p></Panel>;\n}', undefined, 'function Panel({children}){return <section>{children}</section>;}\nexport default function App(){return <Panel><h2>یادداشت امروز</h2><p>تمرین کوتاه</p></Panel>;}')
];
const state: TeachingStep[] = [
  step('state-what', 'State: حافظهٔ کامپوننت', [
    'بعضی مقدارها با کاربر تغییر می‌کنند؛ مثل تعداد لایک. State حافظهٔ React برای این مقدارهاست. تغییر یک متغیر معمولی به React اعلام نمی‌کند که باید صفحه را دوباره نمایش دهد.',
    'useState یک تابع آمادهٔ React است. تابع‌های React که با use شروع می‌شوند Hook نام دارند. Hookها را در ابتدای بدنهٔ کامپوننت، خارج از شرط و حلقه، فراخوانی می‌کنیم.',
    'useState(0) دو چیز می‌دهد: مقدار فعلی و تابع تغییر آن. const [likes, setLikes] این دو را دریافت می‌کند. نام‌ها را خودمان انتخاب می‌کنیم. import تابع را از کتابخانهٔ react وارد فایل می‌کند.'
  ], 'import { useState } from "react";\n\nexport default function App() {\n  const [likes, setLikes] = useState(0);\n  return <output>{likes}</output>;\n}', [
    { code: 'useState(0)', text: 'حافظه با مقدار اولیهٔ صفر شروع می‌شود.' },
    { code: 'likes', text: 'مقداری که در این اجرای کامپوننت داریم.' },
    { code: 'setLikes', text: 'تابع درخواست تغییر حافظه و نمایش دوبارهٔ صفحه.' }
  ]),
  step('state-click', 'از کلیک تا تغییر صفحه', [
    'onClick تابعی را مشخص می‌کند که هنگام کلیک اجرا می‌شود. () => setLikes(n => n + 1) یعنی «هنگام کلیک، مقدار قبلی را بگیر و یکی بیشتر کن». n ورودی تابع است و می‌توانیم نام دیگری برایش انتخاب کنیم.',
    'وقتی setLikes اجرا شود، React کامپوننت را با مقدار تازه فراخوانی می‌کند. این کار render نام دارد. JSX تازه ساخته می‌شود و React بخش لازم صفحه را تغییر می‌دهد. DOM نام ساختار صفحه‌ای است که مرورگر نشان می‌دهد.',
    'روی دکمهٔ نمونه کلیک کن و ببین مقدار نمایش‌داده‌شده تغییر می‌کند. برای تنظیم یک مقدار ثابت می‌توانیم setLikes(0) بنویسیم.'
  ], 'import { useState } from "react";\nexport default function App() {\n  const [likes, setLikes] = useState(0);\n  return <main>\n    <output>{likes}</output>\n    <button onClick={() => setLikes(n => n + 1)}>پسندیدم</button>\n  </main>;\n}', undefined, 'import {useState} from "react";\nexport default function App(){const[likes,setLikes]=useState(0);return <main><output>{likes}</output><button onClick={()=>setLikes(n=>n+1)}>پسندیدم</button></main>;}')
];
const events: TeachingStep[] = [
  step('events-what', 'رویداد: کاری که کاربر انجام می‌دهد', [
    'کلیک، تایپ و ارسال فرم رویداد هستند. Event handler تابعی است که در پاسخ به رویداد اجرا می‌شود. React برای کلیک ویژگی onClick دارد؛ برای تغییر ورودی، onChange.',
    'خود تابع را به onClick بده: onClick={handleClick}. نوشتن handleClick() تابع را همان لحظهٔ ساخت ظاهر اجرا می‌کند. با () => handleClick() اجرای تابع را به زمان کلیک موکول می‌کنیم.',
    'تابع هم می‌تواند یک prop باشد: والد تابع را می‌فرستد و دکمهٔ فرزند آن را بعد از کلیک اجرا می‌کند. به چنین تابعی callback می‌گوییم. این روش فرزند را از تصمیم‌های والد مستقل می‌کند.'
  ], 'function SaveButton({ onSave }) {\n  return <button onClick={onSave}>ذخیره</button>;\n}\n// در والد:\n<SaveButton onSave={() => setMessage("ذخیره شد")} />', [
    { code: 'onClick={onSave}', text: 'اجرای تابع دریافت‌شده در زمان کلیک.' },
    { code: 'onSave={() => …}', text: 'والد تعیین می‌کند بعد از کلیک چه کاری انجام شود.' }
  ], 'import {useState} from "react";\nfunction SaveButton({onSave}){return <button onClick={onSave}>ذخیره</button>;}\nexport default function App(){const[message,setMessage]=useState("آماده");return <main><p>{message}</p><SaveButton onSave={()=>setMessage("ذخیره شد")}/></main>;}')
];
const batching = step('snapshot', 'مقدار هر render و صف تغییرها', [
  'در هر اجرای کامپوننت، مقدار state برای همان اجرا ثابت است؛ مثل عکس از آن لحظه. setNumber(number + 1) مقدار را در همان اجرای فعلی عوض نمی‌کند، بلکه مقدار اجرای بعد را درخواست می‌کند.',
  'اگر number برابر 5 باشد، دو بار setNumber(number + 1) هر دو عدد 6 را درخواست می‌کنند. React تغییرها را با هم پردازش می‌کند. اما دو بار setNumber(n => n + 1) دو تبدیل پشت سر هم‌اند و نتیجه 7 است.',
  'هنگام وابستگی به مقدار قبلی از updater تابعی استفاده کن. حالا که معنی snapshot و صف را می‌دانی، تمرین پیش‌بینی برایت قابل حل است.'
], 'setNumber(number + 1); // درخواست 6\nsetNumber(number + 1); // درخواست همان 6\n\nsetNumber(n => n + 1); // 5 → 6\nsetNumber(n => n + 1); // 6 → 7');
const jsxValues = step('jsx-values', 'آکولاد: آوردن مقدار JavaScript به JSX', [
  'اگر name یک متغیر JavaScript باشد، نوشتن <h2>name</h2> خود کلمهٔ name را نشان می‌دهد. با <h2>{name}</h2> مقدار متغیر وارد JSX می‌شود. داخل آکولاد عبارت قابل محاسبه می‌نویسیم؛ مثلاً {age + 1}.',
  'برای ویژگی هم همین روش را داریم: title={name} مقدار متغیر را می‌فرستد، ولی title="name" یک متن ثابت است. در JSX یک شیء کامل را مستقیم نمایش نده؛ ویژگی متنی آن مثل person.name را بخوان.'
], 'const person = {name: "Sara", age: 20};\nreturn <main><h2>{person.name}</h2><p>سال بعد: {person.age + 1}</p></main>;', undefined, app('<main><h2>{person.name}</h2><p>سال بعد: {person.age + 1}</p></main>', 'const person={name:"Sara",age:20};'));
const lists: TeachingStep[] = [
  step('conditional', 'نمایش شرطی: کدام بخش دیده شود؟', [
    'گاهی ظاهر به یک شرط بستگی دارد. loggedIn ? <p>سلام</p> : <p>وارد شو</p> یعنی اگر loggedIn درست است بخش اول و در غیر این صورت بخش دوم را نشان بده. علامت ? و : این انتخاب را می‌سازند.',
    'شرط && عنصر زمانی مفید است که فقط در حالت درست، یک بخش را نشان دهیم. enabled ? "On" : "Off" هم یک انتخاب متنی است. برای تغییر boolean از ! استفاده می‌کنیم؛ !true برابر false است.'
  ], 'const loggedIn = false;\nreturn <main>{loggedIn ? <p>سلام</p> : <p>وارد شو</p>}</main>;'),
  step('list-map', 'ساختن رابط از آرایه و معنی key', [
    'هر عضو آرایه می‌تواند یک عنصر رابط شود. map برای هر عضو JSX می‌سازد. داخل JSX، کل عبارت map را در آکولاد قرار می‌دهیم.',
    'key شناسهٔ عضو لیست برای React است؛ کمک می‌کند پس از حذف یا جابه‌جایی، عضوها را تشخیص دهد. شناسهٔ ثابت داده مثل item.id مناسب است. key ورودی معمولی فرزند نیست؛ اگر فرزند به شناسه نیاز دارد آن را جدا بفرست.',
    'در نمونهٔ آماده سه کتاب داریم. هر کتاب یک li است و عنوانش از داده خوانده می‌شود؛ تکرار دستی سه li لازم نیست.'
  ], 'const books = [{id: 1, title: "داستان"}, {id: 2, title: "طراحی"}];\nreturn <ul>{books.map(book => <li key={book.id}>{book.title}</li>)}</ul>;', undefined, app('<ul>{books.map(book => <li key={book.id}>{book.title}</li>)}</ul>', 'const books=[{id:1,title:"داستان"},{id:2,title:"طراحی"},{id:3,title:"برنامه‌نویسی"}];')),
  step('list-update', 'افزودن، حذف و تغییر یک عضو', [
    'اگر لیست تغییر می‌کند، آن را در state نگه دار. برای افزودن، آرایهٔ تازه با spread بساز. برای حذف، filter همهٔ عضوها به‌جز عضو مورد نظر را نگه می‌دارد. برای تغییر، map فقط عضو با شناسهٔ مورد نظر را جایگزین می‌کند.',
    'لیست فیلترشده از لیست اصلی و گزینهٔ فیلتر به دست می‌آید؛ آن را هنگام render محاسبه کن. ساخت state دوم برای همین نتیجه، هماهنگ‌کردن داده‌ها را سخت‌تر می‌کند.'
  ], 'setItems(items => [...items, newItem]);\nsetItems(items => items.filter(item => item.id !== removedId));\nsetItems(items => items.map(item =>\n  item.id === changedId ? { ...item, done: !item.done } : item\n));')
];
const forms: TeachingStep[] = [
  step('controlled-input', 'فرم و ورودی کنترل‌شده', [
    'فرم اطلاعات کاربر را دریافت می‌کند. وقتی مقدار input از state می‌آید، ورودی کنترل‌شده است. value مقدار فعلی را نشان می‌دهد و onChange با هر تایپ، مقدار تازه را از event.target.value می‌خواند.',
    'event شیء اطلاعات رویداد است و target عنصری است که رویداد از آن آمده. یک label مشخص می‌کند ورودی برای چیست؛ aria-label هم نامی برای ابزارهای دسترس‌پذیری و تست می‌گذارد.',
    'در نمونه تایپ کن؛ output از همان state خوانده می‌شود و هم‌زمان تغییر می‌کند. برای checkbox از checked و event.target.checked استفاده می‌کنیم.'
  ], 'const [name, setName] = useState("");\n<input aria-label="Name" value={name}\n  onChange={event => setName(event.target.value)} />\n<output>{name}</output>', undefined, 'import {useState} from "react";\nexport default function App(){const[name,setName]=useState("");return <main><label>نام <input aria-label="Name" value={name} onChange={event=>setName(event.target.value)}/></label><output>{name||"نامت را بنویس"}</output></main>;}'),
  step('submit', 'ارسال فرم و اعتبارسنجی', [
    'onSubmit تابع ارسال فرم است. رفتار عادی مرورگر می‌تواند صفحه را جابه‌جا کند؛ event.preventDefault() آن رفتار را متوقف می‌کند تا خودمان ارسال را انجام دهیم.',
    'قبل از ثبت، ورودی را بررسی می‌کنیم. trim فاصلهٔ ابتدا و انتهای متن را حذف می‌کند. اگر متن خالی است، پیام مناسب نشان بده؛ در غیر این صورت ثبت کن و ورودی را خالی کن. دکمهٔ داخل فرم، پیش‌فرض ارسال است؛ برای دکمه‌های دیگر type="button" قرار بده.',
    'اعتبارسنجی آموزشی یک ایمیل با includes("@") ساده است. در برنامهٔ واقعی، اعتبارسنجی و مجوز سمت سرور هم لازم می‌شود.'
  ], 'function submit(event) {\n  event.preventDefault();\n  if (!name.trim()) { setMessage("نام لازم است"); return; }\n  setMessage("ثبت شد");\n}\n<form onSubmit={submit}>…<button>ثبت</button></form>')
];
const effects: TeachingStep[] = [
  step('effect-what', 'useEffect: هماهنگ‌شدن با بیرون React', [
    'Effect کاری است که پس از به‌روزرسانی صفحه، کامپوننت را با چیزی بیرونی هماهنگ می‌کند؛ مثل عنوان تب، تایمر یا اتصال شبکه. برای جمع دو عدد یا فیلتر آرایه که از داده‌های فعلی محاسبه می‌شود Effect لازم نداریم.',
    'useEffect دو ورودی می‌گیرد: تابع کار و آرایهٔ وابستگی‌ها. [name] یعنی اگر name نسبت به اجرای قبلی تغییر کرد، دوباره کار را انجام بده. [] برای کاری است که به مقدار متغیر داخل کامپوننت وابسته نیست.',
    'هر مقدار واکنشی که در تابع استفاده شده باید در وابستگی‌ها باشد؛ حذف آن ممکن است اطلاعات قدیمی را نگه دارد. بدون آرایه، Effect بعد از هر commit اجرا می‌شود؛ commit مرحلهٔ اعمال تغییرها روی صفحه است.'
  ], 'useEffect(() => {\n  document.title = "سلام " + name;\n}, [name]);', [
    { code: '() => { … }', text: 'کاری که بعد از به‌روزرسانی صفحه انجام می‌دهیم.' },
    { code: '[name]', text: 'اگر نام تغییر کند، هماهنگ‌سازی هم تکرار می‌شود.' }
  ]),
  step('cleanup', 'cleanup: بستن کاری که شروع کرده‌ایم', [
    'setInterval یک کار را هر چند میلی‌ثانیه تکرار می‌کند. اگر کامپوننت حذف شود ولی تایمر باقی بماند، کار ناخواسته ادامه پیدا می‌کند. تابعی که Effect با return برمی‌گرداند، cleanup نام دارد.',
    'React قبل از اجرای Effect تازه با وابستگی تغییرکرده و هنگام حذف کامپوننت، cleanup را اجرا می‌کند. clearInterval تایمر را متوقف می‌کند. در نمونه مقدار هر ثانیه یکی زیاد می‌شود.',
    'تابع n => n + 1 مقدار تازهٔ قبلی را دریافت می‌کند؛ بنابراین تایمر به مقدار قدیمیِ لحظهٔ ساخته‌شدنش وابسته نیست. چنین نگه‌داشتن متغیرها در تابع را closure می‌نامیم.'
  ], 'useEffect(() => {\n  const id = setInterval(() => setSeconds(n => n + 1), 1000);\n  return () => clearInterval(id);\n}, []);', undefined, 'import {useState,useEffect} from "react";\nexport default function App(){const[seconds,setSeconds]=useState(0);useEffect(()=>{const id=setInterval(()=>setSeconds(n=>n+1),1000);return()=>clearInterval(id);},[]);return <main><p>ثانیه‌های این نمونه</p><output>{seconds}</output></main>;}'),
  step('ref', 'useRef: دسترسی به عنصر، بدون تغییر ظاهر', [
    'useRef یک ظرف پایدار با ویژگی current می‌دهد. تغییر current خودش render ایجاد نمی‌کند؛ برای مقدار قابل نمایش و متغیر همچنان state مناسب است.',
    'اگر ref را به input بدهیم، React عنصر واقعی مرورگر را در current می‌گذارد. field.current.focus() مکان تایپ را به آن ورودی می‌برد. قبل از ساخته‌شدن عنصر، current می‌تواند null باشد.'
  ], 'const field = useRef(null);\n<input ref={field} />\n<button onClick={() => field.current.focus()}>شروع تایپ</button>'),
  step('custom-hook', 'Custom Hook: استفادهٔ دوباره از منطق', [
    'وقتی چند کامپوننت به منطق یکسان نیاز دارند، تابعی با نام use… می‌سازیم و Hookها را داخل آن فراخوانی می‌کنیم. این تابع JSX لازم ندارد؛ می‌تواند مقدارها و تابع‌های لازم را برگرداند.',
    'هر بار استفاده از Custom Hook، state مستقل دارد. خود Hook یک حافظهٔ مشترک بین همهٔ کامپوننت‌ها نمی‌سازد. برای نمونه، دو استفاده از useToggle دو کلید مستقل‌اند.'
  ], 'function useToggle() {\n  const [enabled, setEnabled] = useState(false);\n  return [enabled, () => setEnabled(value => !value)];\n}')
];
const api: TeachingStep[] = [
  step('api-what', 'API، درخواست و پاسخ', [
    'API راهی است که برنامه از یک سرویس داده می‌گیرد. fetch(url) درخواست را شروع می‌کند. پاسخ فوراً حاضر نیست؛ Promise نتیجه‌ای است که بعداً آماده می‌شود. then کار بعد از آماده‌شدن و catch کار بعد از خطا را تعیین می‌کند.',
    'response.json() متن JSON پاسخ را به دادهٔ JavaScript تبدیل می‌کند. JSON یک قالب متنی برای انتقال شیءها و آرایه‌هاست. response.ok موفق‌بودن وضعیت HTTP را نشان می‌دهد؛ fetch برای خطاهایی مثل 404 لزوماً reject نمی‌شود.',
    'در این محیط /api/weather، /api/movies و /api/users دادهٔ شبیه‌سازی‌شده می‌دهند. تأخیر و خطا هم دارند تا بدون حساب سرویس بیرونی تمرین کنی.'
  ], 'fetch("/api/users")\n  .then(response => {\n    if (!response.ok) throw new Error("درخواست موفق نبود");\n    return response.json();\n  })\n  .then(users => setUsers(users))\n  .catch(() => setError(true));'),
  step('api-states', 'سه حالت صفحه: انتظار، داده و خطا', [
    'تا رسیدن پاسخ، پیام Loading نشان بده. اگر داده رسید نتیجه را نمایش بده؛ اگر خطا رخ داد پیام خطا. این سه حالت از هم جدا هستند و کاربر نباید با صفحهٔ خالی روبه‌رو شود.',
    'درخواست وابسته به شهر را در Effect با [city] اجرا می‌کنیم. هنگام تغییر شهر، دادهٔ قبلی را پاک و درخواست تازه را آغاز می‌کنیم. AbortController اجازه می‌دهد در cleanup درخواست قبلی را لغو کنیم تا پاسخ قدیمی جای تازه را نگیرد.'
  ], 'useEffect(() => {\n  const controller = new AbortController();\n  // fetch(url, { signal: controller.signal })\n  return () => controller.abort();\n}, [city]);', undefined, 'import {useState,useEffect} from "react";\nexport default function App(){const[data,setData]=useState(null),[error,setError]=useState(false);useEffect(()=>{const c=new AbortController();fetch("/api/weather?city=Shiraz",{signal:c.signal}).then(r=>{if(!r.ok)throw Error("HTTP");return r.json();}).then(setData).catch(e=>{if(e.name!=="AbortError")setError(true);});return()=>c.abort();},[]);return <output>{error?"خطا":data?data.city+" "+data.temperature+"°C":"Loading"}</output>;}')
];
const router: TeachingStep[] = [
  step('router-purpose', 'Router: چند صفحه در یک برنامه', [
    'مسیر، بخش آدرس مربوط به یک صفحه است؛ مثلاً /help. Router تصمیم می‌گیرد در هر مسیر کدام کامپوننت دیده شود. React Router کتابخانه‌ای برای همین کار است.',
    'MemoryRouter مسیرها را در حافظه نگه می‌دارد و برای پیش‌نمایش مستقل ما مناسب است. Routes مجموعهٔ مسیرهاست. Route با path مسیر و با element ظاهر آن را مشخص می‌کند. Link با to کاربر را به مسیر تازه می‌برد.'
  ], '<MemoryRouter>\n  <Link to="/help">راهنما</Link>\n  <Routes>\n    <Route path="/" element={<h2>خانه</h2>} />\n    <Route path="/help" element={<h2>راهنما</h2>} />\n  </Routes>\n</MemoryRouter>', undefined, 'import {MemoryRouter,Routes,Route,Link} from "react-router-dom";\nexport default function App(){return <MemoryRouter><nav><Link to="/">خانه</Link> | <Link to="/help">راهنما</Link></nav><Routes><Route path="/" element={<h2>خانه</h2>}/><Route path="/help" element={<h2>راهنما</h2>}/></Routes></MemoryRouter>;}'),
  step('router-nested', 'Layout مشترک و مسیر تودرتو', [
    'Layout بخشی مثل منوست که بین صفحه‌ها مشترک است. در مسیر تودرتو، Outlet در Layout محل نمایش فرزند است. index یعنی صفحهٔ پیش‌فرض والد و * یعنی مسیرهای تعریف‌نشده.',
    'برای /products/12 می‌توان path="products/:id" نوشت؛ useParams مقدار id را می‌خواند. این داده از URL می‌آید، پس برای نمایش صفحهٔ همان محصول نیازی به state جدا نیست.'
  ], 'function Layout() { return <main><nav>منو</nav><Outlet /></main>; }\n<Route path="/" element={<Layout />}>\n  <Route index element={<Home />} />\n  <Route path="help" element={<Help />} />\n</Route>')
];
const reducer: TeachingStep[] = [
  step('reducer-purpose', 'Reducer و Action: نام‌گذاری تغییرها', [
    'وقتی تغییرهای state چند نوع هستند، می‌توان منطقشان را در تابع reducer جمع کرد. Action شیئی است که می‌گوید چه اتفاقی افتاد؛ مثلاً { type: "added" }. Reducer مقدار قبلی و Action را می‌گیرد و مقدار بعدی را برمی‌گرداند.',
    'useReducer(reducer, initialState) مقدار state و تابع dispatch می‌دهد. dispatch(action) یعنی این رویداد را برای پردازش بفرست. Reducer خالص است: داده را حساب می‌کند و خودش درخواست شبکه یا تغییر صفحه انجام نمی‌دهد.'
  ], 'function reducer(score, action) {\n  if (action.type === "bonus") return score + 5;\n  if (action.type === "reset") return 0;\n  return score;\n}\nconst [score, dispatch] = useReducer(reducer, 0);\ndispatch({ type: "bonus" });', undefined, 'import {useReducer} from "react";\nfunction reducer(score,action){if(action.type==="bonus")return score+5;if(action.type==="reset")return 0;return score;}\nexport default function App(){const[score,dispatch]=useReducer(reducer,0);return <main><output>{score}</output><button onClick={()=>dispatch({type:"bonus"})}>پاداش +5</button><button onClick={()=>dispatch({type:"reset"})}>از نو</button></main>;}'),
  step('redux', 'Redux Toolkit: حافظهٔ مشترک برنامه', [
    'گاهی چند بخش دور از هم به یک داده مثل سبد خرید نیاز دارند. Store حافظهٔ مشترک است. Redux Toolkit با createSlice حالت اولیه، منطق تغییرها و Actionهای آماده را در یک بخش تعریف می‌کند.',
    'configureStore بخش‌ها را به Store وصل می‌کند. Provider آن را در اختیار فرزندان می‌گذارد. useSelector یک قسمت از داده را می‌خواند و useDispatch تابع ارسال Action را می‌دهد.',
    'در createSlice می‌توان ظاهراً state را تغییر داد؛ Toolkit با Immer نسخهٔ تازه می‌سازد. در state معمولی React این اجازه را نداریم. State کوچک یک input معمولاً همان useState محلی باقی می‌ماند.'
  ], 'const slice = createSlice({\n  name: "score", initialState: { value: 0 },\n  reducers: { bonus(state) { state.value += 5; } }\n});\nconst store = configureStore({ reducer: { score: slice.reducer } });\n// <Provider store={store}><Score /></Provider>\n// useSelector(state => state.score.value)\n// dispatch(slice.actions.bonus())')
];
const query: TeachingStep[] = [
  step('query-purpose', 'React Query: نگهداری دادهٔ سرور', [
    'داده‌ای که از سرور می‌آید با حالت محلی مثل بازبودن یک پنجره فرق دارد. React Query نتیجهٔ درخواست را نگه می‌دارد و وضعیت انتظار، خطا و دریافت دوباره را مدیریت می‌کند. Cache همان نتیجهٔ ذخیره‌شده برای استفادهٔ بعدی است.',
    'QueryClient مدیریت cache را انجام می‌دهد و QueryClientProvider آن را در اختیار فرزندان قرار می‌دهد. useQuery به queryKey برای هویت داده و queryFn برای دریافت آن نیاز دارد. هر ورودی مؤثر در درخواست، مثل city، باید در key هم باشد.',
    'isPending یعنی داده هنوز آماده نیست، isError یعنی دریافت شکست خورده و data پاسخ آماده است. staleTime مدت تازه‌دانستن داده است؛ با مدت نگهداری cache یکی نیست.'
  ], 'const client = new QueryClient();\n// <QueryClientProvider client={client}><Weather /></QueryClientProvider>\nconst weather = useQuery({\n  queryKey: ["weather", city],\n  queryFn: () => fetch("/api/weather?city=" + city).then(r => r.json()),\n  staleTime: 60000\n});'),
  step('query-update', 'تغییر و تازه‌کردن cache', [
    'useQueryClient به client همان Provider دسترسی می‌دهد. setQueryData نتیجهٔ یک key را مستقیم به‌روز می‌کند؛ درخواست جدیدی نمی‌سازد. invalidateQueries دادهٔ مرتبط را کهنه اعلام می‌کند تا در صورت فعال‌بودن دوباره دریافت شود.',
    'Mutation برای عملیات تغییر سرور مثل افزودن سفارش است. بعد از موفقیت، cache مرتبط را تازه می‌کنیم. در این تمرین با cache محلی کار می‌کنیم تا اثر تغییر را فوری ببینیم.'
  ], 'const client = useQueryClient();\nclient.setQueryData(["weather", "Shiraz"], {city: "Shiraz", temperature: 31});\nclient.invalidateQueries({queryKey: ["weather"]});')
];
const performance: TeachingStep[] = [
  step('derived-data', 'دادهٔ مشتق‌شده و اندازه‌گیری', [
    'نتیجه‌ای که از داده‌های فعلی حساب می‌شود، دادهٔ مشتق‌شده است؛ مثل لیست محصولات مطابق جست‌وجو. در render آن را حساب کن. Effect و state جدا برای همین نتیجه معمولاً لازم نیست.',
    'قبل از بهینه‌کردن ببین کدام کار هزینه دارد. شمارش فراخوانی کامپوننت کمک می‌کند رفتار را ببینی، اما زمان این آزمایشگاه معیار سرعت برنامهٔ واقعی نیست.'
  ], 'const visible = products.filter(product => product.name.includes(search));'),
  step('memo', 'useMemo، useCallback و memo چه فرقی دارند؟', [
    'useMemo نتیجهٔ یک محاسبه را تا تغییر وابستگی‌ها نگه می‌دارد. useCallback خود تابع را نگه می‌دارد. memo دور یک کامپوننت می‌آید و می‌تواند render ناشی از Props یکسان را رد کند.',
    'تمام ورودی‌های محاسبه باید در وابستگی باشند. اگر search را جا بیندازی، نتیجهٔ قدیمی می‌بینی. جمع دو عدد معمولاً ارزش این پیچیدگی را ندارد؛ برای محاسبهٔ سنگینِ اندازه‌گیری‌شده تصمیم می‌گیریم.'
  ], 'const visible = useMemo(\n  () => products.filter(product => product.name.includes(search)),\n  [products, search]\n);\nconst handleSave = useCallback(() => save(id), [id]);')
];
const testing: TeachingStep[] = [
  step('test-purpose', 'تست: آیا رفتار مورد انتظار رخ می‌دهد؟', [
    'تست برنامه‌ای کوچک است که رفتار را بررسی می‌کند. مثلاً ابتدا تعداد لایک صفر است؛ پس از کلیک باید یک شود. داشتن یک دکمه به‌تنهایی ثابت نمی‌کند کلیک کار می‌کند.',
    'در Testing Library، render رابط را می‌سازد. screen.getByRole عنصر را با نقشش و نامش پیدا می‌کند. fireEvent.click رویداد کلیک می‌فرستد. expect و assertion ادعایی است که باید درست باشد.',
    'در تمرین، تابع testCounter ابزارها را به‌عنوان ورودی می‌گیرد. تست روی نسخهٔ سالم و نسخهٔ خراب اجرا می‌شود: باید سالم را قبول و خراب را رد کند. این کار کمک می‌کند تست فقط ظاهر را بررسی نکند.'
  ], 'render(<LikeButton />);\nexpect(screen.getByRole("status")).toHaveTextContent("0");\nfireEvent.click(screen.getByRole("button", {name: "Like"}));\nexpect(screen.getByRole("status")).toHaveTextContent("1");'),
  step('test-names', 'نام قابل دسترس و نتیجهٔ قابل مشاهده', [
    'role="status" خروجی وضعیت را مشخص می‌کند. نام یک button معمولاً متن آن است. input می‌تواند نامش را از label یا aria-label بگیرد. این قرارداد هم به کاربر ابزار کمکی و هم به تست کمک می‌کند.',
    'به‌جای وابستگی به متغیر داخلی کامپوننت، نتیجهٔ روی صفحه را بررسی کن. اگر نسخهٔ خراب همان متن اولیه را نگه دارد، assertion بعد از کلیک باید شکست بخورد.'
  ], '<output role="status">{likes}</output>\n<button>Like</button>')
];
const architecture: TeachingStep[] = [
  step('architecture-purpose', 'جداکردن مسئولیت‌ها', [
    'بازآرایی یعنی تغییر ساختار کد با حفظ رفتار. کامپوننت کوچک برای نمایش یک عضو، کامپوننت لیست برای کنارهم‌گذاشتن عضوها و Custom Hook برای منطق داده، مرزهای روشن ایجاد می‌کنند.',
    'داده را در نزدیک‌ترین والد مشترک مصرف‌کننده‌ها نگه دار و مقدار و callback را با Props بفرست. دو state جدا برای یک دادهٔ یکسان می‌توانند ناهماهنگ شوند. اول رفتار را با تست حفظ کن و سپس ساختار را تغییر بده.'
  ], 'function App() {\n  const tasks = useTasks();\n  return <TaskList items={tasks.items} onRemove={tasks.remove} />;\n}'),
  step('storage', 'ذخیره‌سازی برای بعد از بازکردن صفحه', [
    'localStorage متن را در مرورگر نگه می‌دارد. JSON.stringify آرایه یا شیء را به متن تبدیل می‌کند و JSON.parse دوباره داده می‌سازد. نبودن مقدار ذخیره‌شده باید به حالت اولیهٔ معتبر برگردد.',
    'useState(() => loadItems()) خواندن اولیه را به شروع state محدود می‌کند. با Effect وابسته به items، نسخهٔ تازه را ذخیره می‌کنیم. در محیط این درس، ذخیرهٔ پروژه از داده‌های سایت جدا نگه داشته می‌شود.'
  ], 'const [items, setItems] = useState(() =>\n  JSON.parse(localStorage.getItem("items") || "null") || []\n);\nuseEffect(() => {\n  localStorage.setItem("items", JSON.stringify(items));\n}, [items]);')
];
const final: TeachingStep[] = [
  step('plan', 'از نیاز کاربر تا برنامهٔ قابل ساخت', [
    'قبل از کدنویسی، کارهای کاربر را مشخص کن: افزودن درس، انجام‌دادن، حذف، فیلتر و بازگشت بعد از بستن صفحه. هر کدام باید نتیجهٔ قابل مشاهده داشته باشد.',
    'دادهٔ اصلی لیست درس‌هاست؛ متن ورودی و فیلتر، stateهای محلی دیگر هستند. تعداد انجام‌شده و لیست فیلترشده را از دادهٔ اصلی حساب کن. سپس ظاهر را به فرم، لیست و عضو لیست تقسیم کن.'
  ]), ...architecture,
  step('build-order', 'ساخت مرحله‌به‌مرحله و مرور', [
    'ابتدا نمایش دادهٔ نمونه را بساز، سپس افزودن را وصل کن و یک بار اجرا کن. بعد انجام‌دادن و فیلتر را اضافه کن. در پایان ذخیره‌سازی و بازگشت صفحه را بررسی کن.',
    'از Props برای داده و callback استفاده کن و منطق لیست را در Custom Hook جمع کن. رفتار سالم را بعد از هر تغییر دوباره بررسی کن. هدف این مرحله ترکیب دانسته‌های قبلی در یک برنامه است.'
  ])
];

const byChapter: Record<number, TeachingStep[]> = { 0: javascript, 1: react, 2: [...components, ...props], 3: [...state, ...events], 4: lists, 5: forms, 6: effects, 7: api, 8: router, 9: reducer, 10: query, 11: performance, 12: testing, 13: architecture, 14: final };
const debounce = step('debounce', 'Debounce: صبر کوتاه پس از تایپ', [
  'اگر با هر حرف درخواست بفرستیم، تعداد درخواست‌ها زیاد می‌شود. Debounce یعنی پس از آخرین تغییر، کمی صبر کن و سپس مقدار را منتشر کن.',
  'setTimeout یک بار کار را پس از تأخیر اجرا می‌کند. اگر کاربر دوباره تایپ کند، cleanup تایمر قبلی را پاک و تایمر تازه را آغاز می‌کند. در نمونه پس از 400 میلی‌ثانیه مقدار تازه آماده می‌شود.'
], 'function useDebounced(value) {\n  const [ready, setReady] = useState(value);\n  useEffect(() => {\n    const id = setTimeout(() => setReady(value), 400);\n    return () => clearTimeout(id);\n  }, [value]);\n  return ready;\n}');

export function getChapterLesson(id: number): TeachingLesson {
  const chapter = chapters.find(c => c.id === id) ?? chapters[1]!;
  return { title: chapter.title, steps: [...byChapter[chapter.id]!, ...(chapter.id === 1 ? [jsxValues] : []), ...chapterSupplements[chapter.id]!], reference: chapter.concept.reference, ...chapterDetails[chapter.id]! };
}
export function getTeachingLesson(challenge: Challenge): TeachingLesson {
  const lesson = getChapterLesson(challenge.chapterId ?? 1);
  let steps = [...lesson.steps];
  // Keep the first lesson short enough for a complete beginner.
  if (challenge.id === 'hello-react') steps = [...react];
  if (challenge.chapterId === 1 && challenge.id !== 'hello-react') steps.push(javascript[0]!, jsxValues);
  if (challenge.id === 'profile-card') steps = [...components];
  if (challenge.id === 'product-props') steps = [...props.slice(0, 1), components[1]!];
  if (challenge.id === 'click-events') steps = [...state, ...events];
  if (challenge.id === 'state-counter') steps = [...state];
  if (['state-batching', 'state-debug'].includes(challenge.id)) steps.push(batching);
  if (['state-toggle', 'quantity-mastery', 'thermostat-mastery', 'components-mastery', 'login-reading'].includes(challenge.id)) steps.push(lists[0]!);
  if (challenge.id.startsWith('todo-')) {
    steps = challenge.id === 'todo-item' ? [...props.slice(0,1), lists[1]!] : [...lists];
    if (['todo-add', 'todo-delete', 'todo-complete', 'todo-filter', 'todo-storage', 'todo-hook'].includes(challenge.id)) steps.push(...forms);
    if (['todo-storage', 'todo-hook'].includes(challenge.id)) steps.push(effects[0]!, architecture[1]!);
    if (challenge.id === 'todo-hook') steps.push(effects[3]!, architecture[0]!);
  }
  if (challenge.id.includes('debounce') || challenge.id === 'interview-code') steps.push(debounce);
  if (challenge.id.startsWith('shop-')) steps.push(lists[1]!, lists[2]!, step('cart-total', 'جمع سبد از قیمت و تعداد', [
    'سبد می‌تواند شیئی باشد که کلید هر محصول، شناسهٔ آن و مقدارش تعداد انتخاب‌شده است. cart[id] || 0 برای محصول انتخاب‌نشده صفر می‌دهد. تعداد تازه را با کپی شیء و تغییر همان کلید می‌سازیم.',
    'reduce یک آرایه را به یک نتیجه تبدیل می‌کند. برای جمع سبد، از صفر شروع می‌کنیم و در هر عضو، قیمت ضربدر تعداد را به جمع قبلی اضافه می‌کنیم. جمع سبد از دادهٔ فعلی محاسبه می‌شود و state جدا نمی‌خواهد.'
  ], 'const total = products.reduce(\n  (sum, product) => sum + product.price * (cart[product.id] || 0),\n  0\n);'));
  if (challenge.id.startsWith('admin-')) steps.push(...api, lists[1]!, lists[2]!, lists[0]!, step('disabled', 'نقش کاربر و دکمهٔ غیرفعال', [
    'disabled={true} دکمه را در مرورگر غیرفعال می‌کند. می‌توانیم این مقدار را از نقش فعلی حساب کنیم؛ مثلاً role !== "Editor". select مانند input با value و onChange به state متصل می‌شود.',
    'این تمرین نقش را در ظاهر کنترل می‌کند. در برنامهٔ واقعی، مجوز عملیات سمت سرور هم بررسی می‌شود؛ غیرفعال‌کردن یک دکمه به‌تنهایی مجوز ایجاد نمی‌کند.'
  ], '<button disabled={role !== "Editor"} onClick={remove}>حذف</button>'));
  if (challenge.id === 'hooks-boss') steps.push(api[0]!, javascript[3]!);
  // Some project lessons reuse material already included in the chapter.
  steps = [...new Map(steps.map(item => [item.id, item])).values()];
  steps.push(step('ready', 'حالا آمادهٔ تمرین هستی', [
    `در مرحلهٔ بعد «${challenge.title}» را انجام می‌دهی. ${challenge.description}`,
    challenge.tests.every(t => t.questionId) ? 'حالا با مفهومی که خواندی، خروجی یا رفتار یک مثال تازه را بررسی می‌کنی. پس از پاسخ، دلیل نتیجه نمایش داده می‌شود. برای مرور، هر زمان می‌توانی به درس برگردی.' : 'نیازمندی‌ها را یکی‌یکی پیاده کن و با «اجرای کد» نتیجه را ببین. داوری رفتار صفحه را بررسی می‌کند؛ فاصله‌گذاری کد، سمی‌کالن اختیاری و نقطهٔ انتهای جمله معیار نیستند. نام‌های خواسته‌شدهٔ کامپوننت و ویژگی‌ها قرارداد تست‌اند.',
    'مرور درس و اجرای نمونه رایگان است. راهنمای حل تمرین و پاسخ آماده، ابزارهای جدا هستند و کاهش امتیازشان قبل از استفاده نوشته شده است.'
  ]));
  return { ...lesson, steps };
}
