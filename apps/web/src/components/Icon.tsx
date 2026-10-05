type Props = { name: 'atom' | 'settings' | 'pause' | 'play' | 'arrow' | 'lock' | 'room' | 'close' | 'reset'; size?: number };

export function Icon({ name, size = 20 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {name === 'atom' && <><ellipse cx="12" cy="12" rx="10" ry="3.5" /><ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(120 12 12)" /><circle cx="12" cy="12" r="1.4" fill="currentColor" /></>}
      {name === 'settings' && <><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" /><path d="m9 3 1 2h4l1-2 3 2-.5 2 2 3 2 .5v3l-2 .5-2 3 .5 2-3 2-1-2h-4l-1 2-3-2 .5-2-2-3-2-.5v-3l2-.5 2-3L6 5Z" /></>}
      {name === 'pause' && <><path d="M8 5v14M16 5v14" strokeWidth="3" /></>}
      {name === 'play' && <path d="m8 5 11 7-11 7Z" />}
      {name === 'arrow' && <path d="M19 12H5m6-6-6 6 6 6" />}
      {name === 'lock' && <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>}
      {name === 'room' && <><path d="m3 10 9-7 9 7v11H3ZM9 21v-8h6v8" /></>}
      {name === 'close' && <path d="m6 6 12 12M18 6 6 18" />}
      {name === 'reset' && <><path d="M3 11a9 9 0 1 1 2 7M3 4v7h7" /></>}
    </svg>
  );
}
