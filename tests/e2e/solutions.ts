export const solutions = [
  'export default function App() { return <main><h1>Hello React</h1><p>My React journey starts here.</p></main>; }',
  'function ProfileCard() { return <section><h2>Ada Lovelace</h2><p>React Developer</p><button>Follow</button></section>; } export default function App() { return <main><ProfileCard /></main>; }',
  'export function ProductCard({ name, price }) { return <article><h2>{name}</h2><p>${price}</p></article>; } export default function App() { return <main><ProductCard name="Keyboard" price={49} /><ProductCard name="Mouse" price={29} /></main>; }',
  'import { useState } from "react"; export function LaunchButton({ onLaunch }) { return <button onClick={onLaunch}>Launch</button>; } export default function App() { const [message,setMessage] = useState("Ready"); return <main><p>{message}</p><LaunchButton onLaunch={() => setMessage("Launched")} /></main>; }',
  'import { useState } from "react"; export default function App() { const [count,setCount] = useState(0); return <main><h1>Counter</h1><output>{count}</output><div><button onClick={() => setCount(n => n+1)}>+1</button><button onClick={() => setCount(n => n-1)}>-1</button><button onClick={() => setCount(0)}>Reset</button></div></main>; }'
];
