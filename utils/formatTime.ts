import { format, formatDistance, differenceInDays } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';

export type FormatOptions = {
  locale?: 'ko' | 'en';
  showRelative?: boolean;
};

export function formatDateTime(
  utcDateString: string,
  { locale = 'ko', showRelative = true }: FormatOptions = {}
): string {
  if (!utcDateString.includes('Z') && !utcDateString.includes('+')) {
    utcDateString += '+00:00';
  }

  const convertedDate = new Date(utcDateString);
  const nowLocal = new Date();
  const selectedLocale = locale === 'ko' ? ko : enUS;

  // 두 날짜 간 차이를 계산
  const daysDifference = differenceInDays(nowLocal, convertedDate);

  // 상대시간 표시 여부 및 7일 이내일 경우 상대시간 표시
  if (showRelative && daysDifference <= 7) {
    return formatDistance(convertedDate, nowLocal, {
      addSuffix: true,
      locale: selectedLocale,
    });
  }

  // 절대시간 (8일 이상일 때)
  const dateFormat = locale === 'ko' ? 'yyyy.MM.dd HH:mm' : 'MM/dd/yyyy HH:mm';
  return format(convertedDate, dateFormat);
}
