import dayjs, { type Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

import currencies from '@/data/currencies';
import settings from '@/lib/settings';
import type { DateRangePreset, StrictDateRange } from '@/types/common';

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

export function getDateRange(preset: DateRangePreset): StrictDateRange {
  const now = dayjs();
  switch (preset) {
    case 'This Month':
      return { start: now.startOf('month'), end: now.endOf('month') };
    case 'Last Month':
      return {
        start: now.subtract(1, 'month').startOf('month'),
        end: now.subtract(1, 'month').endOf('month'),
      };
    case 'Last 28 days':
      return { start: now.subtract(28, 'day'), end: now };
    case 'Last 60 days':
      return { start: now.subtract(60, 'day'), end: now };
    case 'Last 90 days':
      return { start: now.subtract(90, 'day'), end: now };
    default:
      throw new Error(`Unknown preset: ${preset}`);
  }
}
