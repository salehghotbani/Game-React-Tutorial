import type { Challenge } from '@react-quest/shared';
import { extraChallenges } from './content';
import { buildChallenges } from './builds';
import { advancedChallenges } from './advanced';
import { chapters } from './curriculum';
export { chapters, skills, rooms, challengeKinds } from './curriculum';
export { getTeachingLesson, getChapterLesson } from './teaching';
export { projectDefinitions, fixtureEndpoints } from './advanced';

const starter = (code: string) => ({ 'src/App.jsx': code });

const foundationChallenges: Challenge[] = [
  {
    id: 'hello-react', title: 'اولین کامپوننت تو', topic: 'JSX',
    description: 'یک سلام کوچک، شروع یک دنیای بزرگ. اولین کامپوننت React خودت را بساز.',
    instructions: ['در کامپوننت اصلی یک h1 با عنوان دلخواه و غیرخالی نمایش بده.', 'یک p با متن معرفی دلخواه و غیرخالی اضافه کن؛ نقطهٔ پایان جمله لازم نیست.', 'کامپوننت اصلی باید export default باشد؛ main می‌تواند ظرف عنوان و متن باشد.'],
    starterFiles: starter('export default function App() {\n  return (\n    <main>\n      {/* سلام تو این‌جا نوشته می‌شود */}\n    </main>\n  );\n}\n'),
    tests: [
      { id: 'heading', name: 'یک عنوان با محتوای دلخواه نمایش داده می‌شود', mandatory: true, steps: [{ type: 'nonempty-text', selector: 'h1' }] },
      { id: 'paragraph', name: 'یک پاراگراف با محتوای دلخواه نمایش داده می‌شود', mandatory: true, steps: [{ type: 'nonempty-text', selector: 'p' }] }
    ],
    hints: ['JSX شبیه HTML است و در return کامپوننت قرار می‌گیرد.', 'عنوان و پاراگراف را داخل همان main قرار بده.', 'برای عنوان از <h1> و برای متن از <p> استفاده کن.'],
    xp: 200, coins: 20, prerequisites: []
  },
  {
    id: 'profile-card', title: 'کارت یک برنامه‌نویس', topic: 'Components',
    description: 'رابط را به قطعه‌های کوچک تقسیم کن. یک کامپوننت مستقل برای کارت پروفایل بساز.',
    instructions: ['کامپوننتی به نام ProfileCard بساز و در App نمایش بده.', 'کارت یک h2 با متن Ada Lovelace داشته باشد.', 'داخل کارت یک p با متن React Developer و یک button با متن Follow قرار بده.'],
    starterFiles: starter('function ProfileCard() {\n  return <section>{/* کارت پروفایل */}</section>;\n}\n\nexport default function App() {\n  return <main><ProfileCard /></main>;\n}\n'),
    tests: [
      { id: 'profile', name: 'کامپوننت ProfileCard و نام برنامه‌نویس', mandatory: true, source: { component: 'ProfileCard' }, steps: [{ type: 'text', selector: 'h2', text: 'Ada Lovelace' }] },
      { id: 'role', name: 'نقش برنامه‌نویس', mandatory: true, steps: [{ type: 'text', selector: 'p', text: 'React Developer' }] },
      { id: 'follow', name: 'دکمهٔ دنبال‌کردن', mandatory: true, steps: [{ type: 'text', selector: 'button', text: 'Follow' }] }
    ],
    hints: ['نام کامپوننت React با حرف بزرگ شروع می‌شود.', 'ProfileCard باید JSX کارت را برگرداند؛ App آن را استفاده می‌کند.', 'h2، p و button را داخل section قرار بده.'],
    xp: 200, coins: 20, prerequisites: ['hello-react']
  },
  {
    id: 'product-props', title: 'یک کارت، چند محصول', topic: 'Props',
    description: 'با props یک کامپوننت را برای داده‌های مختلف استفاده کن.',
    instructions: ['ProductCard را با نام و قیمت ورودی بساز و آن را export کن.', 'نام در h2 و قیمت با قالب $49 در p نمایش داده شود.', 'App کارت Keyboard با قیمت 49 و Mouse با قیمت 29 را نمایش دهد.', 'تست‌ها کامپوننتت را با یک محصول جدید هم اجرا می‌کنند.'],
    starterFiles: starter('export function ProductCard({ name, price }) {\n  return <article>{/* از props استفاده کن */}</article>;\n}\n\nexport default function App() {\n  return (\n    <main>\n      <ProductCard name="Keyboard" price={49} />\n      <ProductCard name="Mouse" price={29} />\n    </main>\n  );\n}\n'),
    tests: [
      { id: 'products', name: 'دو کارت محصول در App', mandatory: true, source: { component: 'ProductCard' }, steps: [{ type: 'count', selector: 'article', count: 2 }, { type: 'text', selector: 'article:nth-child(1) h2', text: 'Keyboard' }, { type: 'text', selector: 'article:nth-child(2) h2', text: 'Mouse' }] },
      { id: 'dynamic-props', name: 'داده‌های جدید از props خوانده می‌شوند', mandatory: true, steps: [{ type: 'render', component: 'ProductCard', props: { name: 'Monitor', price: 199 } }, { type: 'text', selector: 'h2', text: 'Monitor' }, { type: 'text', selector: 'p', text: '$199' }] }
    ],
    hints: ['name و price از پارامترهای ProductCard در دسترس‌اند.', 'برای استفاده از مقدار جاوااسکریپت در JSX از {} استفاده کن.', 'قیمت را با ${price} یا ترکیب متن $ و {price} نمایش بده.'],
    xp: 200, coins: 25, prerequisites: ['profile-card']
  },
  {
    id: 'click-events', title: 'آمادهٔ پرتاب!', topic: 'Events',
    description: 'یک کلیک می‌تواند همه‌چیز را تغییر دهد. تابع رویداد را به دکمه وصل کن.',
    instructions: ['LaunchButton را export کن؛ یک button با متن Launch برگرداند.', 'پس از کلیک، تابع onLaunch که از props دریافت شده اجرا شود.', 'تابع نباید هنگام render اجرا شود.', 'App ابتدا Ready و پس از کلیک Launched را در p نمایش دهد.'],
    starterFiles: starter('import { useState } from "react";\n\nexport function LaunchButton({ onLaunch }) {\n  return <button>Launch</button>;\n}\n\nexport default function App() {\n  const [message, setMessage] = useState("Ready");\n  return (\n    <main>\n      <p>{message}</p>\n      <LaunchButton onLaunch={() => setMessage("Launched")} />\n    </main>\n  );\n}\n'),
    tests: [
      { id: 'callback', name: 'تابع فقط پس از کلیک اجرا می‌شود', mandatory: true, steps: [{ type: 'render', component: 'LaunchButton', callbackProp: 'onLaunch' }, { type: 'callback', count: 0 }, { type: 'click', selector: 'button' }, { type: 'callback', count: 1 }] },
      { id: 'event-result', name: 'کلیک پیام صفحه را تغییر می‌دهد', mandatory: true, steps: [{ type: 'text', selector: 'p', text: 'Ready' }, { type: 'click', selector: 'button' }, { type: 'text', selector: 'p', text: 'Launched' }] }
    ],
    hints: ['React برای کلیک از ویژگی onClick استفاده می‌کند.', 'خود تابع را به onClick بده، نه نتیجهٔ اجرای تابع را.', 'از onClick={onLaunch} روی دکمهٔ LaunchButton استفاده کن.'],
    xp: 200, coins: 25, prerequisites: ['product-props']
  },
  {
    id: 'state-counter', title: 'شمارندهٔ زنده', topic: 'useState',
    description: 'با state رابطی بساز که تغییرات را به خاطر می‌سپارد. بعد از آن، رفتار state را در مسئله‌های تازه امتحان می‌کنی.',
    instructions: ['از useState با مقدار اولیهٔ صفر استفاده کن.', 'مقدار را در یک output نمایش بده.', 'سه دکمه با متن‌های +1، -1 و Reset بساز.', 'افزایش، کاهش و بازنشانی باید واقعاً مقدار را تغییر دهند.'],
    starterFiles: starter('import { useState } from "react";\n\nexport default function App() {\n  // state شمارنده را این‌جا تعریف کن\n  return (\n    <main>\n      <h1>Counter</h1>\n      <output>0</output>\n      <div>\n        <button>+1</button>\n        <button>-1</button>\n        <button>Reset</button>\n      </div>\n    </main>\n  );\n}\n'),
    tests: [
      { id: 'initial', name: 'useState و مقدار اولیهٔ صفر', mandatory: true, source: { hook: 'useState' }, steps: [{ type: 'text', selector: 'output', text: '0' }] },
      { id: 'increment', name: 'دو کلیک، دو واحد افزایش', mandatory: true, steps: [{ type: 'click', selector: 'button:nth-child(1)', times: 2 }, { type: 'text', selector: 'output', text: '2' }] },
      { id: 'decrement', name: 'کاهش مقدار', mandatory: true, steps: [{ type: 'click', selector: 'button:nth-child(2)' }, { type: 'text', selector: 'output', text: '-1' }] },
      { id: 'reset', name: 'بازنشانی پس از تغییر', mandatory: true, steps: [{ type: 'click', selector: 'button:nth-child(1)', times: 3 }, { type: 'click', selector: 'button:nth-child(3)' }, { type: 'text', selector: 'output', text: '0' }] }
    ],
    hints: ['useState یک مقدار و یک تابع برای تغییر آن برمی‌گرداند.', 'const [count, setCount] = useState(0) نقطهٔ شروع خوبی است.', 'در onClick یک تابع بنویس؛ مثلاً () => setCount(value => value + 1).'],
    xp: 200, coins: 30, prerequisites: ['click-events']
  }
];

