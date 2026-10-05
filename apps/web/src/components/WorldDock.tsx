import { tx, useLanguage } from '@react-quest/localization';
import { useState } from 'react';
import { GAME_NET, type RoomSpotId } from '@react-quest/game';

type Props = {
  onNavigate: (id: RoomSpotId) => void;
  active?: RoomSpotId;
  drops: number;
  cards: number;
  greenhouseOpen: boolean;
  keyCollected: boolean;
  xp: number;
};

export function WorldDock({ onNavigate, active, drops, cards, greenhouseOpen, keyCollected, xp }: Props) {
  useLanguage();
  const [open, setOpen] = useState(false);
  const destinations: { id: RoomSpotId; title: string; detail: string; icon: string }[] = [
    { id: 'computer', title: 'کامپیوتر یادگیری', detail: 'React را از صفر یاد بگیر', icon: '⌨' },
    { id: 'sofa', title: 'مطالعه روی مبل', detail: 'بنشین و کتاب React ورق بزن', icon: '▤' },
    { id: 'books', title: 'کتابخانهٔ React', detail: `${cards} برگ دانش + راهنمای شروع`, icon: '▥' },
    { id: 'television', title: 'نشستن پای تلویزیون', detail: cards >= 2 ? 'اتاق نشیمن · فیلم آموزشی' : 'با کامل کردن ۲ تمرین', icon: '▷' },
    { id: 'plant', title: 'آب دادن به گل‌ها', detail: `${drops} قطره آماده`, icon: '❀' },
    { id: 'key', title: 'برداشتن کلید', detail: keyCollected ? 'کلید را داری' : 'با کامل کردن ۳ تمرین', icon: '⚿' },
    { id: greenhouseOpen ? 'greenhouse' : 'door', title: greenhouseOpen ? 'رفتن به گلخانه' : 'باز کردن درِ گلخانه', detail: greenhouseOpen ? 'پرورش گل‌ها' : 'کلید را از میز بردار', icon: '⌂' },
    { id: 'quietRoom', title: 'اتاق آرام', detail: 'گوشه‌ای برای استراحت', icon: '☾' },
    { id: 'kitchen', title: 'آشپزخانه', detail: 'یک اتاق تازه در خانه', icon: '◉' },
    { id: 'yard', title: 'حیاط خانه', detail: 'درخت‌ها و همسایه‌ها', icon: '♧' },
    { id: 'street', title: 'کوچهٔ یادگیری', detail: 'خانه‌های محله را ببین', icon: '↗' },
    { id: 'gameNet', title: 'گیم‌نت محله', detail: xp >= GAME_NET.requiredXp ? 'نوبت ۳ دقیقه‌ای آماده' : `${GAME_NET.requiredXp} XP برای بازی`, icon: '⌘' }
  ];
  return <aside className={`room-activity-dock world-dock ${open ? 'expanded' : ''}`} aria-label={tx("مقصدهای محله")}>
    <button className="room-dock-toggle" aria-expanded={open} aria-controls="world-destinations" onClick={() => setOpen(!open)}>
      <span className="room-dock-icon">✦</span><span><b>{tx("اتاق زندهٔ تو · محله")}</b><small>{tx(drops)}{tx(" قطره · ")}{tx(cards)}{tx(" برگ دانش")}</small></span><span>{tx(open ? '−' : '+')}</span>
    </button>
    {open && <div id="world-destinations">
      <p>{tx("یک مقصد انتخاب کن؛ کنار وسیله با E یا دکمهٔ تعامل از آن استفاده کن.")}</p>
      <div className="room-dock-list">{destinations.map(destination => <button key={destination.id} className={active === destination.id ? 'selected' : ''} aria-label={tx(`رفتن به ${destination.title}`)} onClick={() => { onNavigate(destination.id); setOpen(false); }}>
        <span className="room-item-icon">{tx(destination.icon)}</span><span><b>{tx(destination.title)}</b><small>{tx(destination.detail)}</small></span>
      </button>)}</div>
    </div>}
  </aside>;
}
