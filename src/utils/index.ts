import dayjs, { type Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

import currencies from '@/data/currencies';
import settings from '@/lib/settings';

dayjs.extend(isSameOrAfter);

export function formatCurrency(n: number) {
  const code = settings.get('currencyCode');
  const { locale } = currencies[code];

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code,
  }).format(n);
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
