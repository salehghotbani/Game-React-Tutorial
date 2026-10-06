import { contentHelpers as h } from './content';
const { lesson, t, text, click, input, count } = h;

export const kanbanSolution = `import {useEffect,useState} from "react";
export function useBoard(){
 const[cards,setCards]=useState(()=>JSON.parse(localStorage.getItem("board")||"[]"));
 useEffect(()=>localStorage.setItem("board",JSON.stringify(cards)),[cards]);
 return {cards,add:title=>{if(title.trim())setCards(items=>[...items,{id:Date.now()+Math.random(),title:title.trim(),status:"todo"}]);},move:(id,status)=>setCards(items=>items.map(card=>card.id===id?{...card,status}:card)),remove:id=>setCards(items=>items.filter(card=>card.id!==id))};
}
export function BoardCard({card,move,remove}){return <article><h2>{card.title}</h2><select aria-label="Status" value={card.status} onChange={e=>move(card.id,e.target.value)}><option value="todo">To do</option><option value="doing">Doing</option><option value="done">Done</option></select><button data-delete onClick={()=>remove(card.id)}>Delete</button></article>;}
export default function App(){const{cards,add,move,remove}=useBoard();const[title,setTitle]=useState("");return <main><h1>My Project Board</h1><form onSubmit={e=>{e.preventDefault();add(title);setTitle("");}}><input aria-label="Card title" value={title} onChange={e=>setTitle(e.target.value)}/><button data-add>Add</button></form><output>{cards.filter(c=>c.status==="done").length}</output><div style={{display:"flex",gap:20,flexWrap:"wrap"}}>{["todo","doing","done"].map(status=><section key={status} data-column={status}><h2>{status}</h2>{cards.filter(c=>c.status===status).map(card=><BoardCard key={card.id} card={card} move={move} remove={remove}/>)}</section>)}</div></main>;}`;

export const budgetSolution = `import {useEffect,useState} from "react";
export function useExpenses(){
 const[expenses,setExpenses]=useState(()=>JSON.parse(localStorage.getItem("expenses")||"[]"));
 useEffect(()=>localStorage.setItem("expenses",JSON.stringify(expenses)),[expenses]);
 return {expenses,add:(title,amount,category)=>{if(title.trim()&&Number(amount)>0)setExpenses(items=>[...items,{id:Date.now()+Math.random(),title:title.trim(),amount:Number(amount),category}]);},remove:id=>setExpenses(items=>items.filter(item=>item.id!==id))};
}
export function ExpenseRow({expense,remove}){return <li><span>{expense.title}</span><b>{expense.amount}</b><button data-delete onClick={()=>remove(expense.id)}>Delete</button></li>;}
export default function App(){const{expenses,add,remove}=useExpenses();const[title,setTitle]=useState(""),[amount,setAmount]=useState(""),[category,setCategory]=useState("food"),[filter,setFilter]=useState("all");return <main><h1>My Budget</h1><form onSubmit={e=>{e.preventDefault();add(title,amount,category);setTitle("");setAmount("");}}><input aria-label="Expense title" value={title} onChange={e=>setTitle(e.target.value)}/><input aria-label="Amount" type="number" value={amount} onChange={e=>setAmount(e.target.value)}/><select aria-label="Category" value={category} onChange={e=>setCategory(e.target.value)}><option value="food">Food</option><option value="travel">Travel</option></select><button data-add>Add</button></form><output>{expenses.reduce((sum,item)=>sum+item.amount,0)}</output><select aria-label="Filter" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All</option><option value="food">Food</option><option value="travel">Travel</option></select><ul>{expenses.filter(item=>filter==="all"||item.category===filter).map(expense=><ExpenseRow key={expense.id} expense={expense} remove={remove}/>)}</ul></main>;}`;

