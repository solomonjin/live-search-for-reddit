export default function formatDate(time) {
  const date = new Date(time * 1000);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDay();
  let hour = date.getHours();
  const min = date.getMinutes();
  let twelveHour;
  if (hour > 12) {
    hour -= 12;
    twelveHour = 'PM';
  } else {
    twelveHour = 'AM';
  }
  return `${month} ${day} ${hour}:${min.toString().length < 2 ? '0' + min : min} ${twelveHour}`;
}
