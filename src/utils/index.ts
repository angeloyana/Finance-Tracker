import dayjs, { type Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrAfter);

export function formatCurrency(n: number) {
  return (
    '$' +
    n.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

export function formatDate(date: Dayjs) {
  let fmt: string;
  if (dayjs().isSame(date, 'day')) {
    fmt = 'hh:mm A';
  } else if (dayjs().subtract(1, 'day').isSame(date, 'day')) {
    fmt = '[Yesterday], hh:mm A';
  } else if (date.isSameOrAfter(dayjs().subtract(6, 'day'))) {
    fmt = 'ddd, hh:mm A';
  } else if (dayjs().isSame(date, 'year')) {
    fmt = 'MMM DD';
  } else {
    fmt = 'MMM DD, YYYY';
  }

  return date.format(fmt);
}