const foundationMeta = [
  { chapterId: 1, skills: ['jsx'], solution: 'export default function App(){return <main><h1>Hello React</h1><p>My React journey starts here.</p></main>;}' },
  { chapterId: 2, skills: ['components'], project: { id: 'profile', step: 1 }, solution: 'export function ProfileCard(){return <section><h2>Ada Lovelace</h2><p>React Developer</p><button>Follow</button></section>;}\nexport default function App(){return <main><ProfileCard/></main>;}' },
  { chapterId: 2, skills: ['props'], solution: 'export function ProductCard({name,price}){return <article><h2>{name}</h2><p>${price}</p></article>;}\nexport default function App(){return <main><ProductCard name="Keyboard" price={49}/><ProductCard name="Mouse" price={29}/></main>;}' },
  { chapterId: 3, skills: ['events'], solution: 'import {useState} from "react";\nexport function LaunchButton({onLaunch}){return <button onClick={onLaunch}>Launch</button>;}\nexport default function App(){const[m,setM]=useState("Ready");return <main><p>{m}</p><LaunchButton onLaunch={()=>setM("Launched")}/></main>;}' },
  { chapterId: 3, skills: ['state'], solution: 'import {useState} from "react";\nexport default function App(){const[n,setN]=useState(0);return <main><h1>Counter</h1><output>{n}</output><div><button onClick={()=>setN(v=>v+1)}>+1</button><button onClick={()=>setN(v=>v-1)}>-1</button><button onClick={()=>setN(0)}>Reset</button></div></main>;}' }
];
export const foundationIds = foundationChallenges.map(challenge => challenge.id);
export const challenges: Challenge[] = [...foundationChallenges.map((challenge, index) => ({ ...challenge, kind: 'write' as const, difficulty: 1, minutes: 6, ...foundationMeta[index], concept: chapters.find(chapter => chapter.id === foundationMeta[index]!.chapterId)!.concept, hints: [...challenge.hints, 'در handler مقدار تازه را با دادهٔ ورودی همان کامپوننت بساز؛ یک بخش را هر بار تست کن.'] })), ...extraChallenges, ...advancedChallenges, ...buildChallenges];
export function getChallenge(id: string) { return challenges.find((challenge) => challenge.id === id); }
export function hasRecommendedPrerequisites(challenge: Challenge, completed: string[]) { return challenge.prerequisites.every((id) => completed.includes(id)); }
export function isChallengeAvailable(challenge: Challenge) { return getChallenge(challenge.id) !== undefined; }
