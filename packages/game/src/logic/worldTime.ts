export function getWorldTime(timestamp: number) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Tehran', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(timestamp);
  const value = (type: string) => Number(parts.find(part => part.type === type)?.value ?? 0);
  const hour = value('hour');
  const minute = value('minute');
  const second = value('second');
  const fractionalHour = hour + minute / 60;
  return {
    hourAngle: -(hour % 12 + minute / 60) * Math.PI / 6,
    minuteAngle: -(minute + second / 60) * Math.PI / 30,
    daylight: Math.max(0, Math.sin((fractionalHour - 6) / 12 * Math.PI)),
    hour,
    minute
  };
}
