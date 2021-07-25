export default function formatDate(time) {
  const date = new Date(time * 1000);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  let hour = date.getHours();
  const min = date.getMinutes();
  const twelveHour = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour || 12;
  return `${month} ${day} ${hour}:${min.toString().length < 2 ? '0' + min : min} ${twelveHour}`;
}