export const buildChallenges = [
  lesson({
    id: 'build-board', chapterId: 14, title: 'آزمون ساخت: تابلوی پروژهٔ من', kind: 'boss', mastery: true, difficulty: 4, minutes: 35, xp: 400,
    skills: ['architecture', 'state', 'lists'], project: { id: 'board', step: 1 }, prerequisites: ['todo-hook'],
    description: 'یک تابلوی سه‌ستونه بساز؛ کارت‌ها را جابه‌جا کن و ساخته‌ات را در همین سایت اجرا کن.',
    instructions: ['عنوان h1 برابر My Project Board و سه section با data-column برابر todo، doing و done بساز.', 'فرم با input با aria-label="Card title" و دکمهٔ data-add بساز؛ عنوان خالی کارت نسازد.', 'BoardCard و useBoard را export کن. هر کارت article با عنوان h2، select با aria-label="Status" و مقدار todo/doing/done و دکمهٔ data-delete باشد.', 'output تعداد کارت‌های done را نشان دهد. کارت‌ها را در کلید board ذخیره کن؛ بعد از بازگشت باقی بمانند.', 'با نمایش ساختهٔ من در سایت، برنامهٔ خودت را باز کن و با آن کار کن.'],
    solution: kanbanSolution,
    tests: [
      t('add', 'ساخت کارت و اعتبارسنجی عنوان', [click('[data-add]'), count('article', 0), input('[aria-label="Card title"]', 'Learn React'), click('[data-add]'), text('[data-column="todo"] article h2', 'Learn React'), count('section[data-column]', 3)], { component: 'BoardCard', function: 'useBoard' }),
      t('move', 'جابه‌جایی واقعی بین ستون‌ها', [input('[aria-label="Card title"]', 'Ship app'), click('[data-add]'), input('article select', 'doing'), count('[data-column="todo"] article', 0), text('[data-column="doing"] article h2', 'Ship app'), input('article select', 'done'), text('output', '1'), count('[data-column="done"] article', 1)]),
      t('persist', 'بازیابی کارت و وضعیت ذخیره‌شده', [input('[aria-label="Card title"]', 'Keep board'), click('[data-add]'), input('article select', 'done'), { type: 'storage', key: 'board', contains: 'Keep board' }, { type: 'remount' }, text('[data-column="done"] article h2', 'Keep board'), text('output', '1')]),
      t('delete', 'حذف کارت و اصلاح تعداد', [input('[aria-label="Card title"]', 'Temporary'), click('[data-add]'), input('article select', 'done'), click('[data-delete]'), count('article', 0), text('output', '0')])
    ]
  }),
  lesson({
    id: 'build-budget', chapterId: 14, title: 'آزمون ساخت: داشبورد هزینهٔ من', kind: 'boss', mastery: true, difficulty: 5, minutes: 40, xp: 400,
    skills: ['architecture', 'forms', 'state'], project: { id: 'budget', step: 1 }, prerequisites: ['todo-hook'],
    description: 'یک برنامهٔ هزینه بساز که افزودن، فیلتر، جمع و ذخیره را واقعاً در مرورگر انجام دهد.',
    instructions: ['عنوان h1 برابر My Budget باشد. inputهای Expense title و Amount و select با aria-label="Category" و مقدار food/travel بساز.', 'دکمهٔ data-add فقط عنوان غیرخالی و مبلغ مثبت را ثبت کند.', 'ExpenseRow و useExpenses را export کن. هر هزینه li با span عنوان، مبلغ و دکمهٔ data-delete داشته باشد.', 'output جمع تمام هزینه‌ها باشد؛ select با aria-label="Filter" و مقدار all/food/travel فقط نمای لیست را فیلتر کند.', 'در کلید expenses ذخیره کن و پس از بازگشت بازیابی کن. ساختهٔ خودت را داخل سایت نمایش بده.'],
    solution: budgetSolution,
    tests: [
      t('validation', 'رد عنوان خالی و مبلغ نامعتبر', [click('[data-add]'), count('li', 0), input('[aria-label="Expense title"]', 'Invalid'), input('[aria-label="Amount"]', '-5'), click('[data-add]'), count('li', 0)], { component: 'ExpenseRow', function: 'useExpenses' }),
      t('total-filter', 'جمع عددی مستقل از فیلتر', [input('[aria-label="Expense title"]', 'Lunch'), input('[aria-label="Amount"]', '12'), click('[data-add]'), input('[aria-label="Expense title"]', 'Train'), input('[aria-label="Amount"]', '8'), input('[aria-label="Category"]', 'travel'), click('[data-add]'), text('output', '20'), input('[aria-label="Filter"]', 'food'), count('li', 1), text('li span', 'Lunch'), text('output', '20'), input('[aria-label="Filter"]', 'all'), count('li', 2)]),
      t('persist', 'بازیابی هزینه‌ها پس از بازگشت', [input('[aria-label="Expense title"]', 'Notebook'), input('[aria-label="Amount"]', '7'), click('[data-add]'), { type: 'storage', key: 'expenses', contains: 'Notebook' }, { type: 'remount' }, text('li span', 'Notebook'), text('output', '7')]),
      t('delete', 'حذف هزینه و محاسبهٔ دوبارهٔ جمع', [input('[aria-label="Expense title"]', 'Temporary'), input('[aria-label="Amount"]', '4'), click('[data-add]'), click('[data-delete]'), count('li', 0), text('output', '0')])
    ]
  })
];
export const buildProjects = [
  { id: 'board', title: 'My Project Board', description: 'آزمون مستقل ساخت تابلوی پروژه', chapterId: 14 },
  { id: 'budget', title: 'My Budget', description: 'آزمون مستقل ساخت داشبورد هزینه', chapterId: 14 }
];
